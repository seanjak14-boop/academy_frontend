"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/authConstants";
import { Logo } from "@/components/academy/Logo";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

function AuthSplash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-emerald-50 to-cyan-100 dark:bg-zinc-950">
      <div className="h-10 w-10 animate-pulse rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 dark:bg-emerald-500/40" />
    </div>
  );
}

export function LoginForm() {
  const { loginWithPassword, user, isReady } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !user) return;
    router.replace(user.role === "admin" ? "/dashboard" : "/announcements");
  }, [user, isReady, router]);

  if (!isReady || user) {
    return <AuthSplash />;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = loginWithPassword(identifier, password);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    const isAdmin =
      identifier.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;
    router.push(isAdmin ? "/dashboard" : "/announcements");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-emerald-50/90 to-teal-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16 sm:px-6">
        <div className="mb-10 flex justify-center">
          <Logo className="scale-110" />
        </div>
        <div className="rounded-2xl border-2 border-emerald-100/80 bg-white/95 p-8 shadow-2xl shadow-emerald-600/15 ring-2 ring-teal-200/40 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/85 dark:shadow-black/40 dark:ring-white/10">
          <h1 className="text-center text-2xl font-bold tracking-tight">Log in</h1>
          <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Use your email or phone with your password.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="login-id" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Email or phone
              </label>
              <input
                id="login-id"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="you@email.com or +44…"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-emerald-500/0 transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label htmlFor="login-pass" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Password
              </label>
              <input
                id="login-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-500 dark:shadow-emerald-900/40"
            >
              Log in
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider text-zinc-400">
              <span className="bg-white px-3 dark:bg-zinc-900/80">Or</span>
            </div>
          </div>

          <SocialAuthButtons />

          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
              Sign up
            </Link>
          </p>
        </div>
        <p className="mt-8 text-center text-xs text-zinc-400">
          <Link href="/" className="hover:underline">
            ← Back to welcome
          </Link>
        </p>
      </div>
    </div>
  );
}
