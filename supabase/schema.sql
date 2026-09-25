-- Husky database schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- for a brand-new project. This file is kept up to date with every table Husky
-- uses; incremental changes to an *existing* project live as separate files in
-- supabase/migrations/ (run those instead if you already have this schema).

-- ---------------------------------------------------------------------------
-- pets: one row per pet, owned by the user who created it (auth.users is
-- Supabase's built-in table of signed-up accounts, so we just reference it).
-- ---------------------------------------------------------------------------
create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  -- birthday: legacy exact-date field, kept only for rows written before
  -- age_value/age_unit existed. The Add Pet wizard now collects age as a
  -- number + unit instead of an exact birthday.
  birthday date,
  age_value numeric,
  age_unit text check (age_unit in ('week', 'month', 'year')),
  location text,
  location_lat numeric,
  location_lon numeric,
  avatar_url text,
  created_at timestamptz not null default now()
);

create index pets_owner_id_idx on public.pets (owner_id);

-- ---------------------------------------------------------------------------
-- vaccines: one row per vaccine given to a pet.
-- ---------------------------------------------------------------------------
create table public.vaccines (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  name text not null,
  date_given date not null,
  next_due_date date,
  notes text,
  created_at timestamptz not null default now()
);

create index vaccines_pet_id_idx on public.vaccines (pet_id);

-- ---------------------------------------------------------------------------
-- vet_visits: one row per vet visit for a pet.
-- ---------------------------------------------------------------------------
create table public.vet_visits (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  visit_date date not null,
  reason text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index vet_visits_pet_id_idx on public.vet_visits (pet_id);

-- ---------------------------------------------------------------------------
-- feeding_logs: one row per feeding entry for a pet.
-- ---------------------------------------------------------------------------
create table public.feeding_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  logged_at timestamptz not null default now(),
  food text not null,
  amount text,
  notes text,
  created_at timestamptz not null default now()
);

create index feeding_logs_pet_id_idx on public.feeding_logs (pet_id);

-- ---------------------------------------------------------------------------
-- weight_logs: one row per weight check-in for a pet.
-- ---------------------------------------------------------------------------
create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  logged_at date not null default current_date,
  weight numeric not null,
  unit text not null default 'lb' check (unit in ('lb', 'kg')),
  created_at timestamptz not null default now()
);

create index weight_logs_pet_id_idx on public.weight_logs (pet_id);

-- ---------------------------------------------------------------------------
-- grooming_logs: one row per grooming task done for a pet (bathing,
-- brushing, nail trimming, etc).
-- ---------------------------------------------------------------------------
create table public.grooming_logs (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets (id) on delete cascade,
  task text not null,
  logged_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index grooming_logs_pet_id_idx on public.grooming_logs (pet_id);

-- ---------------------------------------------------------------------------
-- activity_logs: one row per activity done with a pet (walks, playtime, etc).
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- reminders: one row per custom reminder a user sets. Not tied to a specific
-- pet. "notified" tracks whether the browser notification for it has already
-- fired, so it isn't shown again on a later page load.
-- ---------------------------------------------------------------------------
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  message text not null,
  remind_at timestamptz not null,
  notified boolean not null default false,
  created_at timestamptz not null default now()
);

create index reminders_user_id_idx on public.reminders (user_id);

-- ---------------------------------------------------------------------------
-- listings: a pet someone is listing for sale/adoption. seller_email is
-- captured at creation time from the logged-in user, since the client can't
-- query auth.users directly to look emails up later.
-- ---------------------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users (id) on delete cascade,
  seller_email text not null,
  pet_type text not null,
  breed text,
  -- age: legacy free-text age, kept only for rows written before
  -- age_value/age_unit existed. The app now writes the structured pair
  -- instead so the "I want a pet" questionnaire can filter by age range.
  age text,
  size text check (size in ('Small', 'Medium', 'Large', 'Extra Large')),
  age_value numeric,
  age_unit text check (age_unit in ('week', 'month', 'year')),
  location text,
  description text,
  photo_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index listings_seller_id_idx on public.listings (seller_id);

-- ---------------------------------------------------------------------------
-- messages: a single chat message tied to a listing, between the sender and
-- recipient. sender_email is captured the same way as seller_email above.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Row Level Security: without this, anyone with your publishable key could
-- read or write ANY row in these tables. Enabling it turns access off by
-- default; the policies below turn it back on only for a user's own data.
-- ---------------------------------------------------------------------------

alter table public.pets enable row level security;

create policy "Users can manage their own pets"
  on public.pets
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- The four log tables don't store owner_id directly -- ownership is
-- determined through the pet they belong to, so each policy checks that
-- the related pet belongs to the current user.

alter table public.vaccines enable row level security;

create policy "Users can manage vaccines for their own pets"
  on public.vaccines
  for all
  using (exists (
    select 1 from public.pets
    where pets.id = vaccines.pet_id and pets.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pets
    where pets.id = vaccines.pet_id and pets.owner_id = auth.uid()
  ));

alter table public.vet_visits enable row level security;

create policy "Users can manage vet visits for their own pets"
  on public.vet_visits
  for all
  using (exists (
    select 1 from public.pets
    where pets.id = vet_visits.pet_id and pets.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pets
    where pets.id = vet_visits.pet_id and pets.owner_id = auth.uid()
  ));

alter table public.feeding_logs enable row level security;

create policy "Users can manage feeding logs for their own pets"
  on public.feeding_logs
  for all
  using (exists (
    select 1 from public.pets
    where pets.id = feeding_logs.pet_id and pets.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pets
    where pets.id = feeding_logs.pet_id and pets.owner_id = auth.uid()
  ));

alter table public.weight_logs enable row level security;

create policy "Users can manage weight logs for their own pets"
  on public.weight_logs
  for all
  using (exists (
    select 1 from public.pets
    where pets.id = weight_logs.pet_id and pets.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pets
    where pets.id = weight_logs.pet_id and pets.owner_id = auth.uid()
  ));

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

alter table public.reminders enable row level security;

create policy "Users can manage their own reminders"
  on public.reminders
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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

-- ---------------------------------------------------------------------------
-- Storage: pet avatar photos. Files live at <owner_id>/<pet_id>.<ext> so the
-- policies below can check the folder name against auth.uid() directly.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('pet-avatars', 'pet-avatars', true)
on conflict (id) do nothing;

create policy "Pet avatar images are publicly viewable"
  on storage.objects
  for select
  using (bucket_id = 'pet-avatars');

create policy "Users can upload avatars into their own folder"
  on storage.objects
  for insert
  with check (
    bucket_id = 'pet-avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can replace avatars in their own folder"
  on storage.objects
  for update
  using (
    bucket_id = 'pet-avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'pet-avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete avatars in their own folder"
  on storage.objects
  for delete
  using (
    bucket_id = 'pet-avatars'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Storage: marketplace listing photos. Files live at
-- <seller_id>/<listing_id>/<filename>, same folder-per-user convention.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

create policy "Listing photos are publicly viewable"
  on storage.objects
  for select
  using (bucket_id = 'listing-photos');

create policy "Users can upload listing photos into their own folder"
  on storage.objects
  for insert
  with check (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete listing photos in their own folder"
  on storage.objects
  for delete
  using (
    bucket_id = 'listing-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
