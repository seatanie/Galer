"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithMagicLink,
  resetPassword,
  signInWithGoogle,
  signInWithGithub,
} from "@/lib/auth/actions";
import { MagneticButton } from "@/components/premium/magnetic-button";

type AuthMode = "login" | "register" | "magic" | "reset";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    formData.set("_mode", mode);

    let result;
    if (mode === "login") result = await signInWithEmail(formData);
    else if (mode === "register") result = await signUpWithEmail(formData);
    else if (mode === "magic") result = await signInWithMagicLink(formData);
    else result = await resetPassword(formData);

    if (result) {
      if ("error" in result && result.error) {
        setError(result.error);
        setPending(false);
        return;
      }
      if ("success" in result && result.success) {
        // Login exitoso — redirigir al panel
        if (mode === "login") {
          router.push("/admin");
          return;
        }
        setMessage(typeof result.success === "string" ? result.success : "Listo");
        setPending(false);
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      <h1 className="mb-2 text-2xl font-light text-white">Panel Admin</h1>
      <p className="mb-8 text-sm text-white/50">
        Autenticación 100% Supabase Auth
      </p>

      <div className="mb-6 grid grid-cols-2 gap-2">
        {(
          [
            ["login", "Entrar"],
            ["register", "Registro"],
            ["magic", "Magic link"],
            ["reset", "Recuperar"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`rounded-lg py-2 text-xs ${
              mode === key ? "bg-violet-500/30 text-violet-300" : "text-white/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="_mode" value={mode} />
        <input
          name="email"
          type="email"
          required
          placeholder="email@ejemplo.com"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
        />
        {(mode === "login" || mode === "register") && (
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Contraseña (mín. 6)"
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
          />
        )}
        <MagneticButton type="submit" disabled={pending} className="w-full">
          {pending ? "Procesando..." : mode === "login" ? "Iniciar sesión" : mode === "register" ? "Crear cuenta" : mode === "magic" ? "Enviar magic link" : "Enviar enlace de recuperación"}
        </MagneticButton>
      </form>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      {message && <p className="mt-4 text-sm text-emerald-400">{message}</p>}

      <div className="my-8 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/40">OAuth Supabase</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="flex gap-3">
        <form action={signInWithGoogle} className="flex-1">
          <MagneticButton type="submit" className="w-full text-sm">
            Google
          </MagneticButton>
        </form>
        <form action={signInWithGithub} className="flex-1">
          <MagneticButton type="submit" className="w-full text-sm">
            GitHub
          </MagneticButton>
        </form>
      </div>
    </motion.div>
  );
}
