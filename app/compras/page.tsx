import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { currentWeekStart } from "@/lib/menu";
import { generateShoppingList } from "@/lib/shopping-list";
import ComprasView from "./ComprasView";

export default async function ComprasPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weekStart = currentWeekStart();

  const { data: weeklyMenu } = await supabase
    .from("weekly_menus")
    .select("id")
    .eq("user_id", user.id)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (!weeklyMenu) {
    return (
      <main className="min-h-screen bg-white px-6 pt-8 pb-10">
        <h1 className="font-display font-semibold text-2xl text-ink mb-3">
          Lista de compras
        </h1>
        <a
          href="/menu"
          className="block rounded-2xl border border-orange bg-orange/10 px-4 py-3 text-sm font-semibold text-ink"
        >
          Primero generá tu menú semanal para poder armar la lista →
        </a>
      </main>
    );
  }

  let { data: items } = await supabase
    .from("shopping_list_items")
    .select("id, category, name, quantity, checked")
    .eq("weekly_menu_id", weeklyMenu.id)
    .order("category")
    .order("name");

  if (!items || items.length === 0) {
    await generateShoppingList(supabase, user.id, weeklyMenu.id);
    const refetched = await supabase
      .from("shopping_list_items")
      .select("id, category, name, quantity, checked")
      .eq("weekly_menu_id", weeklyMenu.id)
      .order("category")
      .order("name");
    items = refetched.data;
  }

  return (
    <ComprasView
      weeklyMenuId={weeklyMenu.id}
      items={items ?? []}
    />
  );
}
