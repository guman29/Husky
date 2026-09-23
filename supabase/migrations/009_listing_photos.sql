-- PetPal: real photo uploads for marketplace listings (Stage 10). Run this
-- once in the Supabase SQL Editor if your project already has the listings
-- table. Creates a public storage bucket for listing photos and a column
-- to hold their URLs.
--
-- Photo files are stored at <seller_id>/<listing_id>/<filename> so the
-- storage policies below can check the folder name against auth.uid()
-- without needing to join back to the listings table.

insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

alter table public.listings
  add column photo_urls text[] not null default '{}';

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
