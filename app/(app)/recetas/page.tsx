import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ACCENT, type AccentColor } from "../colorClasses";

const ORIGIN_LABEL: Record<string, string> = {
  argentina: "Argentina",
  brasil: "Brasil",
  mexico: "México",
  mediterranea: "Mediterránea",
  italia: "Italia",
};

const ORIGIN_COLOR: Record<string, AccentColor> = {
  argentina: "blue",
  brasil: "green",
  mexico: "orange",
  mediterranea: "teal",
  italia: "purple",
};

const ORIGIN_VALUES = Object.keys(ORIGIN_LABEL);

export default async function RecetasPage({
  searchParams,
}: {
  searchParams: { origen?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const origen = searchParams.origen;

  let query = supabase
    .from("recipes")
    .select(
      "id, name, origin, calories, protein_g, carbs_g, fat_g, prep_minutes, tags, gluten_free, vegetarian, vegan, lactose_free"
    )
    .order("name");

  if (origen && ORIGIN_VALUES.includes(origen)) {
    query = query.eq("origin", origen);
  }

  const { data: recipes } = await query;

  return (
    <main className="bg-white px-6 pt-7 pb-10">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">
        Recetas
      </h1>
      <p className="text-sm text-muted mb-5">
        Recetas fit de distintas cocinas.
      </p>

      <div className="flex gap-2 mb-7 flex-wrap">
        <a
          href="/recetas"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            !origen ? "bg-ink text-white" : "bg-ink/5 text-ink"
          }`}
        >
          Todas
        </a>
        {ORIGIN_VALUES.map((v) => {
          const color = ACCENT[ORIGIN_COLOR[v]];
          const active = origen === v;
          return (
            <a
              key={v}
              href={`/recetas?origen=${v}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                active ? `${color.bg} text-white` : `${color.bgSoft} ${color.text}`
              }`}
            >
              {ORIGIN_LABEL[v]}
            </a>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {(recipes ?? []).map((r) => {
          const color = ACCENT[ORIGIN_COLOR[r.origin] ?? "teal"];
          return (
            <a
              key={r.id}
              href={`/recetas/${r.id}`}
              className={`rounded-2xl p-4 flex flex-col gap-2 shadow-sm ${color.bgSofter}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-ink text-[15px] leading-snug">
                  {r.name}
                </h2>
                <span
                  className={`text-[11px] font-semibold whitespace-nowrap shrink-0 px-2 py-0.5 rounded-full ${color.bgBadge} ${color.text}`}
                >
                  {ORIGIN_LABEL[r.origin] ?? r.origin}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                <span>{r.calories} kcal</span>
                <span>P {r.protein_g} g</span>
                <span>C {r.carbs_g} g</span>
                <span>G {r.fat_g} g</span>
                {r.prep_minutes && <span>{r.prep_minutes} min</span>}
              </div>

              {(r.gluten_free || r.vegetarian || r.vegan || r.lactose_free) && (
                <div className="flex flex-wrap gap-1.5">
                  {r.gluten_free && (
                    <span className="text-[11px] bg-white text-teal font-semibold px-2 py-0.5 rounded-full">
                      Sin gluten
                    </span>
                  )}
                  {r.vegan && (
                    <span className="text-[11px] bg-white text-green font-semibold px-2 py-0.5 rounded-full">
                      Vegana
                    </span>
                  )}
                  {!r.vegan && r.vegetarian && (
                    <span className="text-[11px] bg-white text-green font-semibold px-2 py-0.5 rounded-full">
                      Vegetariana
                    </span>
                  )}
                  {r.lactose_free && (
                    <span className="text-[11px] bg-white text-blue font-semibold px-2 py-0.5 rounded-full">
                      Sin lactosa
                    </span>
                  )}
                </div>
              )}
            </a>
          );
        })}

        {recipes && recipes.length === 0 && (
          <p className="text-sm text-muted">
            Todavía no hay recetas cargadas para este filtro.
          </p>
        )}
      </div>
    </main>
  );
}
