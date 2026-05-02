"use client";

import Link from "next/link";
import { Logo } from "@/components/academy/Logo";
import { MobileNav } from "@/components/academy/MobileNav";
import { Sidebar } from "@/components/academy/Sidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_NAV, STUDENT_NAV, type NavItem } from "@/lib/navConfig";

export function AppShell({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const nav: NavItem[] = isAdmin ? ADMIN_NAV : STUDENT_NAV;
  const homeHref = isAdmin ? "/dashboard" : "/announcements";

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || user?.phone || "Account";

  return (
    <div className="min-h-full bg-gradient-to-b from-white/90 via-emerald-50/50 to-teal-100/70 text-zinc-900 dark:bg-zinc-950 dark:bg-none dark:from-transparent dark:to-transparent dark:text-zinc-100">
      <header
        style={{
          paddingTop: "max(12px, calc(env(safe-area-inset-top, 0px) + 8px))",
        }}
        className="sticky top-0 z-50 flex min-h-[3.25rem] w-full items-center gap-4 border-b border-emerald-200/60 bg-white/85 px-4 pb-3 shadow-[0_8px_30px_-12px_rgba(16,185,129,0.25)] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-none"
      >
        <Link
          href={homeHref}
          className="-m-2 mr-auto min-w-0 shrink rounded-xl p-2 outline-offset-4 hover:bg-emerald-50/80 dark:hover:bg-zinc-900/70"
          aria-label="XYZ Academy — home"
        >
          <Logo className="max-sm:scale-[0.92]" />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span className="hidden max-w-[140px] truncate text-xs text-zinc-600 dark:text-zinc-400 sm:block md:max-w-[220px]">
            <span className="font-medium text-emerald-900 dark:text-zinc-200">{displayName}</span>
            <span className="mx-1.5 text-emerald-300 dark:text-zinc-600">·</span>
            <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 uppercase tracking-wide text-emerald-800 dark:bg-transparent dark:p-0 dark:text-zinc-400">
              {isAdmin ? "Admin" : "Player"}
            </span>
          </span>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-900 shadow-sm transition hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:px-4 sm:text-sm"
          >
            Log out
          </button>
        </div>
      </header>

      <Sidebar items={nav} />
      <div className="min-h-screen flex-1 lg:pl-[260px]">
        <MobileNav items={nav} />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </div>
    </div>
  );
}
