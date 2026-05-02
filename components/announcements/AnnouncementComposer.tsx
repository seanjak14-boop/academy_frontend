"use client";

import { useState } from "react";
import type { Announcement } from "@/lib/mockData";

function isoNow() {
  return new Date().toISOString();
}

export function AnnouncementComposer({
  onPost,
}: {
  onPost: (a: Omit<Announcement, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<Announcement["priority"]>("normal");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onPost({
      title: title.trim(),
      body: body.trim(),
      date: isoNow(),
      priority,
    });
    setTitle("");
    setBody("");
    setPriority("normal");
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Post announcement</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        Preview only — posts stay in this browser tab until you add a backend or database.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="ann-title" className="sr-only">
            Title
          </label>
          <input
            id="ann-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
        </div>
        <div>
          <label htmlFor="ann-body" className="sr-only">
            Message
          </label>
          <textarea
            id="ann-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your announcement for players and parents..."
            rows={4}
            className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/25 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <fieldset className="flex gap-4 text-sm">
            <legend className="sr-only">Priority</legend>
            <label className="flex cursor-pointer items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <input
                type="radio"
                name="priority"
                checked={priority === "normal"}
                onChange={() => setPriority("normal")}
                className="accent-emerald-600 dark:accent-emerald-500"
              />
              Normal
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <input
                type="radio"
                name="priority"
                checked={priority === "high"}
                onChange={() => setPriority("high")}
                className="accent-emerald-600 dark:accent-emerald-500"
              />
              Highlight
            </label>
          </fieldset>
          <button
            type="submit"
            className="ml-auto rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
          >
            Publish (local)
          </button>
        </div>
      </form>
    </section>
  );
}
