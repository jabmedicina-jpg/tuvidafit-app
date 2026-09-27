import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProgresoView from "./ProgresoView";

export default async function ProgresoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: logs } = await supabase
    .from("progress_logs")
    .select("id, logged_at, weight_kg, waist_cm, hip_cm, body_fat_pct, notes")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: true });

  const { data: photoRows } = await supabase
    .from("progress_photos")
    .select("id, taken_at, angle, storage_path")
    .eq("user_id", user.id)
    .order("taken_at", { ascending: false });

  const photos = await Promise.all(
    (photoRows ?? []).map(async (p) => {
      const { data: signed } = await supabase.storage
        .from("progress-photos")
        .createSignedUrl(p.storage_path, 3600);
      return {
        id: p.id,
        taken_at: p.taken_at as string,
        angle: p.angle as string,
        storage_path: p.storage_path as string,
        url: signed?.signedUrl ?? null,
      };
    })
  );

  return (
    <ProgresoView
      userId={user.id}
      logs={logs ?? []}
      photos={photos}
    />
  );
}
