// Etapa 5 — generador de menú semanal.

export type MealType = "desayuno" | "almuerzo" | "merienda" | "cena";

export const MEAL_TYPES: MealType[] = [
  "desayuno",
  "almuerzo",
  "merienda",
  "cena",
];

export const MEAL_LABEL: Record<MealType, string> = {
  desayuno: "Desayuno",
  almuerzo: "Almuerzo",
  merienda: "Merienda",
  cena: "Cena",
};

// Qué porción del objetivo calórico diario le asignamos a cada comida.
const MEAL_CALORIE_SHARE: Record<MealType, number> = {
  desayuno: 0.25,
  almuerzo: 0.35,
  merienda: 0.15,
  cena: 0.25,
};

export const DAY_LABEL = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export type RecipeForMenu = {
  id: string;
  name: string;
  origin: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  prep_minutes: number | null;
  gluten_free: boolean;
  vegetarian: boolean;
  vegan: boolean;
  lactose_free: boolean;
  meal_types: string[] | null;
};

export type CuisinePref = "argentina" | "brasil" | "ambas" | "todas" | null;

function matchesCuisine(recipe: RecipeForMenu, cuisinePref: CuisinePref) {
  if (!cuisinePref || cuisinePref === "todas") return true;
  if (cuisinePref === "ambas")
    return recipe.origin === "argentina" || recipe.origin === "brasil";
  return recipe.origin === cuisinePref;
}

function matchesRestrictions(recipe: RecipeForMenu, restrictions: string[]) {
  if (restrictions.includes("sin_gluten") && !recipe.gluten_free) return false;
  if (restrictions.includes("vegano") && !recipe.vegan) return false;
  if (restrictions.includes("vegetariano") && !recipe.vegetarian) return false;
  if (restrictions.includes("sin_lactosa") && !recipe.lactose_free) return false;
  return true;
}

export function candidatesFor(
  recipes: RecipeForMenu[],
  mealType: MealType,
  restrictions: string[],
  cuisinePref: CuisinePref
): RecipeForMenu[] {
  return recipes.filter(
    (r) =>
      (r.meal_types ?? []).includes(mealType) &&
      matchesRestrictions(r, restrictions) &&
      matchesCuisine(r, cuisinePref)
  );
}

// Entre los candidatos, prioriza los más cercanos a la porción calórica
// de esa comida, evitando repetir lo ya usado esa semana cuando hay
// alternativas.
function pickOne(
  candidates: RecipeForMenu[],
  targetCalories: number,
  usedIds: Set<string>
): RecipeForMenu | null {
  if (candidates.length === 0) return null;

  const unused = candidates.filter((c) => !usedIds.has(c.id));
  const pool = unused.length > 0 ? unused : candidates;

  const sorted = [...pool].sort(
    (a, b) =>
      Math.abs(a.calories - targetCalories) -
      Math.abs(b.calories - targetCalories)
  );

  const top = sorted.slice(0, Math.min(3, sorted.length));
  return top[Math.floor(Math.random() * top.length)];
}

export type DayPlan = Partial<Record<MealType, string>>; // meal_type -> recipe_id

export function generateWeeklyMenu(
  recipes: RecipeForMenu[],
  dailyCalories: number,
  restrictions: string[],
  cuisinePref: CuisinePref
): DayPlan[] {
  const usedByMeal: Record<MealType, Set<string>> = {
    desayuno: new Set(),
    almuerzo: new Set(),
    merienda: new Set(),
    cena: new Set(),
  };

  const days: DayPlan[] = [];

  for (let day = 0; day < 7; day++) {
    const plan: DayPlan = {};
    const usedToday = new Set<string>();

    for (const mealType of MEAL_TYPES) {
      const target = dailyCalories * MEAL_CALORIE_SHARE[mealType];
      const candidates = candidatesFor(
        recipes,
        mealType,
        restrictions,
        cuisinePref
      ).filter((r) => !usedToday.has(r.id));
      const chosen = pickOne(candidates, target, usedByMeal[mealType]);

      if (chosen) {
        plan[mealType] = chosen.id;
        usedByMeal[mealType].add(chosen.id);
        usedToday.add(chosen.id);
      }
    }

    days.push(plan);
  }

  return days;
}

// Para "Cambiar receta": misma lógica de filtro, excluyendo la actual
// y cualquier otra receta ya usada ese mismo día.
export function pickAlternative(
  recipes: RecipeForMenu[],
  mealType: MealType,
  restrictions: string[],
  cuisinePref: CuisinePref,
  currentRecipeId: string,
  targetCalories: number,
  excludeIds: string[] = []
): RecipeForMenu | null {
  const excluded = new Set([currentRecipeId, ...excludeIds]);
  const candidates = candidatesFor(
    recipes,
    mealType,
    restrictions,
    cuisinePref
  ).filter((r) => !excluded.has(r.id));

  return pickOne(candidates, targetCalories, new Set());
}

function mondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = domingo
  const diff = (day === 0 ? -6 : 1) - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function currentWeekStart(): string {
  return mondayOf(new Date()).toISOString().slice(0, 10);
}
