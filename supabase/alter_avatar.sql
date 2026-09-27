-- Correr en el SQL Editor de Supabase.
-- Agrega la foto de perfil: columna en profiles + bucket público de Storage.
--
-- El bucket es público (a diferencia de progress-photos) porque la foto de
-- perfil no es información sensible y así se puede mostrar directo con
-- getPublicUrl(), sin generar URLs firmadas.

alter table public.profiles
  add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Cualquiera puede ver las fotos (bucket público), pero cada usuario solo
-- puede subir/reemplazar/borrar dentro de su propia carpeta ({user_id}/...).
create policy "avatars_select_publica"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_propia"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_update_propia"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars_delete_propia"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
