-- Correr después de seed_recipes_2.sql. Permite elegir "todas las
-- cocinas" como preferencia de perfil, ahora que la biblioteca tiene
-- más orígenes que argentina/brasil.

alter table public.profiles drop constraint if exists profiles_cuisine_pref_check;
alter table public.profiles
  add constraint profiles_cuisine_pref_check
  check (cuisine_pref in ('argentina', 'brasil', 'ambas', 'todas'));
