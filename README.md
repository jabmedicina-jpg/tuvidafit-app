# TuVidaFit

App de nutrición y fitness (recetas argentinas y brasileñas, menús
personalizados, cálculo de calorías, seguimiento de progreso).

Stack: Next.js (App Router) + TypeScript + Tailwind + Supabase, desplegada
en Vercel como PWA — mismo enfoque que Hemogestor.

## Etapa actual: Etapa 6 (Mi Progreso)

Lo que ya funciona:
- Bienvenida (`/`)
- Registro / inicio de sesión con Supabase Auth (`/login`)
- Dashboard protegido (`/dashboard`) con kcal y macros calculados
- Perfil completo (`/perfil`)
- Biblioteca de recetas (`/recetas`) — 28 recetas en 5 cocinas
- Generador de menú semanal (`/menu`), con "Cambiar receta"
- Mi Progreso (`/progreso`): Datos (peso/medidas + gráfico de evolución),
  Fotos (privadas, por ángulo, en un bucket de Storage separado) y Logros

Lo que falta:
- Lista de compras automática a partir del menú → Etapa 7

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
