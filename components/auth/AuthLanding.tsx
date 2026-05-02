"use client";

import Link from "next/link";
import { Logo } from "@/components/academy/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AuthLanding() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-cyan-100 text-emerald-950 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 dark:text-zinc-100">
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-emerald-400/35 blur-3xl dark:bg-emerald-500/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[440px] w-[440px] rounded-full bg-cyan-400/30 blur-3xl dark:bg-emerald-600/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-teal-300/25 blur-2xl dark:opacity-0"
        aria-hidden
      />

      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
        <Logo className="mb-10 scale-125 drop-shadow-lg drop-shadow-emerald-500/20 dark:drop-shadow-none" />
        <h1 className="bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-sm dark:bg-none dark:text-zinc-50 sm:text-5xl">
          XYZ Academy
        </h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-teal-900/85 dark:text-zinc-400">
          Sign in to your squad hub — coaches get the full console; players see news and fixtures.
        </p>

        <div className="mt-12 flex w-full max-w-sm flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-teal-600/35 transition hover:from-emerald-500 hover:to-teal-500 sm:flex-initial"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="inline-flex flex-1 items-center justify-center rounded-2xl border-2 border-white/70 bg-white/90 px-8 py-4 text-base font-semibold text-emerald-900 shadow-lg shadow-emerald-900/10 backdrop-blur-sm transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-none dark:hover:bg-zinc-800 sm:flex-initial"
          >
            Log in
          </Link>
        </div>
<<<<<<< HEAD

        <p className="mt-14 max-w-sm text-xs leading-relaxed text-teal-900/65 dark:text-zinc-500">
          
        </p>
=======
>>>>>>> 328e45d (gsdfhfh)
      </div>
    </div>
  );
}
