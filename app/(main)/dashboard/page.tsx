"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/academy/PageHeader";
import { StatCard } from "@/components/academy/StatCard";
import { useStudents } from "@/contexts/StudentsContext";
import { apiGet } from "@/lib/apiClient";
import { formatMatchDate } from "@/lib/dates";

export default function DashboardPage() {
  const { students } = useStudents();
  const [summary, setSummary] = useState<{
    totalRevenueCollectedThisMonth: number;
    topAttendancePlayers: Array<{ playerId: number; playerName: string; attendancePercentage: number }>;
    nextMatch: null | { home: string; away: string; startsAt: string };
  } | null>(null);
  const total = students.length;
  const presentToday = students.filter((s) => s.presentToday).length;
  const newCount = students.filter((s) => s.tier === "new").length;
  const intCount = students.filter((s) => s.tier === "intermediate").length;
  const proCount = students.filter((s) => s.tier === "professional").length;
  const pct = total > 0 ? Math.round((presentToday / total) * 100) : 0;

  useEffect(() => {
    let mounted = true;
    async function loadSummary() {
      try {
        const data = await apiGet<{
          ok: boolean;
          summary?: {
            totalRevenueCollectedThisMonth: number;
            topAttendancePlayers: Array<{ playerId: number; playerName: string; attendancePercentage: number }>;
            nextMatch: null | { home: string; away: string; startsAt: string };
          };
        }>("/api/dashboard/summary");
        if (mounted && data.ok && data.summary) setSummary(data.summary);
      } catch {
        // dashboard summary is role-gated on backend; keep UI resilient
      }
    }
    void loadSummary();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Snapshot of XYZ Academy enrolment and today's turnout. Data below is placeholder content for UI review."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered players" value={total} hint="Across all programmes" accent />
        <StatCard
          label="Present today"
          value={`${presentToday}`}
          hint={`Checked in for coaching — ${pct}%`}
        />
        <StatCard
          label="New programme"
          value={newCount}
          hint={
            <>
              View{" "}
              <Link href="/students/new" className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
                roster ↗
              </Link>
            </>
          }
        />
        <StatCard
          label="Intermediate • Pro"
          value={`${intCount} • ${proCount}`}
          hint="Squads grouped by pathway"
        />
      </div>
      {summary ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Revenue this month"
            value={`£${summary.totalRevenueCollectedThisMonth}`}
            hint="Live from billing records"
          />
          <StatCard
            label="Top attendance"
            value={summary.topAttendancePlayers[0]?.playerName || "N/A"}
            hint={`${summary.topAttendancePlayers[0]?.attendancePercentage ?? 0}% this month`}
          />
          <StatCard
            label="Next match"
            value={summary.nextMatch ? `${summary.nextMatch.home} vs ${summary.nextMatch.away}` : "No upcoming match"}
            hint={summary.nextMatch ? formatMatchDate(summary.nextMatch.startsAt) : "Schedule pending"}
          />
        </div>
      ) : null}

      <section className="mt-12 grid gap-6 lg:grid-cols-[1fr,minmax(0,320px)]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Attendance at a glance</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
            How many enrolled players versus how many stepped on the pitches today (mock counts).
          </p>
          <div className="mt-8">
            <div className="relative h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 shadow-[0_0_20px_-2px_rgba(16,185,129,0.6)]"
                style={{ width: `${total ? (presentToday / total) * 100 : 0}%` }}
              />
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-zinc-100 px-4 py-4 ring-1 ring-zinc-200 dark:bg-zinc-950/70 dark:ring-zinc-800">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Total enrolment</dt>
                <dd className="mt-1 text-3xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">{total}</dd>
              </div>
              <div className="rounded-xl bg-emerald-50 px-4 py-4 ring-1 ring-emerald-200 dark:bg-zinc-950/70 dark:ring-emerald-500/25">
                <dt className="text-xs uppercase tracking-wide text-emerald-800 dark:text-emerald-600/90">
                  Joined session
                </dt>
                <dd className="mt-1 text-3xl font-bold tabular-nums text-emerald-700 dark:text-emerald-300">
                  {presentToday}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-6 dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Today&apos;s focus</h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Quick links and the next academy session (demo copy).
            </p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between rounded-lg bg-zinc-100 px-3 py-3 ring-1 ring-zinc-200 dark:bg-zinc-950/70 dark:ring-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Morning block</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">08:45 – 11:00</span>
            </li>
            <li className="flex justify-between rounded-lg bg-zinc-100 px-3 py-3 ring-1 ring-zinc-200 dark:bg-zinc-950/70 dark:ring-zinc-800">
              <span className="text-zinc-500 dark:text-zinc-400">Evening drills</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">17:30 – 19:45</span>
            </li>
          </ul>
          <Link
            href="/tournaments"
            className="mt-auto inline-flex justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-3 text-center text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500/15 dark:text-emerald-300"
          >
            Upcoming fixtures
          </Link>
        </aside>
      </section>

      <p className="mt-12 text-center text-[11px] text-zinc-500 dark:text-zinc-600">
        Next scheduled cup tie (mock): Thu 8 May •{" "}
        <span className="text-zinc-600 dark:text-zinc-500">{formatMatchDate("2026-05-08T17:45:00.000Z")}</span>
      </p>
    </>
  );
}
