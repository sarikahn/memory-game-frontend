import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const EMOJIS = {
  Sports: ["⚽","🏀","🏈","⚾","🎾","🏐","🏉","🥏"]
};
const GRID_SIZE = 4;
const GREEN_COLORS = ["#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#388E3C", "#2E7D32", "#1B5E20"];

export default function Home() {
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const shuffleCards = () => {
    const selectedEmojis = EMOJIS.Sports.slice(0, (GRID_SIZE * GRID_SIZE) / 2);
    const doubled = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((val, index) => ({
        id: index,
        val,
        color: GREEN_COLORS[index % GREEN_COLORS.length]
      }));

    setCards(doubled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setTimerActive(false);
    setShowConfetti(false);
  };

  useEffect(() => {
    if (started) shuffleCards();
  }, [started]);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleClick = (id) => {
    if (flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped.map(i => cards[i].val);
      if (first === second) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }

    if (!timerActive) setTimerActive(true);
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      saveScore();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      alert(`🎉 Congratulations ${name || "Player"}! Your score is saved.`);
    }
  }, [matched]);

  const saveScore = async () => {
    try {
      const response = await fetch(
        "https://memory-game-backend-4.onrender.com/scores",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name || "Player",
            moves,
            time,
            difficulty: "easy",
            category: "Sports"
          })
        }
      );
      const data = await response.json();
      console.log("Score saved:", data);
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4 text-green-900">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">Memory Card Game</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 px-4 py-2 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 w-64 text-center"
        />
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-2 bg-green-400 text-white rounded-xl hover:bg-green-500 shadow-md transition-transform transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-4 flex flex-col items-center text-green-900">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">Memory Card Game</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button 
          onClick={shuffleCards} 
          className="px-5 py-2 bg-green-400 text-white rounded-xl hover:bg-green-500 shadow-md transition-transform transform hover:scale-105"
        >
          Restart 🔁
        </button>
      </div>

      <div className="mb-6 text-lg sm:text-xl md:text-2xl text-center">
        Player: <span className="font-semibold">{name || "Player"}</span> ⏱ Time: {time}s | 🎯 Moves: {moves}
      </div>

      <div className="grid gap-4 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(60px, 1fr))` }}>
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleClick(index)}
            className="relative w-full h-20 sm:h-24 md:h-28 perspective"
          >
            <div
              className={`absolute inset-0 rounded-2xl shadow-lg transition-transform duration-500 transform ${flipped.includes(index) || matched.includes(index) ? "rotate-y-180" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl backface-hidden cursor-pointer">
                ❓
              </div>
              <div
                className="absolute inset-0 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl md:text-5xl backface-hidden"
                style={{ backgroundColor: card.color, transform: "rotateY(180deg)" }}
              >
                {card.val}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => (window.location.href = "/leaderboard")}
          className="px-5 py-2 bg-green-300 rounded-xl hover:bg-green-400 shadow-md transition-transform transform hover:scale-105"
        >
          View Leaderboard
        </button>
      </div>

      <style>{`
        .perspective { perspective: 1000px; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}

