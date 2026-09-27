// Etapa 7 — lista de compras automática a partir del menú semanal.
//
// Simplificación importante: si una receta se repite varias veces en la
// semana, sus ingredientes se listan una sola vez (no se multiplican),
// porque las cantidades están en texto libre ("300 g", "a gusto") y no
// se pueden sumar de forma confiable. La lista te dice QUÉ comprar; las
// cantidades exactas conviene ajustarlas vos según cuántas veces repite
// cada receta.

export const CATEGORY_ORDER = [
  "carnes_y_proteinas",
  "verduras",
  "frutas",
  "lacteos",
  "almacen",
  "condimentos",
] as const;

export type Category = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  carnes_y_proteinas: "Carnes y proteínas",
  verduras: "Verduras",
  frutas: "Frutas",
  lacteos: "Lácteos",
  almacen: "Almacén",
  condimentos: "Condimentos",
};

// Nombre de color (matchea con el mapa ACCENT de app/(app)/colorClasses.ts)
// e ícono para cada categoría, usados solo en la UI.
export const CATEGORY_COLOR: Record<Category, "coral" | "green" | "orange" | "blue" | "teal" | "purple"> = {
  carnes_y_proteinas: "coral",
  verduras: "green",
  frutas: "orange",
  lacteos: "blue",
  almacen: "teal",
  condimentos: "purple",
};

export const CATEGORY_ICON: Record<Category, string> = {
  carnes_y_proteinas: "🥩",
  verduras: "🥦",
  frutas: "🍎",
  lacteos: "🥛",
  almacen: "🛒",
  condimentos: "🧂",
};

// Unifica variantes de un mismo ingrediente bajo un solo nombre de compra.
const ALIAS: Record<string, string> = {
  "pechuga de pollo grillada": "pechuga de pollo",
  "pollo desmenuzado": "pechuga de pollo",
  "queso rallado": "queso",
  "queso parmesano": "parmesano",
};

const CATEGORY_MAP: Record<string, Category> = {
  "claras de huevo": "carnes_y_proteinas",
  "pechuga de pollo": "carnes_y_proteinas",
  "carne picada magra": "carnes_y_proteinas",
  "carne magra": "carnes_y_proteinas",
  "huevo duro": "carnes_y_proteinas",
  huevos: "carnes_y_proteinas",
  huevo: "carnes_y_proteinas",
  "filet de pescado blanco": "carnes_y_proteinas",
  camarones: "carnes_y_proteinas",
  "filet de salmón": "carnes_y_proteinas",

  espinaca: "verduras",
  calabaza: "verduras",
  ajo: "verduras",
  cebolla: "verduras",
  "cebolla morada": "verduras",
  zanahoria: "verduras",
  morrón: "verduras",
  acelga: "verduras",
  tomate: "verduras",
  "tomates cherry": "verduras",
  brócoli: "verduras",
  rúcula: "verduras",
  nopales: "verduras",
  "zanahoria y apio": "verduras",
  "cebolla y cilantro": "verduras",
  pepino: "verduras",
  zucchini: "verduras",
  berenjena: "verduras",
  "zanahoria, apio y papa": "verduras",
  "espinaca y zucchini": "verduras",
  palmitos: "verduras",
  tomatillos: "verduras",
  "chile verde y orégano": "verduras",
  perejil: "verduras",
  "romero y ajo": "verduras",
  "ajo y aceite de oliva": "verduras",
  "cilantro y jugo de lima": "verduras",
  "menta y jugo de limón": "verduras",
  albahaca: "verduras",

  banana: "frutas",
  palta: "frutas",
  "frutos rojos": "frutas",
  "pulpa de açaí congelada": "frutas",
  limón: "frutas",
  "jugo de limón": "frutas",
  "jugo de lima": "frutas",

  "leche vegetal": "lacteos",
  queso: "lacteos",
  "yogur natural descremado": "lacteos",
  "leche de coco": "lacteos",
  "queso fresco": "lacteos",
  "queso feta": "lacteos",
  "mozzarella fresca": "lacteos",
  parmesano: "lacteos",
  manteca: "lacteos",

  "avena arrollada": "almacen",
  "semillas de chía": "almacen",
  "quinoa cocida": "almacen",
  lentejas: "almacen",
  "caldo de verduras": "almacen",
  "tapas de empanada integrales": "almacen",
  "granola casera": "almacen",
  granola: "almacen",
  miel: "almacen",
  "porotos negros": "almacen",
  "arroz integral cocido": "almacen",
  "harina de almendras": "almacen",
  "goma de tapioca hidratada": "almacen",
  "harina de mandioca": "almacen",
  "tortillas de maíz": "almacen",
  "maíz pozolero": "almacen",
  "garbanzos cocidos": "almacen",
  "aceitunas negras": "almacen",
  tahini: "almacen",
  "pasta integral": "almacen",
  "pasta chica integral": "almacen",
  "porotos blancos cocidos": "almacen",

  "aceite de oliva": "condimentos",
  "sal y pimienta": "condimentos",
  canela: "condimentos",
  orégano: "condimentos",
  "pimentón dulce": "condimentos",
  "nuez moscada": "condimentos",
  "pimentón y comino": "condimentos",
  laurel: "condimentos",
};

// Para ingredientes que no estén en el mapa (recetas nuevas a futuro).
function guessCategory(name: string): Category {
  const n = name.toLowerCase();
  if (/(pollo|carne|pescado|salm[oó]n|camar|huevo|res|cerdo)/.test(n))
    return "carnes_y_proteinas";
  if (/(leche|queso|yogur|manteca|crema)/.test(n)) return "lacteos";
  if (/(banana|manzana|frutilla|naranja|lim[oó]n|lima|palta|frutos)/.test(n))
    return "frutas";
  if (
    /(sal|pimienta|or[eé]gano|comino|canela|laurel|pimentón|condimento|especia)/.test(
      n
    )
  )
    return "condimentos";
  if (
    /(tomate|cebolla|zanahoria|morr[oó]n|espinaca|acelga|zucchini|berenjena|br[oó]coli|apio|pepino|r[uú]cula|ajo|perejil|cilantro)/.test(
      n
    )
  )
    return "verduras";
  return "almacen";
}

export type IngredientLine = { item: string; cantidad?: string };

export type ShoppingItem = {
  category: Category;
  name: string;
  quantity: string;
};

export function aggregateIngredients(
  recipesIngredients: IngredientLine[][]
): ShoppingItem[] {
  const byKey = new Map<
    string,
    { category: Category; name: string; quantities: Set<string> }
  >();

  for (const ingredients of recipesIngredients) {
    for (const ing of ingredients ?? []) {
      const raw = ing.item?.trim();
      if (!raw) continue;
      const lower = raw.toLowerCase();
      const canonical = ALIAS[lower] ?? lower;
      const category = CATEGORY_MAP[canonical] ?? guessCategory(canonical);
      const displayName =
        canonical.charAt(0).toUpperCase() + canonical.slice(1);

      const key = `${category}:${canonical}`;
      if (!byKey.has(key)) {
        byKey.set(key, { category, name: displayName, quantities: new Set() });
      }
      if (ing.cantidad) byKey.get(key)!.quantities.add(ing.cantidad);
    }
  }

  return Array.from(byKey.values())
    .map((v) => ({
      category: v.category,
      name: v.name,
      quantity: Array.from(v.quantities).join(" + "),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

// Server-only: borra y regenera la lista de un menú semanal dado.
export async function generateShoppingList(
  supabase: any,
  userId: string,
  weeklyMenuId: string
) {
  await supabase
    .from("shopping_list_items")
    .delete()
    .eq("weekly_menu_id", weeklyMenuId)
    .eq("user_id", userId);

  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("recipe_id")
    .eq("weekly_menu_id", weeklyMenuId);

  const recipeIds = Array.from(
    new Set((menuItems ?? []).map((m: any) => m.recipe_id))
  );

  if (recipeIds.length === 0) return;

  const { data: recipes } = await supabase
    .from("recipes")
    .select("ingredients")
    .in("id", recipeIds);

  const items = aggregateIngredients(
    (recipes ?? []).map((r: any) => r.ingredients as IngredientLine[])
  );

  if (items.length === 0) return;

  await supabase.from("shopping_list_items").insert(
    items.map((it) => ({
      user_id: userId,
      weekly_menu_id: weeklyMenuId,
      category: it.category,
      name: it.name,
      quantity: it.quantity || null,
      checked: false,
    }))
  );
}
