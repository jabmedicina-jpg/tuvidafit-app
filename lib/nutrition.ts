// Etapa 3 — cálculo nutricional estimado (Mifflin-St Jeor).
// Son valores orientativos: la app no reemplaza una consulta médica
// o nutricional (ver disclaimer en /perfil y en el dashboard).

export type Sex = "femenino" | "masculino" | "otro";
export type ActivityLevel =
  | "sedentario"
  | "ligero"
  | "moderado"
  | "activo"
  | "muy_activo";
export type Goal = "bajar_grasa" | "mantener" | "ganar_masa";

export type NutritionInput = {
  sex: Sex;
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: Goal;
};

export type NutritionResult = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;
};

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentario: 1.2,
  ligero: 1.375,
  moderado: 1.55,
  activo: 1.725,
  muy_activo: 1.9,
};

// Piso de seguridad para no sugerir déficits demasiado agresivos.
const MIN_CALORIES = 1200;

function mifflinStJeor({ sex, age, height_cm, weight_kg }: NutritionInput) {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  if (sex === "masculino") return base + 5;
  if (sex === "femenino") return base - 161;
  // "otro": promedio de ambos ajustes, como aproximación razonable.
  return base - 78;
}

const MACRO_SPLIT: Record<
  Goal,
  { protein: number; carbs: number; fat: number }
> = {
  bajar_grasa: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  mantener: { protein: 0.25, carbs: 0.45, fat: 0.3 },
  ganar_masa: { protein: 0.25, carbs: 0.5, fat: 0.25 },
};

export function calculateNutrition(input: NutritionInput): NutritionResult {
  const bmr = mifflinStJeor(input);
  const tdee = bmr * ACTIVITY_MULTIPLIER[input.activity_level];

  let calories = tdee;
  if (input.goal === "bajar_grasa") calories = tdee - 450;
  if (input.goal === "ganar_masa") calories = tdee + 350;
  calories = Math.max(Math.round(calories), MIN_CALORIES);

  const split = MACRO_SPLIT[input.goal];

  return {
    calories,
    protein_g: Math.round((calories * split.protein) / 4),
    carbs_g: Math.round((calories * split.carbs) / 4),
    fat_g: Math.round((calories * split.fat) / 9),
    protein_pct: Math.round(split.protein * 100),
    carbs_pct: Math.round(split.carbs * 100),
    fat_pct: Math.round(split.fat * 100),
  };
}
