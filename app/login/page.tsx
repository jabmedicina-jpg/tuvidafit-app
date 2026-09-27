"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos."
          : error.message
      );
      return;
    }

    if (mode === "signup") {
      // Si Supabase pide confirmación por correo, no habrá sesión todavía.
      router.push("/login?checkEmail=1");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="px-7 pt-11 pb-4 flex flex-col items-center gap-2">
        <Link href="/" className="font-display font-bold text-xl" aria-label="Volver al inicio">
          <span className="text-ink">TuVida</span>
          <span className="text-green">Fit</span>
        </Link>
      </div>

      <div className="flex-1 px-7 pb-10 flex flex-col">
        <h1 className="font-display font-semibold text-2xl text-ink mb-1">
          {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
        </h1>
        <p className="text-sm text-muted mb-6">
          {mode === "signin"
            ? "Ingresá para ver tu menú de esta semana."
            : "Creá tu cuenta para armar tu primer menú."}
        </p>

        {searchParams.get("checkEmail") && (
          <p className="text-sm text-teal bg-teal/10 rounded-xl px-4 py-3 mb-4">
            Revisá tu correo para confirmar la cuenta antes de ingresar.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Correo electrónico
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-line rounded-xl px-4 py-3.5 text-[15px] font-normal focus:outline-none focus:border-blue"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
            Contraseña
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-line rounded-xl px-4 py-3.5 text-[15px] font-normal focus:outline-none focus:border-blue"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-2xl bg-blue text-white font-bold py-4 disabled:opacity-60"
          >
            {loading ? "Un momento…" : mode === "signin" ? "Ingresar" : "Crear cuenta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-blue font-semibold text-center"
        >
          {mode === "signin"
            ? "¿No tenés cuenta? Creá una"
            : "¿Ya tenés cuenta? Iniciá sesión"}
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
