"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CATEGORY_ORDER,
  CATEGORY_LABEL,
  CATEGORY_COLOR,
  CATEGORY_ICON,
  type Category,
} from "@/lib/shopping-list";
import { regenerateList } from "./actions";
import { ACCENT } from "../colorClasses";

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
  const pct = localItems.length
    ? Math.round((totalChecked / localItems.length) * 100)
    : 0;

  return (
    <main className="bg-white px-6 pt-7 pb-10">
      <div className="flex items-start justify-between mb-1">
        <h1 className="font-display font-semibold text-2xl text-ink">
          Lista de compras
        </h1>
        <button
          type="button"
          disabled={pending}
          onClick={handleRegenerate}
          className="text-xs font-semibold text-purple disabled:opacity-50 shrink-0 mt-1.5"
        >
          {pending ? "Actualizando…" : "Actualizar desde el menú"}
        </button>
      </div>
      <p className="text-sm text-muted mb-3">
        a partir de tu menú de esta semana
      </p>

      <div className="rounded-2xl p-4 bg-purple/5 mb-6 flex items-center gap-3 shadow-sm">
        <div className="flex-1">
          <div className="h-2 rounded-full bg-purple/15 overflow-hidden">
            <div
              className="h-full bg-purple rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-semibold text-purple shrink-0">
          {totalChecked}/{localItems.length}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {CATEGORY_ORDER.map((cat) => {
          const catItems = grouped.get(cat) ?? [];
          if (catItems.length === 0) return null;
          const color = ACCENT[CATEGORY_COLOR[cat]];
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-7 h-7 rounded-full ${color.bgBadge} flex items-center justify-center text-sm shrink-0`}
                >
                  {CATEGORY_ICON[cat]}
                </span>
                <h2
                  className={`text-xs font-bold uppercase tracking-wide ${color.text}`}
                >
                  {CATEGORY_LABEL[cat]}
                </h2>
              </div>
              <div className="flex flex-col gap-1.5">
                {catItems.map((it) => (
                  <label
                    key={it.id}
                    className={`flex items-start gap-3 rounded-xl px-3.5 py-2.5 ${
                      it.checked ? "bg-[#F5F5F5]" : color.bgSofter
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={it.checked}
                      onChange={() => toggle(it)}
                      className={`mt-0.5 ${color.accent}`}
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
