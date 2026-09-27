import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const ORIGIN_LABEL: Record<string, string> = {
  argentina: "Argentina",
  brasil: "Brasil",
  mexico: "México",
  mediterranea: "Mediterránea",
  italia: "Italia",
};

type Ingredient = { item: string; cantidad?: string };

export default async function RecetaDetallePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: recipe } = await supabase
    .from("recipes")
    .select(
      "id, name, origin, calories, protein_g, carbs_g, fat_g, prep_minutes, servings, tags, gluten_free, vegetarian, vegan, lactose_free, ingredients, steps"
    )
    .eq("id", params.id)
    .single();

  if (!recipe) notFound();

  const ingredients = (recipe.ingredients ?? []) as Ingredient[];
  const steps = (recipe.steps ?? []) as string[];

  return (
    <main className="bg-white px-6 pt-6 pb-10">
      <a
        href="/recetas"
        className="inline-flex items-center gap-1 text-sm text-muted mb-4"
      >
        ← Recetas
      </a>

      <div className="flex items-start justify-between gap-3 mb-1">
        <h1 className="font-display font-semibold text-2xl text-ink leading-snug">
          {recipe.name}
        </h1>
        <span className="text-xs text-muted whitespace-nowrap shrink-0 mt-1.5">
          {ORIGIN_LABEL[recipe.origin] ?? recipe.origin}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted mb-3">
        <span>{recipe.calories} kcal</span>
        {recipe.prep_minutes && <span>{recipe.prep_minutes} min</span>}
        {recipe.servings && (
          <span>
            {recipe.servings} {recipe.servings === 1 ? "porción" : "porciones"}
          </span>
        )}
      </div>

      {(recipe.gluten_free || recipe.vegetarian || recipe.vegan || recipe.lactose_free) && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {recipe.gluten_free && (
            <span className="text-[11px] bg-teal/10 text-teal font-semibold px-2 py-0.5 rounded-full">
              Sin gluten
            </span>
          )}
          {recipe.vegan && (
            <span className="text-[11px] bg-green/10 text-green font-semibold px-2 py-0.5 rounded-full">
              Vegana
            </span>
          )}
          {!recipe.vegan && recipe.vegetarian && (
            <span className="text-[11px] bg-green/10 text-green font-semibold px-2 py-0.5 rounded-full">
              Vegetariana
            </span>
          )}
          {recipe.lactose_free && (
            <span className="text-[11px] bg-blue/10 text-blue font-semibold px-2 py-0.5 rounded-full">
              Sin lactosa
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-7">
        <div className="border border-line rounded-xl px-2 py-2.5 text-center">
          <div className="text-sm font-bold text-ink">{recipe.protein_g} g</div>
          <div className="text-[11px] text-muted">Proteínas</div>
        </div>
        <div className="border border-line rounded-xl px-2 py-2.5 text-center">
          <div className="text-sm font-bold text-ink">{recipe.carbs_g} g</div>
          <div className="text-[11px] text-muted">Carbohidratos</div>
        </div>
        <div className="border border-line rounded-xl px-2 py-2.5 text-center">
          <div className="text-sm font-bold text-ink">{recipe.fat_g} g</div>
          <div className="text-[11px] text-muted">Grasas</div>
        </div>
      </div>

      <section className="mb-7">
        <h2 className="font-display font-semibold text-lg text-ink mb-3">
          Ingredientes
        </h2>
        <ul className="flex flex-col gap-1.5">
          {ingredients.map((ing, i) => (
            <li
              key={i}
              className="flex items-baseline justify-between text-sm border-b border-line pb-1.5"
            >
              <span className="text-ink">{ing.item}</span>
              {ing.cantidad && (
                <span className="text-muted shrink-0 ml-3">
                  {ing.cantidad}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display font-semibold text-lg text-ink mb-3">
          Preparación
        </h2>
        <ol className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink">
              <span className="shrink-0 w-6 h-6 rounded-full bg-teal/10 text-teal font-bold text-xs flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
