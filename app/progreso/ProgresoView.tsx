"use client";

import { useState } from "react";
import DatosTab from "./DatosTab";
import FotosTab from "./FotosTab";
import LogrosTab from "./LogrosTab";

export type ProgressLog = {
  id: string;
  logged_at: string;
  weight_kg: number | null;
  waist_cm: number | null;
  hip_cm: number | null;
  body_fat_pct: number | null;
  notes: string | null;
};

export type ProgressPhoto = {
  id: string;
  taken_at: string;
  angle: string;
  storage_path: string;
  url: string | null;
};

type Tab = "datos" | "fotos" | "logros";

export default function ProgresoView({
  userId,
  logs,
  photos,
}: {
  userId: string;
  logs: ProgressLog[];
  photos: ProgressPhoto[];
}) {
  const [tab, setTab] = useState<Tab>("datos");

  const TABS: { value: Tab; label: string }[] = [
    { value: "datos", label: "Datos" },
    { value: "fotos", label: "Fotos" },
    { value: "logros", label: "Logros" },
  ];

  return (
    <main className="min-h-screen bg-white px-6 pt-7 pb-10">
      <h1 className="font-display font-semibold text-2xl text-ink mb-1">
        Mi Progreso
      </h1>
      <p className="text-sm text-muted mb-5">
        El progreso no es solo el peso: también cuentan la constancia y los
        hábitos.
      </p>

      <div className="flex gap-2 mb-6 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-2.5 text-sm font-semibold border-b-2 -mb-px ${
              tab === t.value
                ? "border-blue text-blue"
                : "border-transparent text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "datos" && <DatosTab userId={userId} logs={logs} />}
      {tab === "fotos" && <FotosTab userId={userId} photos={photos} />}
      {tab === "logros" && <LogrosTab logs={logs} photos={photos} />}
    </main>
  );
}
