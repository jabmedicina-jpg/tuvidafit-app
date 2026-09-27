"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateShoppingList } from "@/lib/shopping-list";

export async function regenerateList(weeklyMenuId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  await generateShoppingList(supabase, user.id, weeklyMenuId);
  revalidatePath("/compras");
  return { ok: true };
}
