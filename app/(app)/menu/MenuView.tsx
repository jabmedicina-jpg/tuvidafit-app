"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DAY_LABEL, MEAL_LABEL, type MealType } from "@/lib/menu";
import { changeRecipe } from "./actions";

type Recipe = {
  id: string;
  name: string;
  origin: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  prep_minutes: number | null;
} | null;

type Meal = {
  menuItemId: string;
  mealType: MealType;
  recipe: Recipe;
};

type Day = {
  dayIndex: number;
  meals: Meal[];
};

const MEAL_ORDER: MealType[] = ["desayuno", "almuerzo", "merienda", "cena"];

function todayIndex() {
  const jsDay = new Date().getDay(); // 0 = domingo
  return jsDay === 0 ? 6 : jsDay - 1; // 0 = lunes ... 6 = domingo
}

export default function MenuView({
  days,
  dailyCalories,
  weekStart,
}: {
  days: Day[];
  dailyCalories: number;
  weekStart: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(todayIndex());
  const [pending, startTransition] = useTransition();
  const [errorId, setErrorId] = useState<string | null>(null);

  const day = days[selected];

  const mealsByType = useMemo(() => {
    const map = new Map<MealType, Meal>();
    for (const m of day?.meals ?? []) map.set(m.mealType, m);
    return map;
  }, [day]);

  function handleChange(meal: Meal) {
    if (!meal.recipe) return;
    setErrorId(null);
    startTransition(async () => {
      const target =
        meal.mealType === "desayuno"
          ? dailyCalories * 0.25
          : meal.mealType === "almuerzo"
          ? dailyCalories * 0.35
          : meal.mealType === "merienda"
          ? dailyCalories * 0.15
          : dailyCalories * 0.25;

      const res = await changeRecipe(
        meal.menuItemId,
        meal.mealType,
        meal.recipe!.id,
        target
      );

      if (res?.error) {
        setErrorId(meal.menuItemId);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <main className="bg-white px-6 pt-7 pb-10">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">
        Mi Menú
      </h1>
      <p className="text-sm text-muted mb-5">
        Semana del {new Date(weekStart + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })}
      </p>

      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {DAY_LABEL.map((label, i) => (
          <button
            key={label}
            onClick={() => setSelected(i)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold ${
              selected === i
                ? "bg-ink text-white"
                : "bg-[#F1F4F4] text-muted"
            }`}
          >
            {label.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {MEAL_ORDER.map((mealType) => {
          const meal = mealsByType.get(mealType);
          const recipe = meal?.recipe;

          return (
            <div
              key={mealType}
              className="border border-line rounded-2xl p-4 flex flex-col gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-teal">
                {MEAL_LABEL[mealType]}
              </span>

              {recipe ? (
                <>
                  <h2 className="font-semibold text-ink text-[15px]">
                    {recipe.name}
                  </h2>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                    <span>{recipe.calories} kcal</span>
                    <span>P {recipe.protein_g} g</span>
                    <span>C {recipe.carbs_g} g</span>
                    <span>G {recipe.fat_g} g</span>
                    {recipe.prep_minutes && <span>{recipe.prep_minutes} min</span>}
                  </div>

                  <a
                    href={`/recetas/${recipe.id}`}
                    className="text-xs font-semibold text-teal"
                  >
                    Ver preparación →
                  </a>

                  {meal && errorId === meal.menuItemId && (
                    <p className="text-xs text-red-600">
                      No encontramos otra receta compatible para esta comida.
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => meal && handleChange(meal)}
                    className="mt-1 self-start text-xs font-semibold text-blue disabled:opacity-50"
                  >
                    {pending ? "Cambiando…" : "Cambiar receta"}
                  </button>
                </>
              ) : (
                <p className="text-sm text-muted">
                  No encontramos una receta compatible para esta comida
                  todavía.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
