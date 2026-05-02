"use client";

import { PageHeader } from "@/components/academy/PageHeader";
import { StatCard } from "@/components/academy/StatCard";
import { joinedAgo } from "@/lib/dates";
import type { Student } from "@/lib/mockData";
import { useStudents } from "@/contexts/StudentsContext";

export default function FeesPage() {
  const { students } = useStudents();
  const paid = students.filter((s) => s.feeStatus === "paid");
  const pending = students.filter((s) => s.feeStatus === "pending");
  const outstanding = pending.reduce((sum, p) => sum + p.feeAmount, 0);
  const n = students.length;
  const rate = n ? Math.round((paid.length / n) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Fees"
        description="Monthly membership snapshot across squads — paid versus pending placeholders."
      />

      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Paid this cycle" value={paid.length} accent hint="Marked settled in CRM" />
        <StatCard
          label="Pending"
          value={pending.length}
          hint={`≈ £${outstanding} outstanding (mock totals)`}
        />
        <StatCard label="Active billings" value={n} hint="All enrolments in scope" />
        <StatCard label="Collection rate" value={`${rate}%`} hint="Based on roster in this browser" />
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <FeeColumn title="Pending follow-up" subtitle="Reminder queue" badge="attention" rows={pending} />
        <FeeColumn title="Cleared invoices" subtitle="Good standing" badge="paid" rows={paid} />
      </section>
    </>
  );
}

function FeeColumn({
  title,
  subtitle,
  badge,
  rows,
}: {
  title: string;
  subtitle: string;
  badge: "attention" | "paid";
  rows: Student[];
}) {
  const badgeCls =
    badge === "attention"
      ? "bg-amber-500/15 text-amber-800 ring-amber-500/40 dark:text-amber-300"
      : "bg-emerald-500/10 text-emerald-800 ring-emerald-500/35 dark:text-emerald-300";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{subtitle}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${badgeCls}`}>
          {rows.length} player{rows.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className="mt-6 divide-y divide-zinc-200 rounded-xl bg-zinc-50 ring-1 ring-zinc-200 dark:divide-zinc-800/80 dark:bg-zinc-950/60 dark:ring-zinc-800">
        {rows.length === 0 ? (
          <li className="px-5 py-10 text-center text-sm text-zinc-500 dark:text-zinc-500">
            No entries in this list.
          </li>
        ) : (
          rows.map((p) => (
            <li key={p.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{p.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">Joined {joinedAgo(p.joinedAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-500">{p.tier}</p>
                <p className="mt-1 font-semibold tabular-nums text-zinc-800 dark:text-zinc-200">£{p.feeAmount}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
