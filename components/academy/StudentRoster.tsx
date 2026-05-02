import { joinedAgo } from "@/lib/dates";
import type { StudentTier } from "@/lib/mockData";

export function StudentRoster({
  players,
}: {
  players: Array<{ id: string; name: string; joinedAt: string }>;
}) {
  if (players.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-14 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-500">
        No players in this squad yet — add recruits from onboarding.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-100 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-500">
            <th className="px-5 py-4">Player</th>
            <th className="px-5 py-4">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800/80 dark:bg-zinc-900/20">
          {players.map((p) => (
            <tr key={p.id} className="transition hover:bg-emerald-500/[0.06] dark:hover:bg-emerald-500/[0.04]">
              <td className="px-5 py-4 font-medium text-zinc-900 dark:text-zinc-100">{p.name}</td>
              <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">{joinedAgo(p.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function rosterTitleCopy(tier: StudentTier): { title: string; description: string } {
  const map = {
    new: {
      title: "New players",
      description: "Introduction squads focusing on fundamentals, movement, and match rules.",
    },
    intermediate: {
      title: "Intermediate players",
      description: "Tactical phases, positional play, and weekly internal games.",
    },
    professional: {
      title: "Professional pathway",
      description: "Elite conditioning, scouting exposure, and competition-first preparation.",
    },
  };
  return map[tier];
}
