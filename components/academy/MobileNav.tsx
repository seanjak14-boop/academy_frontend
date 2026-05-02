"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/navConfig";

export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      style={{
        top: "max(73px, calc(env(safe-area-inset-top, 0px) + 5.75rem))",
        WebkitOverflowScrolling: "touch",
      }}
      className="scrollbar-none sticky z-30 flex gap-2 overflow-x-auto border-b border-emerald-200/60 bg-white/92 px-4 py-3 shadow-sm shadow-emerald-900/[0.04] backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 dark:shadow-none lg:hidden"
      aria-label="Mobile navigation"
    >
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium ${
              active
                ? "bg-emerald-100 font-semibold text-emerald-900 ring-2 ring-emerald-400/60 dark:bg-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-500/40"
                : "border border-transparent bg-emerald-50/50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
