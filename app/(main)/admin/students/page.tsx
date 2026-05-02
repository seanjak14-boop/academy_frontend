"use client";

import { useState } from "react";
import { PageHeader } from "@/components/academy/PageHeader";
import { joinedAgo } from "@/lib/dates";
import type { StudentTier } from "@/lib/mockData";
import { useStudents } from "@/contexts/StudentsContext";

export default function AdminStudentsPage() {
  const { students, addStudent, removeStudent } = useStudents();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tier, setTier] = useState<StudentTier>("new");
  const [feeAmount, setFeeAmount] = useState("120");
  const [feeStatus, setFeeStatus] = useState<"paid" | "pending">("pending");
  const [presentToday, setPresentToday] = useState(false);

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) return;
    const amount = Number(feeAmount);
    addStudent({
      name: `${fn} ${ln}`,
      tier,
      presentToday,
      feeStatus,
      feeAmount: Number.isFinite(amount) && amount >= 0 ? amount : 0,
    });
    setFirstName("");
    setLastName("");
  }

  return (
    <>
      <PageHeader
        title="Manage players"
        description="Add or remove academy players for this demo. Changes persist in this browser (localStorage) until cleared."
      />

      <section className="mb-12 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Add student</h2>
        <form onSubmit={onAdd} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              First name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Last name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as StudentTier)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="new">New</option>
              <option value="intermediate">Intermediate</option>
              <option value="professional">Professional</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Fee (£)
            </label>
            <input
              type="number"
              min={0}
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Fee status
            </label>
            <select
              value={feeStatus}
              onChange={(e) => setFeeStatus(e.target.value as "paid" | "pending")}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={presentToday}
                onChange={(e) => setPresentToday(e.target.checked)}
                className="accent-emerald-600"
              />
              Present today
            </label>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Add to roster
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Current roster</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">{students.length} players</p>
        </div>
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {students.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{s.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {s.tier} · Joined {joinedAgo(s.joinedAt)} · {s.feeStatus} · £{s.feeAmount}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeStudent(s.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
