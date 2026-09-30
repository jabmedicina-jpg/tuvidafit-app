"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ActivityLevel =
  | "sedentario"
  | "ligero"
  | "moderado"
  | "activo"
  | "muy_activo";
type Goal = "bajar_grasa" | "mantener" | "ganar_masa";
type CuisinePref = "argentina" | "brasil" | "ambas" | "todas";
type Sex = "femenino" | "masculino" | "otro";

type Profile = {
  full_name: string | null;
  age: number | null;
  sex: Sex | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: ActivityLevel | null;
  goal: Goal | null;
  diet_restrictions: string[] | null;
  allergies: string | null;
  excluded_foods: string | null;
  cuisine_pref: CuisinePref | null;
} | null;

const RESTRICCIONES = [
  { value: "sin_gluten", label: "Sin gluten (celiaquía)" },
  { value: "vegetariano", label: "Vegetariana" },
  { value: "vegano", label: "Vegana" },
  { value: "sin_lactosa", label: "Sin lactosa" },
];

export default function PerfilForm({
  userId,
  initialProfile,
  initialAvatarUrl,
}: {
  userId: string;
  initialProfile: Profile;
  initialAvatarUrl: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [age, setAge] = useState(initialProfile?.age?.toString() ?? "");
  const [sex, setSex] = useState<Sex | "">(initialProfile?.sex ?? "");
  const [height, setHeight] = useState(
    initialProfile?.height_cm?.toString() ?? ""
  );
  const [weight, setWeight] = useState(
    initialProfile?.weight_kg?.toString() ?? ""
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">(
    initialProfile?.activity_level ?? ""
  );
  const [goal, setGoal] = useState<Goal | "">(initialProfile?.goal ?? "");
  const [restrictions, setRestrictions] = useState<string[]>(
    initialProfile?.diet_restrictions ?? []
  );
  const [allergies, setAllergies] = useState(initialProfile?.allergies ?? "");
  const [excludedFoods, setExcludedFoods] = useState(
    initialProfile?.excluded_foods ?? ""
  );
  const [cuisinePref, setCuisinePref] = useState<CuisinePref>(
    initialProfile?.cuisine_pref ?? "ambas"
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isCeliac = restrictions.includes("sin_gluten");

  function toggleRestriction(value: string) {
    setRestrictions((prev) =>
      prev.includes(value)
        ? prev.filter((r) => r !== value)
        : [...prev, value]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: fullName || null,
      age: age ? Number(age) : null,
      sex: sex || null,
      height_cm: height ? Number(height) : null,
      weight_kg: weight ? Number(weight) : null,
      activity_level: activityLevel || null,
      goal: goal || null,
      diet_restrictions: restrictions,
      allergies: allergies || null,
      excluded_foods: excludedFoods || null,
      cuisine_pref: cuisinePref,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setUploadingAvatar(true);

    const path = `${userId}/avatar`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUploadingAvatar(false);
      setAvatarError(uploadError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .upsert({ id: userId, avatar_path: path });

    setUploadingAvatar(false);

    if (updateError) {
      setAvatarError(updateError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
    router.refresh();
  }

  return (
    <main className="bg-white px-6 pt-8 pb-16">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">
        Mi Perfil
      </h1>
      <p className="text-sm text-muted mb-6">
        Con estos datos armamos tu objetivo calórico y tu menú semanal.
      </p>

      <div className="flex flex-col items-center gap-2 mb-7">
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-teal/10 flex items-center justify-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Tu foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#12A9B3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"></circle>
                <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path>
              </svg>
            )}
          </div>
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingAvatar}
            aria-label="Cambiar foto de perfil"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center shadow-sm disabled:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7h3l2-2h6l2 2h3a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8a1 1 0 011-1z"></path>
              <circle cx="12" cy="13" r="3.5"></circle>
            </svg>
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        {uploadingAvatar && (
          <span className="text-xs text-muted">Subiendo…</span>
        )}
        {avatarError && (
          <span className="text-xs text-red-600">{avatarError}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Nombre
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre"
            className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal focus:outline-none focus:border-blue"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Edad
            <input
              type="number"
              min={12}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal focus:outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Sexo
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as Sex)}
              className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal bg-white focus:outline-none focus:border-blue"
            >
              <option value="">Elegir</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Altura (cm)
            <input
              type="number"
              min={100}
              max={230}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal focus:outline-none focus:border-blue"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Peso (kg)
            <input
              type="number"
              min={30}
              max={250}
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal focus:outline-none focus:border-blue"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Nivel de actividad física
          <select
            value={activityLevel}
            onChange={(e) =>
              setActivityLevel(e.target.value as ActivityLevel)
            }
            className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal bg-white focus:outline-none focus:border-blue"
          >
            <option value="">Elegir</option>
            <option value="sedentario">Sedentario (poco o nada de ejercicio)</option>
            <option value="ligero">Ligero (1 a 3 días por semana)</option>
            <option value="moderado">Moderado (3 a 5 días por semana)</option>
            <option value="activo">Activo (6 a 7 días por semana)</option>
            <option value="muy_activo">Muy activo (entrenamiento intenso o trabajo físico)</option>
          </select>
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-ink mb-1">Objetivo</legend>
          {[
            { value: "bajar_grasa", label: "Perder grasa / bajar de peso" },
            { value: "mantener", label: "Mantener peso" },
            { value: "ganar_masa", label: "Ganar masa muscular" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-ink bg-[#F7F9FA] has-[:checked]:bg-teal/10"
            >
              <input
                type="radio"
                name="goal"
                value={opt.value}
                checked={goal === opt.value}
                onChange={() => setGoal(opt.value as Goal)}
                className="accent-blue"
              />
              {opt.label}
            </label>
          ))}
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-ink mb-1">
            Restricciones alimentarias
          </legend>
          {RESTRICCIONES.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-ink bg-[#F7F9FA] has-[:checked]:bg-teal/10"
            >
              <input
                type="checkbox"
                checked={restrictions.includes(opt.value)}
                onChange={() => toggleRestriction(opt.value)}
                className="accent-blue"
              />
              {opt.label}
            </label>
          ))}

          {isCeliac && (
            <p className="text-xs text-teal bg-teal/10 rounded-xl px-4 py-3">
              Vamos a priorizar recetas aptas para celíacos, marcadas por
              separado de las convencionales, y a avisarte cuando haya
              riesgo de contaminación cruzada.
            </p>
          )}
        </fieldset>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Alergias alimentarias
          <input
            type="text"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="Ej: maní, mariscos"
            className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal focus:outline-none focus:border-blue"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
          Alimentos que no consumís
          <input
            type="text"
            value={excludedFoods}
            onChange={(e) => setExcludedFoods(e.target.value)}
            placeholder="Ej: hígado, berenjena"
            className="border border-line rounded-xl px-4 py-3 text-[15px] font-normal focus:outline-none focus:border-blue"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-ink mb-1">
            Preferencia de cocina
          </legend>
          {[
            { value: "argentina", label: "Argentina" },
            { value: "brasil", label: "Brasil" },
            { value: "ambas", label: "Argentina + Brasil" },
            { value: "todas", label: "Todas las cocinas" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] text-ink bg-[#F7F9FA] has-[:checked]:bg-teal/10"
            >
              <input
                type="radio"
                name="cuisine"
                value={opt.value}
                checked={cuisinePref === opt.value}
                onChange={() => setCuisinePref(opt.value as CuisinePref)}
                className="accent-blue"
              />
              {opt.label}
            </label>
          ))}
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-2xl bg-green text-white font-bold py-4 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar perfil"}
        </button>

        <p className="text-xs text-muted text-center leading-relaxed">
          Los cálculos que te mostremos van a ser una estimación
          orientativa y no reemplazan una consulta médica o nutricional.
        </p>
      </form>
    </main>
  );
}
