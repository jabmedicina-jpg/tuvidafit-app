"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProgressPhoto } from "./ProgresoView";

const ANGLES = [
  { value: "frente", label: "Frente" },
  { value: "perfil", label: "Perfil" },
  { value: "espalda", label: "Espalda" },
] as const;

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function FotosTab({
  userId,
  photos,
}: {
  userId: string;
  photos: ProgressPhoto[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [angle, setAngle] = useState<(typeof ANGLES)[number]["value"]>(
    "frente"
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof ANGLES)[number]["value"]>(
    "frente"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const today = new Date().toISOString().slice(0, 10);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/${Date.now()}-${angle}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("progress-photos")
      .upload(path, file);

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      return;
    }

    const { error: insertError } = await supabase
      .from("progress_photos")
      .insert({
        user_id: userId,
        taken_at: today,
        angle,
        storage_path: path,
      });

    setUploading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(photo: ProgressPhoto) {
    setDeletingId(photo.id);
    await supabase.storage.from("progress-photos").remove([photo.storage_path]);
    await supabase.from("progress_photos").delete().eq("id", photo.id);
    setDeletingId(null);
    router.refresh();
  }

  const filtered = photos.filter((p) => p.angle === filter);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-purple bg-purple/10 rounded-xl px-4 py-3 flex items-start gap-2">
        <span>🔒</span>
        <span>
          Tus fotos son privadas y solo vos las ves. No se analizan ni se
          juzgan — son solo un registro visual.
        </span>
      </p>

      <div className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm bg-purple/5">
        <span className="text-sm font-semibold text-ink">
          Agregar una foto
        </span>
        <div className="flex gap-2">
          {ANGLES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => setAngle(a.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                angle === a.value
                  ? "bg-purple text-white"
                  : "bg-white text-purple border border-purple/30"
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <label className="rounded-xl border-2 border-dashed border-purple/30 bg-white px-4 py-3 text-sm text-muted flex items-center justify-center gap-2 cursor-pointer">
          <span>📷</span>
          <span>{uploading ? "Subiendo…" : "Elegir foto"}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      <div className="flex gap-2">
        {ANGLES.map((a) => (
          <button
            key={a.value}
            onClick={() => setFilter(a.value)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filter === a.value
                ? "bg-ink text-white"
                : "bg-[#F1F4F4] text-muted"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">
          Todavía no subiste fotos de{" "}
          {ANGLES.find((a) => a.value === filter)?.label.toLowerCase()}.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-col gap-1.5">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#F1F4F4]">
                {p.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.url}
                    alt={`Foto de progreso, ${p.angle}, ${formatDate(p.taken_at)}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  {formatDate(p.taken_at)}
                </span>
                <button
                  type="button"
                  disabled={deletingId === p.id}
                  onClick={() => handleDelete(p)}
                  className="text-xs text-red-600 disabled:opacity-50"
                >
                  {deletingId === p.id ? "…" : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
