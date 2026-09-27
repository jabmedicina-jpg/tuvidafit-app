"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { pickAlternative, type MealType } from "@/lib/menu";

export async function changeRecipe(
  menuItemId: string,
  mealType: MealType,
  currentRecipeId: string,
  targetCalories: number
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("diet_restrictions, cuisine_pref")
    .eq("id", user.id)
    .single();

  const { data: menuItem } = await supabase
    .from("menu_items")
    .select("weekly_menu_id, day_of_week")
    .eq("id", menuItemId)
    .single();

  let excludeIds: string[] = [];
  if (menuItem) {
    const { data: siblings } = await supabase
      .from("menu_items")
      .select("recipe_id")
      .eq("weekly_menu_id", menuItem.weekly_menu_id)
      .eq("day_of_week", menuItem.day_of_week)
      .neq("id", menuItemId);

    excludeIds = (siblings ?? []).map((s) => s.recipe_id);
  }

  const { data: recipes } = await supabase
    .from("recipes")
    .select(
      "id, name, origin, calories, protein_g, carbs_g, fat_g, prep_minutes, gluten_free, vegetarian, vegan, lactose_free, meal_types"
    );

  if (!recipes) return { error: "No se pudieron cargar las recetas" };

  const alternative = pickAlternative(
    recipes,
    mealType,
    profile?.diet_restrictions ?? [],
    (profile?.cuisine_pref as any) ?? "ambas",
    currentRecipeId,
    targetCalories,
    excludeIds
  );

  if (!alternative) {
    return { error: "No hay otra receta compatible para esta comida" };
  }

  const { error } = await supabase
    .from("menu_items")
    .update({ recipe_id: alternative.id })
    .eq("id", menuItemId);

  if (error) return { error: error.message };

  revalidatePath("/menu");
  return { ok: true };
}
