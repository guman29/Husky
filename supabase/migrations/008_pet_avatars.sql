-- Husky: pet avatar photos (Stage 5 -- pet main view changes). Run this
-- once in the Supabase SQL Editor if your project already has the pets
-- table. Creates a public storage bucket for avatar images and a column to
-- point at them.
--
-- Avatar files are stored at <owner_id>/<pet_id>.<ext> so the storage
-- policies below can check the folder name against auth.uid() without
-- needing to join back to the pets table.

insert into storage.buckets (id, name, public)
values ('pet-avatars', 'pet-avatars', true)
on conflict (id) do nothing;

alter table public.pets
  add column avatar_url text;

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
