"use client";

import type { ProgressLog, ProgressPhoto } from "./ProgresoView";
import { ACCENT, type AccentColor } from "../colorClasses";

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function LogrosTab({
  logs,
  photos,
}: {
  logs: ProgressLog[];
  photos: ProgressPhoto[];
}) {
  const withWeight = logs.filter((l) => l.weight_kg != null);
  const first = withWeight[0];
  const last = withWeight[withWeight.length - 1];
  const weeksTracking = first
    ? Math.max(
        1,
        Math.round(
          (Date.now() - new Date(first.logged_at).getTime()) /
            (1000 * 60 * 60 * 24 * 7)
        )
      )
    : 0;

  const cards: { label: string; value: string; icon: string; color: AccentColor }[] = [
    {
      label: "Registros cargados",
      value: `${logs.length}`,
      icon: "📊",
      color: "blue",
    },
    {
      label: "Fotos de progreso",
      value: `${photos.length}`,
      icon: "📷",
      color: "purple",
    },
    ...(first
      ? [
          {
            label: "Constancia",
            value: `${weeksTracking} ${
              weeksTracking === 1 ? "semana" : "semanas"
            } registrando`,
            icon: "🔥",
            color: "orange" as AccentColor,
          },
        ]
      : []),
    ...(first && last && first.id !== last.id
      ? [
          {
            label: "Desde el primer registro",
            value: `${formatDate(first.logged_at)} → ${formatDate(
              last.logged_at
            )}`,
            icon: "🏆",
            color: "green" as AccentColor,
          },
        ]
      : []),
  ];

  if (cards.length === 0) {
    return (
      <p className="text-sm text-muted">
        Todavía no hay nada para mostrar acá — registrá tu primer dato en la
        pestaña Datos.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-muted">
        El progreso no depende solo del peso: también cuentan la constancia y
        los hábitos.
      </p>
      {cards.map((c) => {
        const color = ACCENT[c.color];
        return (
          <div
            key={c.label}
            className={`rounded-2xl p-4 flex items-center gap-3 shadow-sm ${color.bgSofter}`}
          >
            <span
              className={`w-10 h-10 rounded-full ${color.bgBadge} flex items-center justify-center text-lg shrink-0`}
            >
              {c.icon}
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-muted">{c.label}</span>
              <span className="text-sm font-semibold text-ink">
                {c.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
