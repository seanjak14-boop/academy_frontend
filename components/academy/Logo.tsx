export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/50 bg-gradient-to-br from-emerald-100 via-white to-teal-100 shadow-lg shadow-emerald-600/20 dark:border-emerald-500/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950 dark:shadow-[0_0_24px_-4px_rgba(16,185,129,0.35)]"
        aria-hidden
      >
        <svg viewBox="0 0 40 40" className="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
          <path
            fill="currentColor"
            fillOpacity="0.15"
            d="M20 4a16 16 0 1 0 0 32 16 16 0 0 0 0-32Zm0 2.5a13.5 13.5 0 1 1 0 27 13.5 13.5 0 0 1 0-27Z"
          />
          <path
            stroke="currentColor"
            strokeWidth="1.2"
            d="M20 10v20M13 14l14 6M13 26l14-6M10 20h20"
          />
          <path
            stroke="currentColor"
            strokeWidth="1"
            d="m14 12 6 4 6-4M14 28l6-4 6 4"
            opacity={0.8}
          />
        </svg>
      </div>
      <div className="leading-tight">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-emerald-500/90">
          Football
        </p>
        <p className="text-lg font-bold tracking-tight text-emerald-950 dark:text-zinc-50">XYZ Academy</p>
      </div>
    </div>
  );
}
