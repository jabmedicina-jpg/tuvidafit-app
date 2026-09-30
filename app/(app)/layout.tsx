import Link from "next/link";
import BottomNav from "./BottomNav";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let avatarUrl: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_path, last_seen_at")
      .eq("id", user.id)
      .single();

    // Registro de actividad: actualiza last_seen_at como máximo una vez por día
    const unDia = 24 * 60 * 60 * 1000;
    const ultima = profile?.last_seen_at
      ? new Date(profile.last_seen_at).getTime()
      : 0;
    if (profile && Date.now() - ultima > unDia) {
      await supabase
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", user.id);
    }

    if (profile?.avatar_path) {
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(profile.avatar_path);
      avatarUrl = data.publicUrl;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-line shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 40 40" aria-hidden="true">
            <ellipse cx="20" cy="24" rx="7" ry="11" fill="#12A9B3" transform="rotate(-18 20 24)"></ellipse>
            <ellipse cx="20" cy="24" rx="7" ry="11" fill="#2ECC71" transform="rotate(18 20 24)"></ellipse>
            <ellipse cx="20" cy="16" rx="6" ry="9" fill="#FFC94A"></ellipse>
          </svg>
          <span className="font-display font-bold text-base">
            <span className="text-ink">TuVida</span>
            <span className="text-green">Fit</span>
          </span>
        </Link>

        <Link
          href="/perfil"
          aria-label="Mi Perfil"
          className="w-8 h-8 rounded-full bg-[#E3F8FA] flex items-center justify-center shrink-0 overflow-hidden"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Tu foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#12A9B3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"></path>
            </svg>
          )}
        </Link>
      </header>

      <div className="flex-1 pb-20">{children}</div>

      <BottomNav />
    </div>
  );
}
