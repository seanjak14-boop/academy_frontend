import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  accent = false,
}: {
  label: string;
  value: string | number;
  hint?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-6 py-5 ${
        accent
          ? "border-teal-200/90 bg-gradient-to-br from-emerald-50 via-white to-teal-50 shadow-md shadow-emerald-500/15 dark:border-emerald-500/35 dark:bg-emerald-500/[0.07] dark:bg-none dark:shadow-[0_0_40px_-12px_rgba(16,185,129,0.45)]"
          : "border-emerald-100/90 bg-white/95 shadow-md shadow-emerald-900/[0.04] dark:border-zinc-800 dark:bg-zinc-900/40 dark:shadow-none"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-800/85 dark:text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-2 text-4xl font-bold tabular-nums tracking-tight ${
          accent ? "text-emerald-800 dark:text-emerald-300" : "text-teal-950 dark:text-zinc-100"
        }`}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-3 text-xs text-teal-800/65 dark:text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}
