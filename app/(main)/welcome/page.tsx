"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function WelcomePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const homeHref = isAdmin ? "/dashboard" : "/announcements";

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email || user?.phone || "there";

  return (
    <div className="mx-auto max-w-lg py-8 text-center sm:py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
        XYZ Academy
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-emerald-950 dark:text-zinc-50">
        Welcome{displayName !== "there" ? `, ${displayName}` : ""}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-teal-900/85 dark:text-zinc-400">
        {isAdmin
          ? "You’re signed in with full academy access — dashboard, squads, fees, announcements, fixtures, and player management."
          : "You’re signed in — check announcements for updates and fixtures for upcoming and recent matches."}
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href={homeHref}
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-teal-600/35 transition hover:from-emerald-500 hover:to-teal-500"
        >
          Continue to your hub
        </Link>
        <Link
          href="/announcements"
          className="inline-flex items-center justify-center rounded-2xl border-2 border-emerald-200/90 bg-white/90 px-8 py-4 text-base font-semibold text-emerald-900 transition hover:bg-emerald-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          View announcements
        </Link>
      </div>
    </div>
  );
}
