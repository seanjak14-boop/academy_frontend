"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Player {
  id: number;
  first_name: string;
  last_name: string;
}

export default function MatchStatsForm() {
  const params = useParams();
  const matchId = params.id; // Reads the match ID directly from the URL browser tab

  const [players, setPlayers] = useState<Player[]>([]);
  const [formStats, setFormStats] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Manually fetch your academy students when the page runs
  useEffect(() => {
    // Replace this URL with your actual frontend/backend listing path for players
    fetch("http://localhost:5000/api/players") 
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => console.error("Roster fetch error:", err));
  }, []);

  // 2. Capture changing text entries into the form state dictionary manually
  const handleInputChange = (playerId: number, field: string, value: string) => {
    setFormStats((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        playerId,
        [field]: value,
      },
    }));
  };

  // 3. Compile the local form values into a clean array and post it
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Convert our structural keyed states into a flat payload array
    const statsArray = Object.values(formStats);

    try {
      const response = await fetch(`http://localhost:5000/api/stats/match/${matchId}/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statsArray }),
      });

      if (!response.ok) throw new Error("API rejection");
      alert("Squad metrics updated safely in the database!");
    } catch (err) {
      console.error(err);
      alert("Error sending performance data.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8">Loading academy database values...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Match Record Entry (Match #{matchId})</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-xl border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-sm font-semibold text-gray-600">
              <th className="p-3">Player Roster</th>
              <th className="p-3">Goals Scored</th>
              <th className="p-3">Assists Given</th>
              <th className="p-3">Minutes Played</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b hover:bg-gray-50/50">
                <td className="p-3 font-medium text-gray-800">
                  {player.first_name} {player.last_name || ""}
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-20 border rounded-md p-1.5 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => handleInputChange(player.id, "goals", e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-20 border rounded-md p-1.5 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => handleInputChange(player.id, "assists", e.target.value)}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-24 border rounded-md p-1.5 text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => handleInputChange(player.id, "minutesPlayed", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {saving ? "Processing Bulk Entries..." : "Save Performance Metrics"}
          </button>
        </div>
      </form>
    </div>
  );
}