import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateNutrition, type NutritionInput } from "@/lib/nutrition";
import {
  generateWeeklyMenu,
  currentWeekStart,
  MEAL_TYPES,
  type RecipeForMenu,
} from "@/lib/menu";
import MenuView from "./MenuView";

export default async function MenuPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "age, sex, height_cm, weight_kg, activity_level, goal, diet_restrictions, cuisine_pref"
    )
    .eq("id", user.id)
    .single();

  const profileComplete = Boolean(
    profile?.age &&
      profile?.sex &&
      profile?.height_cm &&
      profile?.weight_kg &&
      profile?.activity_level &&
      profile?.goal
  );

  if (!profileComplete) {
    return (
      <main className="min-h-screen bg-white px-6 pt-8 pb-10">
        <h1 className="font-display font-semibold text-2xl text-ink mb-3">
          Mi Menú
        </h1>
        <a
          href="/perfil"
          className="block rounded-2xl border border-orange bg-orange/10 px-4 py-3 text-sm font-semibold text-ink"
        >
          Completá tu perfil para que podamos armar tu menú semanal →
        </a>
      </main>
    );
  }

  const nutrition = calculateNutrition(profile as unknown as NutritionInput);
  const weekStart = currentWeekStart();
  const restrictions = profile?.diet_restrictions ?? [];
  const cuisinePref = (profile?.cuisine_pref as any) ?? "ambas";

  let { data: weeklyMenu } = await supabase
    .from("weekly_menus")
    .select("id")
    .eq("user_id", user.id)
    .eq("week_start", weekStart)
    .maybeSingle();

  const { data: recipes } = await supabase
    .from("recipes")
    .select(
      "id, name, origin, calories, protein_g, carbs_g, fat_g, prep_minutes, gluten_free, vegetarian, vegan, lactose_free, meal_types"
    );

  const recipeList = (recipes ?? []) as RecipeForMenu[];

  if (!weeklyMenu) {
    const { data: created, error: createError } = await supabase
      .from("weekly_menus")
      .insert({ user_id: user.id, week_start: weekStart })
      .select("id")
      .single();

    if (createError || !created) {
      return (
        <main className="min-h-screen bg-white px-6 pt-8 pb-10">
          <h1 className="font-display font-semibold text-2xl text-ink mb-3">
            Mi Menú
          </h1>
          <p className="text-sm text-red-600">
            No pudimos generar tu menú. Probá de nuevo en unos minutos.
          </p>
        </main>
      );
    }

    weeklyMenu = created;

    const plan = generateWeeklyMenu(
      recipeList,
      nutrition.calories,
      restrictions,
      cuisinePref
    );

    const rows = plan.flatMap((day, dayIndex) =>
      MEAL_TYPES.filter((mt) => day[mt]).map((mealType) => ({
        weekly_menu_id: weeklyMenu!.id,
        day_of_week: dayIndex,
        meal_type: mealType,
        recipe_id: day[mealType]!,
      }))
    );

    if (rows.length > 0) {
      await supabase.from("menu_items").insert(rows);
    }
  }

  const { data: items } = await supabase
    .from("menu_items")
    .select("id, day_of_week, meal_type, recipe_id")
    .eq("weekly_menu_id", weeklyMenu.id);

  const recipesById = new Map(recipeList.map((r) => [r.id, r]));

  const days = Array.from({ length: 7 }, (_, dayIndex) => ({
    dayIndex,
    meals: (items ?? [])
      .filter((it) => it.day_of_week === dayIndex)
      .map((it) => ({
        menuItemId: it.id as string,
        mealType: it.meal_type as (typeof MEAL_TYPES)[number],
        recipe: recipesById.get(it.recipe_id) ?? null,
      })),
  }));

  return (
    <MenuView
      days={days}
      dailyCalories={nutrition.calories}
      weekStart={weekStart}
    />
  );
}
