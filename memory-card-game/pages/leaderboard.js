import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch("https://memory-game-backend-4.onrender.com/scores")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.moves - b.moves);
        setScores(sorted);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        Leaderboard
      </h1>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-200 text-left">
              <th className="border px-4 py-2">Rank</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Moves</th>
            </tr>
          </thead>

          <tbody>
            {scores.map((score, index) => (
              <tr key={score._id} className="odd:bg-white even:bg-gray-100">
                <td className="border px-4 py-2">
                  {index < 3 ? medals[index] : index + 1}
                </td>

                <td className="border px-4 py-2">{score.name}</td>
                <td className="border px-4 py-2">{score.moves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="px-5 py-2 bg-green-400 text-white rounded shadow"
        >
          Back to Game
        </button>
      </div>
    </div>
  );
}
