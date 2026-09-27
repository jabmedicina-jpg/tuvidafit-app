-- Ejecutar en el SQL Editor de Supabase (proyecto nuevo, igual que con Hemogestor)

-- 1) Perfiles: extiende auth.users con los datos del formulario de perfil
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  age int,
  sex text check (sex in ('femenino', 'masculino', 'otro')),
  height_cm numeric,
  weight_kg numeric,
  activity_level text check (
    activity_level in ('sedentario', 'ligero', 'moderado', 'activo', 'muy_activo')
  ),
  goal text check (goal in ('bajar_grasa', 'mantener', 'ganar_masa')),
  diet_restrictions text[] default '{}', -- ej: {sin_gluten, vegano, sin_lactosa}
  allergies text, -- texto libre: "maní, mariscos"
  excluded_foods text, -- texto libre: alimentos que no consume por gusto
  cuisine_pref text check (cuisine_pref in ('argentina', 'brasil', 'ambas')) default 'ambas',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "ver_perfil_propio" on public.profiles for select using (auth.uid() = id);
create policy "crear_perfil_propio" on public.profiles for insert with check (auth.uid() = id);
create policy "editar_perfil_propio" on public.profiles for update using (auth.uid() = id);

-- 2) Recetas: biblioteca pública (argentina / brasil)
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  origin text check (origin in ('argentina', 'brasil')) not null,
  calories int not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  prep_minutes int,
  servings int default 1,
  tags text[] default '{}', -- ej: {bajo_en_calorias, alto_en_proteinas, rapida}
  gluten_free boolean default false,
  vegetarian boolean default false,
  vegan boolean default false,
  lactose_free boolean default false,
  ingredients jsonb not null default '[]', -- [{ "item": "pollo", "cantidad": "200 g" }]
  steps text[] default '{}',
  image_url text,
  created_at timestamptz default now()
);

alter table public.recipes enable row level security;
create policy "recetas_publicas" on public.recipes for select using (true);

-- 3) Menú semanal generado por usuario
create table public.weekly_menus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  week_start date not null,
  created_at timestamptz default now()
);

alter table public.weekly_menus enable row level security;
create policy "menus_del_usuario" on public.weekly_menus for all using (auth.uid() = user_id);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  weekly_menu_id uuid references public.weekly_menus on delete cascade not null,
  day_of_week int check (day_of_week between 0 and 6) not null, -- 0 = lunes
  meal_type text check (
    meal_type in ('desayuno', 'almuerzo', 'merienda', 'cena', 'snack')
  ) not null,
  recipe_id uuid references public.recipes not null
);

alter table public.menu_items enable row level security;
create policy "items_de_menus_propios" on public.menu_items for all using (
  exists (
    select 1 from public.weekly_menus wm
    where wm.id = weekly_menu_id and wm.user_id = auth.uid()
  )
);

-- 4) Progreso: peso, medidas y notas
create table public.progress_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  logged_at date not null default current_date,
  weight_kg numeric,
  waist_cm numeric,
  hip_cm numeric,
  body_fat_pct numeric,
  notes text
);

alter table public.progress_logs enable row level security;
create policy "progreso_del_usuario" on public.progress_logs for all using (auth.uid() = user_id);

-- 5) Fotos de progreso: metadata (los archivos van en Storage, bucket privado)
create table public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  taken_at date not null default current_date,
  angle text check (angle in ('frente', 'perfil', 'espalda')) not null,
  storage_path text not null, -- ej: {user_id}/2026-09-26-frente.jpg
  created_at timestamptz default now()
);

alter table public.progress_photos enable row level security;
create policy "fotos_del_usuario" on public.progress_photos for all using (auth.uid() = user_id);

-- 6) Lista de compras (generada a partir del menú semanal activo)
create table public.shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  weekly_menu_id uuid references public.weekly_menus on delete cascade,
  category text not null, -- ej: carnes_y_proteinas, verduras, frutas, lacteos, almacen, condimentos
  name text not null,
  quantity text,
  checked boolean default false
);

alter table public.shopping_list_items enable row level security;
create policy "lista_de_compras_del_usuario" on public.shopping_list_items for all using (auth.uid() = user_id);

-- Nota sobre Storage: crear un bucket privado "progress-photos" desde el
-- panel de Supabase, y agregar una política que permita a cada usuario
-- leer/escribir solo dentro de su propia carpeta ({user_id}/...).
