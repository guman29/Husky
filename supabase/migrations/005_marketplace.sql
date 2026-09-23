-- PetPal: listings + messages (Stage 7 -- marketplace + in-app chat)
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

-- listings: a pet someone is listing for sale/adoption. seller_email is
-- captured at creation time from the logged-in user, since the client can't
-- query auth.users directly to look emails up later.
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users (id) on delete cascade,
  seller_email text not null,
  pet_type text not null,
  breed text,
  age text,
  location text,
  description text,
  created_at timestamptz not null default now()
);

create index listings_seller_id_idx on public.listings (seller_id);

-- messages: a single chat message tied to a listing, between the sender and
-- recipient. sender_email is captured the same way as seller_email above.
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  sender_id uuid not null references auth.users (id) on delete cascade,
  sender_email text not null,
  recipient_id uuid not null references auth.users (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index messages_listing_id_idx on public.messages (listing_id);
create index messages_sender_id_idx on public.messages (sender_id);
create index messages_recipient_id_idx on public.messages (recipient_id);

alter table public.listings enable row level security;

-- Unlike every other table so far, listings are meant to be browsed by
-- everyone, not just their owner -- that's the whole point of a
-- marketplace. Only creating/editing/deleting is restricted to the seller.
create policy "Any signed-in user can view listings"
  on public.listings
  for select
  using (auth.uid() is not null);

create policy "Users can create their own listings"
  on public.listings
  for insert
  with check (auth.uid() = seller_id);

create policy "Users can update their own listings"
  on public.listings
  for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

create policy "Users can delete their own listings"
  on public.listings
  for delete
  using (auth.uid() = seller_id);

alter table public.messages enable row level security;

create policy "Users can view messages they sent or received"
  on public.messages
  for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "Users can send messages as themselves"
  on public.messages
  for insert
  with check (auth.uid() = sender_id);
