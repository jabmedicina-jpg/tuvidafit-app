import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ORIGIN_LABEL: Record<string, string> = {
  argentina: "Argentina",
  brasil: "Brasil",
  mexico: "México",
  mediterranea: "Mediterránea",
  italia: "Italia",
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
    <main className="min-h-screen bg-white px-6 pt-7 pb-10">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">
        Recetas
      </h1>
      <p className="text-sm text-muted mb-5">
        Recetas fit de distintas cocinas.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: undefined, label: "Todas" },
          ...ORIGIN_VALUES.map((v) => ({ value: v, label: ORIGIN_LABEL[v] })),
        ].map((opt) => {
          const active = origen === opt.value || (!origen && !opt.value);
          const href = opt.value ? `/recetas?origen=${opt.value}` : "/recetas";
          return (
            <a
              key={opt.label}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                active
                  ? "bg-ink text-white border-ink"
                  : "border-line text-ink"
              }`}
            >
              {opt.label}
            </a>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {(recipes ?? []).map((r) => (
          <div
            key={r.id}
            className="border border-line rounded-2xl p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-ink text-[15px] leading-snug">
                {r.name}
              </h2>
              <span className="text-xs text-muted whitespace-nowrap shrink-0">
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
                  <span className="text-[11px] bg-teal/10 text-teal font-semibold px-2 py-0.5 rounded-full">
                    Sin gluten
                  </span>
                )}
                {r.vegan && (
                  <span className="text-[11px] bg-green/10 text-green font-semibold px-2 py-0.5 rounded-full">
                    Vegana
                  </span>
                )}
                {!r.vegan && r.vegetarian && (
                  <span className="text-[11px] bg-green/10 text-green font-semibold px-2 py-0.5 rounded-full">
                    Vegetariana
                  </span>
                )}
                {r.lactose_free && (
                  <span className="text-[11px] bg-blue/10 text-blue font-semibold px-2 py-0.5 rounded-full">
                    Sin lactosa
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {recipes && recipes.length === 0 && (
          <p className="text-sm text-muted">
            Todavía no hay recetas cargadas para este filtro.
          </p>
        )}
      </div>
    </main>
  );
}
