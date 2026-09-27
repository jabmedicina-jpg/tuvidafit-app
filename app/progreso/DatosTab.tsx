"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import type { ProgressLog } from "./ProgresoView";

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function DatosTab({
  userId,
  logs,
}: {
  userId: string;
  logs: ProgressLog[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [loggedAt, setLoggedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chartData = useMemo(
    () =>
      logs
        .filter((l) => l.weight_kg != null)
        .map((l) => ({ date: formatDate(l.logged_at), peso: l.weight_kg })),
    [logs]
  );

  const latestWeight = [...logs].reverse().find((l) => l.weight_kg != null);
  const firstWeight = logs.find((l) => l.weight_kg != null);
  const delta =
    latestWeight?.weight_kg != null && firstWeight?.weight_kg != null
      ? Math.round((latestWeight.weight_kg - firstWeight.weight_kg) * 10) / 10
      : null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!weight) {
      setError("Al menos cargá el peso.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("progress_logs").insert({
      user_id: userId,
      logged_at: loggedAt,
      weight_kg: weight ? Number(weight) : null,
      waist_cm: waist ? Number(waist) : null,
      hip_cm: hip ? Number(hip) : null,
      body_fat_pct: bodyFat ? Number(bodyFat) : null,
      notes: notes || null,
    });
    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setWeight("");
    setWaist("");
    setHip("");
    setBodyFat("");
    setNotes("");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {latestWeight?.weight_kg != null && (
        <div className="border border-line rounded-2xl p-4 flex flex-col gap-1">
          <span className="text-xs text-muted">Peso actual</span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-ink">
              {latestWeight.weight_kg} kg
            </span>
            {delta !== null && delta !== 0 && (
              <span
                className={`text-sm font-semibold ${
                  delta < 0 ? "text-green" : "text-orange"
                }`}
              >
                {delta > 0 ? "+" : ""}
                {delta} kg desde el inicio
              </span>
            )}
          </div>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="border border-line rounded-2xl p-4">
          <span className="text-xs text-muted">Evolución del peso</span>
          <div className="h-40 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={["dataMin - 2", "dataMax + 2"]}
                  width={32}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#3D8361"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="border border-line rounded-2xl p-4 flex flex-col gap-3"
      >
        <span className="text-sm font-semibold text-ink">
          Registrar nuevo dato
        </span>

        <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
          Fecha
          <input
            type="date"
            value={loggedAt}
            onChange={(e) => setLoggedAt(e.target.value)}
            className="border border-line rounded-xl px-3 py-2 text-sm font-normal"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Peso (kg)
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            % grasa (opcional)
            <input
              type="number"
              step="0.1"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Cintura (cm)
            <input
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
            Cadera (cm)
            <input
              type="number"
              step="0.1"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm font-normal"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs font-semibold text-ink">
          Notas (opcional)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="border border-line rounded-xl px-3 py-2 text-sm font-normal resize-none"
          />
        </label>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-blue text-white font-bold py-3 text-sm disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Registrar nuevo dato"}
        </button>
      </form>

      {logs.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Historial</span>
          {[...logs].reverse().map((l) => (
            <div
              key={l.id}
              className="border border-line rounded-xl px-4 py-3 flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">
                  {formatDate(l.logged_at)}
                </span>
                {l.weight_kg != null && (
                  <span className="text-sm text-ink">{l.weight_kg} kg</span>
                )}
              </div>
              {(l.waist_cm || l.hip_cm || l.body_fat_pct) && (
                <div className="flex gap-3 text-xs text-muted">
                  {l.waist_cm && <span>Cintura {l.waist_cm} cm</span>}
                  {l.hip_cm && <span>Cadera {l.hip_cm} cm</span>}
                  {l.body_fat_pct && <span>{l.body_fat_pct}% grasa</span>}
                </div>
              )}
              {l.notes && (
                <p className="text-xs text-muted mt-1">{l.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
