-- Husky: user reports (Safety Stage 1 -- report a listing; Stage 2 will
-- reuse this same table for reporting a user from chat). Run this once in
-- the Supabase SQL Editor.
--
-- reported_user_id/listing_id/message_id all use "on delete set null"
-- rather than cascade, so a report survives even if the reported listing,
-- message, or account is deleted afterward -- this is the evidence an
-- admin reviews, and shouldn't be easy to make disappear by deleting the
-- thing being reported. reporter_id does cascade, consistent with the
-- "delete everything tied to me" account-deletion promise.
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users (id) on delete cascade,
  reported_user_id uuid references auth.users (id) on delete set null,
  listing_id uuid references public.listings (id) on delete set null,
  message_id uuid references public.messages (id) on delete set null,
  reason text not null check (reason in ('spam', 'scam', 'inappropriate', 'animal_welfare', 'other')),
  note text,
  created_at timestamptz not null default now()
);

create index reports_reported_user_id_idx on public.reports (reported_user_id);
create index reports_listing_id_idx on public.reports (listing_id);

alter table public.reports enable row level security;

-- Deliberately no select/update/delete policy: reports are visible only
-- to the project admin via the Supabase dashboard (which bypasses RLS),
-- never through the app's own API -- not even to the person who filed
-- the report.
create policy "Users can submit reports as themselves"
  on public.reports
  for insert
  with check (auth.uid() = reporter_id);
