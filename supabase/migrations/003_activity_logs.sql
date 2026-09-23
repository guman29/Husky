-- PetPal: activity_logs (Stage 4 -- daily activity log per pet: walks, playtime, etc)
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  activity_type text not null,
  duration_minutes integer not null,
  logged_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index activity_logs_pet_id_idx on public.activity_logs (pet_id);

alter table public.activity_logs enable row level security;

create policy "Users can manage activity logs for their own pets"
  on public.activity_logs
  for all
  using (exists (
    select 1 from public.pets
    where pets.id = activity_logs.pet_id and pets.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pets
    where pets.id = activity_logs.pet_id and pets.owner_id = auth.uid()
  ));
