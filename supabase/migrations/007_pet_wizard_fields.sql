-- PetPal: structured age + location fields on pets (Stage 2 -- Add Pet
-- step-by-step wizard). Run this once in the Supabase SQL Editor if your
-- project already has the pets table from schema.sql.
--
-- birthday is kept for any existing rows written before this migration --
-- the wizard now collects age_value/age_unit instead of an exact birthday.

alter table public.pets
  add column age_value numeric,
  add column age_unit text check (age_unit in ('week', 'month', 'year')),
  add column location text,
  add column location_lat numeric,
  add column location_lon numeric;
