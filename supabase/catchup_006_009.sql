-- Husky: idempotent catch-up for migrations 006-009. Safe to run
-- regardless of which of those you've already applied -- every statement
-- either uses IF NOT EXISTS/ON CONFLICT, or drops-then-recreates policies
-- so re-running this never errors on "already exists".

alter table public.listings
  add column if not exists size text,
  add column if not exists age_value numeric,
  add column if not exists age_unit text,
  add column if not exists photo_urls text[] not null default '{}';

alter table public.pets
  add column if not exists age_value numeric,
  add column if not exists age_unit text,
  add column if not exists location text,
  add column if not exists location_lat numeric,
  add column if not exists location_lon numeric,
  add column if not exists avatar_url text;

-- Re-add the check constraints separately so the ADD COLUMN calls above
-- stay simple even on a partially-migrated table.
do $$
begin
  alter table public.listings add constraint listings_size_check
    check (size in ('Small', 'Medium', 'Large', 'Extra Large'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.listings add constraint listings_age_unit_check
    check (age_unit in ('week', 'month', 'year'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.pets add constraint pets_age_unit_check
    check (age_unit in ('week', 'month', 'year'));
exception when duplicate_object then null;
end $$;

insert into storage.buckets (id, name, public)
values ('pet-avatars', 'pet-avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

drop policy if exists "Pet avatar images are publicly viewable" on storage.objects;
create policy "Pet avatar images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'pet-avatars');

drop policy if exists "Users can upload avatars into their own folder" on storage.objects;
create policy "Users can upload avatars into their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'pet-avatars' and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can replace avatars in their own folder" on storage.objects;
create policy "Users can replace avatars in their own folder"
  on storage.objects for update
  using (
    bucket_id = 'pet-avatars' and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'pet-avatars' and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete avatars in their own folder" on storage.objects;
create policy "Users can delete avatars in their own folder"
  on storage.objects for delete
  using (
    bucket_id = 'pet-avatars' and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Listing photos are publicly viewable" on storage.objects;
create policy "Listing photos are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

drop policy if exists "Users can upload listing photos into their own folder" on storage.objects;
create policy "Users can upload listing photos into their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-photos' and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete listing photos in their own folder" on storage.objects;
create policy "Users can delete listing photos in their own folder"
  on storage.objects for delete
  using (
    bucket_id = 'listing-photos' and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );
