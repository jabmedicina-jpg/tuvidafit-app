import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="h-56 flex-shrink-0 bg-teal rounded-b-[32px] flex flex-col items-center justify-center gap-3 px-7 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <ellipse cx="20" cy="24" rx="7" ry="11" fill="#FFFFFF" opacity="0.9" transform="rotate(-18 20 24)" />
            <ellipse cx="20" cy="24" rx="7" ry="11" fill="#D6FFEA" transform="rotate(18 20 24)" />
            <ellipse cx="20" cy="16" rx="6" ry="9" fill="#FFC94A" />
          </svg>
          <span className="font-display font-bold text-2xl">
            <span className="text-white">TuVida</span>
            <span className="text-[#D6FFEA]">Fit</span>
          </span>
        </div>
        <p className="text-[#F0FCFD] font-semibold text-sm text-center">
          Tu comida. Tu objetivo. Tu ritmo.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 p-7">
        <p className="text-muted text-sm mb-2 text-center">
          Menús semanales a tu medida, con recetas fit argentinas y brasileñas.
        </p>
        <Link
          href="/login?mode=signup"
          className="w-full text-center rounded-2xl bg-orange text-white font-bold py-4"
        >
          Crear cuenta
        </Link>
        <Link
          href="/login"
          className="w-full text-center rounded-2xl border border-ink text-ink font-semibold py-4"
        >
          Iniciar sesión
        </Link>
      </div>
    </main>
  );
}
