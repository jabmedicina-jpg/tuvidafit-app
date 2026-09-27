"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORY_ORDER, CATEGORY_LABEL, type Category } from "@/lib/shopping-list";
import { regenerateList } from "./actions";

type Item = {
  id: string;
  category: string;
  name: string;
  quantity: string | null;
  checked: boolean;
};

export default function ComprasView({
  weeklyMenuId,
  items,
}: {
  weeklyMenuId: string;
  items: Item[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [localItems, setLocalItems] = useState(items);
  const [pending, startTransition] = useTransition();

  const grouped = useMemo(() => {
    const map = new Map<Category, Item[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const it of localItems) {
      const cat = (CATEGORY_ORDER as readonly string[]).includes(it.category)
        ? (it.category as Category)
        : "almacen";
      map.get(cat)!.push(it);
    }
    return map;
  }, [localItems]);

  async function toggle(item: Item) {
    setLocalItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked: !i.checked } : i))
    );
    await supabase
      .from("shopping_list_items")
      .update({ checked: !item.checked })
      .eq("id", item.id);
  }

  function handleRegenerate() {
    startTransition(async () => {
      await regenerateList(weeklyMenuId);
      router.refresh();
    });
  }

  const totalChecked = localItems.filter((i) => i.checked).length;

  return (
    <main className="min-h-screen bg-white px-6 pt-7 pb-10">
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-display font-semibold text-2xl text-ink">
          Lista de compras
        </h1>
        <button
          type="button"
          disabled={pending}
          onClick={handleRegenerate}
          className="text-xs font-semibold text-blue disabled:opacity-50 shrink-0 mt-1.5"
        >
          {pending ? "Actualizando…" : "Actualizar desde el menú"}
        </button>
      </div>
      <p className="text-sm text-muted mb-6">
        {totalChecked}/{localItems.length} marcados · a partir de tu menú de
        esta semana
      </p>

      <div className="flex flex-col gap-6">
        {CATEGORY_ORDER.map((cat) => {
          const catItems = grouped.get(cat) ?? [];
          if (catItems.length === 0) return null;
          return (
            <div key={cat}>
              <h2 className="text-xs font-bold uppercase tracking-wide text-teal mb-2">
                {CATEGORY_LABEL[cat]}
              </h2>
              <div className="flex flex-col gap-1.5">
                {catItems.map((it) => (
                  <label
                    key={it.id}
                    className="flex items-start gap-3 border border-line rounded-xl px-3.5 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={it.checked}
                      onChange={() => toggle(it)}
                      className="mt-0.5 accent-blue"
                    />
                    <span
                      className={`text-sm flex-1 ${
                        it.checked ? "line-through text-muted" : "text-ink"
                      }`}
                    >
                      {it.name}
                      {it.quantity && (
                        <span className="text-muted"> — {it.quantity}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        {localItems.length === 0 && (
          <p className="text-sm text-muted">
            No pudimos armar la lista todavía.
          </p>
        )}
      </div>
    </main>
  );
}
