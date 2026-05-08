"use client";

import { useEffect, useMemo, useState } from "react";
import type { Announcement } from "@/lib/mockData";
import { AnnouncementComposer } from "@/components/announcements/AnnouncementComposer";
import { formatAnnouncementDate } from "@/lib/dates";
import { apiPost } from "@/lib/apiClient";

let nextId = 1000;

export function AnnouncementsView({
  initial,
  showComposer,
}: {
  initial: Announcement[];
  showComposer: boolean;
}) {
  const [items, setItems] = useState(initial);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [items],
  );

  async function addPost(payload: Omit<Announcement, "id">) {
    try {
      const data = await apiPost<{ ok: boolean; announcement?: Announcement; message?: string }>(
        "/api/announcements",
        payload,
      );
      if (data.ok && data.announcement) {
        const created = data.announcement;
        setItems((prev) => [created, ...prev]);
        return;
      }
    } catch {
      // fallback below
    }

    setItems((prev) => [{ id: `local-${nextId++}`, ...payload }, ...prev]);
  }

  return (
    <div
      className={`grid gap-10 lg:gap-14 ${showComposer ? "lg:grid-cols-[1fr,minmax(0,420px)]" : "max-w-3xl"}`}
    >
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Bulletin board</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
          {showComposer
            ? "Visible to players & parents — chronological feed."
            : "Official updates from XYZ Academy staff."}
        </p>
        <ul className="mt-10 space-y-6">
          {sorted.map((a) => (
            <li
              key={a.id}
              className={`rounded-2xl border px-6 py-5 ${
                a.priority === "high"
                  ? "border-emerald-500/35 bg-emerald-50 dark:bg-emerald-500/[0.06]"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{a.title}</h3>
                {a.priority === "high" ? (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                    Highlighted
                  </span>
                ) : null}
              </div>
              <time className="mt-3 block text-xs text-zinc-500 dark:text-zinc-500" dateTime={a.date}>
                {formatAnnouncementDate(a.date)}
              </time>
              <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{a.body}</p>
            </li>
          ))}
        </ul>
      </div>

      {showComposer ? (
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnnouncementComposer onPost={(payload) => void addPost(payload)} />
        </div>
      ) : null}
    </div>
  );
}
