import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateNutrition, type NutritionInput } from "@/lib/nutrition";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, age, sex, height_cm, weight_kg, activity_level, goal")
    .eq("id", user.id)
    .single();

  const firstName = profile?.full_name?.split(" ")[0];
  const profileComplete = Boolean(
    profile?.age &&
      profile?.sex &&
      profile?.height_cm &&
      profile?.weight_kg &&
      profile?.activity_level &&
      profile?.goal
  );

  const nutrition = profileComplete
    ? calculateNutrition(profile as unknown as NutritionInput)
    : null;

  return (
    <main className="bg-white px-6 pt-7 pb-6 flex flex-col gap-5">
      <div>
        <h1 className="font-display font-semibold text-2xl text-ink">
          Hola{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-muted mt-1">¡Qué bueno verte de nuevo!</p>
      </div>

      {!profileComplete && (
        <a
          href="/perfil"
          className="rounded-2xl border border-orange bg-orange/10 px-4 py-3 text-sm font-semibold text-ink"
        >
          Completá tu perfil para calcular tu objetivo calórico y armar tu menú →
        </a>
      )}

      <div className="bg-green rounded-2xl p-5 text-white flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-wide">
          Tu objetivo calórico diario
        </span>
        <span className="font-display text-4xl font-semibold">
          {nutrition ? nutrition.calories.toLocaleString("es-AR") : "—"} kcal
        </span>
        <span className="text-xs opacity-90">
          {nutrition ? "Estimación" : "Completá tu perfil para calcularlo"}
        </span>

        {nutrition && (
          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="bg-white/15 rounded-xl px-2 py-2 text-center">
              <div className="text-sm font-bold">{nutrition.protein_g} g</div>
              <div className="text-[11px] opacity-90">Proteínas</div>
            </div>
            <div className="bg-white/15 rounded-xl px-2 py-2 text-center">
              <div className="text-sm font-bold">{nutrition.carbs_g} g</div>
              <div className="text-[11px] opacity-90">Carbohidratos</div>
            </div>
            <div className="bg-white/15 rounded-xl px-2 py-2 text-center">
              <div className="text-sm font-bold">{nutrition.fat_g} g</div>
              <div className="text-[11px] opacity-90">Grasas</div>
            </div>
          </div>
        )}
      </div>

      {nutrition && (
        <p className="text-xs text-muted -mt-2">
          Estimación orientativa, no reemplaza una consulta médica o nutricional.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <a href="/menu" className="rounded-2xl bg-teal text-white p-4 flex flex-col gap-2">
          <span className="font-bold text-sm">Mi Menú</span>
          <span className="text-xs opacity-90">Tu plan semanal</span>
        </a>
        <a href="/progreso" className="rounded-2xl bg-blue text-white p-4 flex flex-col gap-2">
          <span className="font-bold text-sm">Mi Progreso</span>
          <span className="text-xs opacity-90">Ver tu evolución</span>
        </a>
        <a href="/recetas" className="rounded-2xl bg-orange text-white p-4 flex flex-col gap-2">
          <span className="font-bold text-sm">Recetas</span>
          <span className="text-xs opacity-90">Explorá y disfrutá</span>
        </a>
        <a href="/compras" className="rounded-2xl bg-purple text-white p-4 flex flex-col gap-2">
          <span className="font-bold text-sm">Lista de compras</span>
          <span className="text-xs opacity-90">Todo en un solo lugar</span>
        </a>
      </div>

      <form action="/auth/signout" method="post" className="mt-2 pt-4">
        <button type="submit" className="text-sm text-muted underline">
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
