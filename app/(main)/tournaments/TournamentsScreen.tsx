"use client";

import { PageHeader } from "@/components/academy/PageHeader";
import { StatCard } from "@/components/academy/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { formatMatchDate } from "@/lib/dates";
import { matches } from "@/lib/mockData";

export function TournamentsScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const upcoming = [...matches.filter((m) => m.status === "upcoming")].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const done = [...matches.filter((m) => m.status === "completed")].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <>
      <PageHeader
        title={isAdmin ? "Matches & tournaments" : "Upcoming & recent matches"}
        description={
          isAdmin
            ? "Academy-affiliated fixtures: upcoming diary plus recent results."
            : "Fixtures involving XYZ Academy squads — kick-off times are indicative (demo data)."
        }
      />

      {isAdmin ? (
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          <StatCard label="Upcoming fixtures" value={upcoming.length} accent />
          <StatCard label="Played (sample window)" value={done.length} />
          <StatCard
            label="Competitions tracked"
            value={new Set(matches.map((m) => m.competition)).size}
            hint="Friendlies grouped separately"
          />
        </div>
      ) : (
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          <StatCard label="Upcoming" value={upcoming.length} accent hint="Next academy fixtures" />
          <StatCard label="Completed (sample)" value={done.length} hint="Recent scorelines" />
        </div>
      )}

      <MatchSection tone="future" eyebrow="Upcoming" subtitle="Kick-off times are local academy time." rows={upcoming} />
      <MatchSection tone="past" eyebrow="Completed" subtitle="Scorelines from recent encounters." rows={done} />
    </>
  );
}

function MatchSection({
  tone,
  eyebrow,
  subtitle,
  rows,
}: {
  tone: "future" | "past";
  eyebrow: string;
  subtitle: string;
  rows: typeof matches;
}) {
  const titleCls = tone === "future" ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-800 dark:text-zinc-200";

  return (
    <section className={`mb-16 ${tone === "past" ? "pt-10" : ""}`}>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-500">
            {eyebrow}
          </p>
          <h2 className={`mt-1 text-2xl font-bold ${titleCls}`}>
            {tone === "future" ? "Coming up" : "Results archive"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{subtitle}</p>
        </div>
      </header>
      <div className="space-y-4">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
            No fixtures in this list yet — seed your calendar backend when ready.
          </p>
        ) : (
          rows.map((m) => (
            <article
              key={m.id}
              className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/30 lg:flex-row lg:items-center"
            >
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                  {m.competition}
                </p>
                <time className="mt-3 block text-sm text-zinc-600 dark:text-zinc-400">{formatMatchDate(m.date)}</time>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-600">{m.venue}</p>
              </div>
              <div className="flex flex-1 items-center gap-8">
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-semibold ${
                      xyzSide(m.home) ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {m.home}
                  </p>
                </div>
                {tone === "past" &&
                typeof m.homeScore === "number" &&
                typeof m.awayScore === "number" ? (
                  <div className="shrink-0 rounded-xl bg-zinc-100 px-5 py-3 text-center ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800">
                    <p className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                      {m.homeScore} – {m.awayScore}
                    </p>
                    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-600">
                      Full-time
                    </p>
                  </div>
                ) : (
                  <div className="shrink-0 rounded-xl bg-emerald-500/10 px-5 py-3 text-center ring-1 ring-emerald-500/30">
                    <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Upcoming</p>
                  </div>
                )}
                <div className="min-w-0 flex-1 text-right lg:text-right">
                  <p
                    className={`truncate font-semibold ${
                      xyzSide(m.away) ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {m.away}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function xyzSide(team: string): boolean {
  return team.toLowerCase().includes("xyz");
}
