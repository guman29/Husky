-- PetPal: structured size/age fields on listings (Stage 1 -- "I want a pet"
-- matching questionnaire). Run this once in the Supabase SQL Editor if your
-- project already has the marketplace tables from 005_marketplace.sql.
--
-- The old free-text `age` column is kept for any existing rows written
-- before this migration -- the app now writes age_value/age_unit instead,
-- and only falls back to the text column when those are null.

alter table public.listings
  add column size text check (size in ('Small', 'Medium', 'Large', 'Extra Large')),
  add column age_value numeric,
  add column age_unit text check (age_unit in ('week', 'month', 'year'));
