# TuVidaFit

App de nutrición y fitness (recetas argentinas y brasileñas, menús
personalizados, cálculo de calorías, seguimiento de progreso).

Stack: Next.js (App Router) + TypeScript + Tailwind + Supabase, desplegada
en Vercel como PWA — mismo enfoque que Hemogestor.

## Etapa actual: Etapa 2 (registro, login y perfil)

Lo que ya funciona:
- Bienvenida (`/`)
- Registro / inicio de sesión con Supabase Auth (`/login`)
- Dashboard protegido (`/dashboard`) — redirige a `/login` si no hay sesión

Lo que falta (próximas etapas, según el plan original):
- Formulario de perfil (edad, altura, peso, objetivo, restricciones) → Etapa 2
- Motor de cálculo nutricional (kcal y macros estimados) → Etapa 3
- Carga de recetas reales en `recipes` → Etapa 4
- Generador de menú semanal → Etapa 5
- Mi Progreso (gráficos + fotos) → Etapa 6
- Lista de compras automática → Etapa 7

## Setup

1. Creá un proyecto nuevo en Supabase (como hiciste con Hemogestor).
2. Andá a SQL Editor y corré `supabase/schema.sql` completo.
3. En Storage, creá un bucket privado `progress-photos`.
4. Copiá `.env.local.example` a `.env.local` y completá con la URL y la
   anon key de tu proyecto Supabase (Project Settings → API).
5. Instalá dependencias y corré en local:

```bash
npm install
npm run dev
```

6. Deploy: importá el repo en Vercel (mismo team que usás) y cargá las
   mismas dos variables de entorno ahí.

## Estructura

```
app/
  page.tsx            → Bienvenida
  login/page.tsx       → Iniciar sesión / crear cuenta
  dashboard/page.tsx   → Home (protegido)
  auth/signout/route.ts
lib/supabase/
  client.ts            → cliente de Supabase para el browser
  server.ts            → cliente de Supabase para Server Components
middleware.ts           → protege /dashboard
supabase/schema.sql      → esquema completo de la base de datos
```
