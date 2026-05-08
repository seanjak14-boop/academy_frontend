"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/academy/PageHeader";
import { StatCard } from "@/components/academy/StatCard";
import { joinedAgo } from "@/lib/dates";
import type { Student } from "@/lib/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useStudents } from "@/contexts/StudentsContext";
import { apiGet, apiPost } from "@/lib/apiClient";

export default function FeesPage() {
  const { students } = useStudents();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [myInvoices, setMyInvoices] = useState<
    Array<{ id: number; status: string; amount: string | number; period_start: string; paid_at?: string | null }>
  >([]);

  const isAdmin = user?.role === "admin";
  const paid = students.filter((s) => s.feeStatus === "paid");
  const pending = students.filter((s) => s.feeStatus === "pending");
  const outstanding = pending.reduce((sum, p) => sum + p.feeAmount, 0);
  const n = students.length;
  const rate = n ? Math.round((paid.length / n) * 100) : 0;
  const firstPendingId = useMemo(() => (pending.length > 0 ? Number(pending[0].id) : null), [pending]);

  async function generateMonthlyInvoices() {
    setLoading(true);
    setMessage("");
    try {
      const data = await apiPost<{ ok: boolean; createdCount: number; scannedPlayers: number }>(
        "/api/finance/invoices/generate-monthly",
        {},
      );
      setMessage(`Generated ${data.createdCount} invoices after scanning ${data.scannedPlayers} players.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to generate invoices.");
    } finally {
      setLoading(false);
    }
  }

  async function markOneInvoicePaid() {
    if (!firstPendingId) {
      setMessage("No pending student in this list to map quickly. Use backend invoice id from admin panel API.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await apiPost("/api/finance/invoices/mark-paid", { invoiceId: firstPendingId });
      setMessage(`Invoice ${firstPendingId} marked paid.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to mark paid.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMyPaymentHistory() {
    setLoading(true);
    setMessage("");
    try {
      const data = await apiGet<{
        ok: boolean;
        data?: {
          paymentHistory?: Array<{
            id: number;
            status: string;
            amount: string | number;
            period_start: string;
            paid_at?: string | null;
          }>;
        };
      }>("/api/auth/my-data");
      setMyInvoices(data.data?.paymentHistory || []);
      setMessage("Loaded your payment history.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load your payment history.");
    } finally {
      setLoading(false);
    }
  }

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

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Backend billing actions</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          These buttons are wired to your new backend billing APIs.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => void generateMonthlyInvoices()}
                disabled={loading}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Generate monthly invoices
              </button>
              <button
                onClick={() => void markOneInvoicePaid()}
                disabled={loading}
                className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100 disabled:opacity-60"
              >
                Mark one invoice paid
              </button>
            </>
          ) : (
            <button
              onClick={() => void loadMyPaymentHistory()}
              disabled={loading}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Load my payment history
            </button>
          )}
        </div>
        {message ? <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{message}</p> : null}
        {!isAdmin && myInvoices.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm">
            {myInvoices.map((inv) => (
              <li key={inv.id} className="rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800/60">
                Invoice #{inv.id} • {inv.status} • £{Number(inv.amount)} • {new Date(inv.period_start).toDateString()}
              </li>
            ))}
          </ul>
        ) : null}
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
