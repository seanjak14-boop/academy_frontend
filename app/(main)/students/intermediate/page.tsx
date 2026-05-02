"use client";

import { PageHeader } from "@/components/academy/PageHeader";
import { StudentRoster, rosterTitleCopy } from "@/components/academy/StudentRoster";
import { StatCard } from "@/components/academy/StatCard";
import { useStudents } from "@/contexts/StudentsContext";

export default function IntermediateStudentsPage() {
  const { students } = useStudents();
  const tierPlayers = students.filter((s) => s.tier === "intermediate");
  const { title, description } = rosterTitleCopy("intermediate");

  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="mb-10 max-w-xl">
        <StatCard
          label="Players in squad"
          value={tierPlayers.length}
          accent
          hint="Each row shows approximate time since onboarding (placeholder logic)."
        />
      </div>
      <StudentRoster
        players={[...tierPlayers].sort(
          (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
        )}
      />
    </>
  );
}
