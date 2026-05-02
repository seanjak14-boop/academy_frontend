"use client";

import { PageHeader } from "@/components/academy/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { announcements as seed } from "@/lib/mockData";
import { AnnouncementsView } from "./AnnouncementsView";

export function AnnouncementsScreen() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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
      <AnnouncementsView initial={seed} showComposer={isAdmin} />
    </>
  );
}
