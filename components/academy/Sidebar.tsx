"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/navConfig";

/** Sidebar starts below the sticky header so it never sits under the top nav / OS chrome. */
export function Sidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      style={{
        /* Clears sticky header height (incl. safe-area padding) without double-counting insets. */
        top: "calc(env(safe-area-inset-top, 0px) + 4.75rem)",
        bottom: "max(0px, env(safe-area-inset-bottom, 0px))",
      }}
      className="fixed left-0 z-40 hidden w-[260px] flex-col overflow-y-auto overscroll-contain border-r border-emerald-200/60 bg-white/95 bg-gradient-to-b from-white via-white to-emerald-50/70 px-5 pb-8 pt-6 shadow-xl shadow-emerald-900/[0.06] backdrop-blur-md dark:border-zinc-800 dark:from-zinc-950/95 dark:via-zinc-950/95 dark:to-zinc-950/95 dark:shadow-black/40 lg:flex"
    >
      <nav className="flex flex-1 flex-col gap-1" aria-label="Main">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/15 font-semibold text-emerald-800 ring-2 ring-emerald-400/50 dark:text-emerald-300 dark:ring-emerald-500/35"
                  : "text-zinc-700 hover:bg-emerald-50 hover:text-emerald-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <p className="mt-8 shrink-0 border-t border-emerald-200/60 pt-6 text-[11px] leading-relaxed text-emerald-800/80 dark:border-zinc-800 dark:text-zinc-500">
        Frontend preview — wire authentication and APIs when your backend is ready.
      </p>
    </aside>
  );
}
