-- Husky: block a user (Safety Stage 3 -- marketplace/chat safety). Run
-- this once in the Supabase SQL Editor.
--
-- Enforcement for the two security-relevant effects of a block (hiding a
-- blocked seller's listings, and preventing a blocked user from messaging
-- you) happens at the database level via RLS below -- not just in the
-- app's UI -- so a blocked user can't get around it by calling the
-- Supabase API directly instead of going through Husky's own code.
--
-- blocked_email is captured at block-creation time from the client (the
-- same pattern already used for seller_email/sender_email elsewhere in
-- this schema), since the client has no way to look up another user's
-- email from auth.users directly -- this is purely so the "Blocked
-- users" list in Settings can show something human-readable instead of a
-- bare user id.

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references auth.users (id) on delete cascade,
  blocked_id uuid not null references auth.users (id) on delete cascade,
  blocked_email text,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create index blocks_blocker_id_idx on public.blocks (blocker_id);
create index blocks_blocked_id_idx on public.blocks (blocked_id);

alter table public.blocks enable row level security;

-- A user can only ever see blocks where THEY are the blocker -- never rows
-- where they're the one being blocked. This is what keeps a blocked user
-- from being able to discover that they've been blocked.
create policy "Users can view their own blocks"
  on public.blocks
  for select
  using (auth.uid() = blocker_id);

create policy "Users can create their own blocks"
  on public.blocks
  for insert
  with check (auth.uid() = blocker_id);

create policy "Users can delete their own blocks"
  on public.blocks
  for delete
  using (auth.uid() = blocker_id);

-- ---------------------------------------------------------------------------
-- Enforcement: hide a blocked seller's listings from Browse Pets. Replaces
-- the existing "Any signed-in user can view listings" policy (originally
-- from schema.sql / 005_marketplace.sql) with a version that also excludes
-- listings from anyone the viewer has blocked.
-- ---------------------------------------------------------------------------

drop policy "Any signed-in user can view listings" on public.listings;

create policy "Any signed-in user can view listings"
  on public.listings
  for select
  using (
    auth.uid() is not null
    and not exists (
      select 1 from public.blocks
      where blocks.blocker_id = auth.uid()
        and blocks.blocked_id = listings.seller_id
    )
  );

-- ---------------------------------------------------------------------------
-- Enforcement: a blocked user can't send a new message to the person who
-- blocked them, and a user can't message someone they've blocked either
-- (checked in both directions). Replaces the existing "Users can send
-- messages as themselves" policy (originally from schema.sql /
-- 005_marketplace.sql).
-- ---------------------------------------------------------------------------

drop policy "Users can send messages as themselves" on public.messages;

create policy "Users can send messages as themselves"
  on public.messages
  for insert
  with check (
    auth.uid() = sender_id
    and not exists (
      select 1 from public.blocks
      where (blocks.blocker_id = sender_id and blocks.blocked_id = recipient_id)
         or (blocks.blocker_id = recipient_id and blocks.blocked_id = sender_id)
    )
  );
