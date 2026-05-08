"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/academy/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { announcements as seed } from "@/lib/mockData";
import type { Announcement } from "@/lib/mockData";
import { apiGet } from "@/lib/apiClient";
import { AnnouncementsView } from "./AnnouncementsView";

export function AnnouncementsScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [items, setItems] = useState<Announcement[]>(seed);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiGet<{ ok: boolean; announcements?: Announcement[] }>("/api/announcements");
        if (!mounted) return;
        if (data.ok && Array.isArray(data.announcements)) {
          setItems(data.announcements);
        }
      } catch {
        // keep seeded fallback
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Announcements"
        description={
          isAdmin
            ? "Keep families aligned on schedules, closures, trials, and kit drops."
            : "Latest news, closures, and reminders from XYZ Academy."
        }
      />
      <AnnouncementsView initial={items} showComposer={isAdmin} />
    </>
  );
}
