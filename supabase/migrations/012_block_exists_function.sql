-- Husky: fix one-directional block enforcement (Safety Stage 3 follow-up).
-- Run this once in the Supabase SQL Editor -- requires 011_blocks.sql to
-- already be applied.
--
-- Bug: the messages insert policy from 011_blocks.sql checked for a block
-- with "not exists (select 1 from public.blocks where ...)". That
-- subquery runs under the CALLING user's own RLS visibility into blocks
-- -- and blocks' select policy only lets a user see rows where THEY are
-- the blocker. So when a blocked user B tried to message the blocker A,
-- B's copy of that subquery could only ever see blocks where
-- blocker_id = B, never the row where blocker_id = A -- the one row that
-- actually matters. "not exists" therefore always evaluated true for B,
-- silently defeating the one direction of enforcement that matters most
-- (a blocked user being unable to message the person who blocked them).
--
-- Fix: a SECURITY DEFINER function, which runs with the privileges of its
-- owner rather than the calling user, so it can see every row in blocks
-- regardless of the caller's own RLS visibility into that table -- while
-- the function's own logic restricts it to only ever answering for a pair
-- of users that includes the caller, so it can't be abused as a general
-- "does X block Y" oracle for arbitrary other people. search_path is
-- pinned explicitly, standard practice for SECURITY DEFINER functions, so
-- a malicious search_path can't redirect the unqualified table reference
-- inside it. EXECUTE is granted only to authenticated, not anon/public.

create or replace function public.block_exists_between(user_a uuid, user_b uuid)
returns boolean
language sql
security definer
set search_path = public, pg_temp
stable
as $$
  select case
    when auth.uid() is null or (auth.uid() <> user_a and auth.uid() <> user_b) then false
    else exists (
      select 1 from public.blocks
      where (blocker_id = user_a and blocked_id = user_b)
         or (blocker_id = user_b and blocked_id = user_a)
    )
  end;
$$;

revoke all on function public.block_exists_between(uuid, uuid) from public;
grant execute on function public.block_exists_between(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Replaces the messages insert policy from 011_blocks.sql with a version
-- that uses the function above instead of a direct subquery against
-- blocks -- this is the actual bug fix.
-- ---------------------------------------------------------------------------

drop policy "Users can send messages as themselves" on public.messages;

create policy "Users can send messages as themselves"
  on public.messages
  for insert
  with check (
    auth.uid() = sender_id
    and not public.block_exists_between(sender_id, recipient_id)
  );

-- ---------------------------------------------------------------------------
-- The listings select policy from 011_blocks.sql was NOT actually affected
-- by this bug -- it only ever checks "blocks where I am the blocker"
-- (blocks.blocker_id = auth.uid()), which blocks' own select policy
-- already permits the viewer to see about themselves, so there was no
-- visibility mismatch. Switched to the shared function anyway so this
-- logic only has to be correct in one place.
-- ---------------------------------------------------------------------------

drop policy "Any signed-in user can view listings" on public.listings;

create policy "Any signed-in user can view listings"
  on public.listings
  for select
  using (
    auth.uid() is not null
    and not public.block_exists_between(auth.uid(), seller_id)
  );
