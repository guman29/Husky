-- Husky: reminders (Stage 6 -- custom reminders with browser notifications)
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  message text not null,
  remind_at timestamptz not null,
  notified boolean not null default false,
  created_at timestamptz not null default now()
);

create index reminders_user_id_idx on public.reminders (user_id);

alter table public.reminders enable row level security;

create policy "Users can manage their own reminders"
  on public.reminders
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
