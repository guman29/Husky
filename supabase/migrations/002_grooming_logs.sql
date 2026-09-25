-- Husky: grooming_logs (Stage 3 -- daily grooming log per pet)
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table public.grooming_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  task text not null,
  logged_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index grooming_logs_pet_id_idx on public.grooming_logs (pet_id);

alter table public.grooming_logs enable row level security;

create policy "Users can manage grooming logs for their own pets"
  on public.grooming_logs
  for all
  using (exists (
    select 1 from public.pets
    where pets.id = grooming_logs.pet_id and pets.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pets
    where pets.id = grooming_logs.pet_id and pets.owner_id = auth.uid()
  ));
