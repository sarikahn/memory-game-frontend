import React, { useState, useEffect } from "react";
import Card from "./Card";
import Score from "./Score";
import { Link, useNavigate } from "react-router-dom";

const EMOJIS = ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"];

export default function GameBoard() {
  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const navigate = useNavigate();

  const shuffleCards = () => {
    const doubled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(doubled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setTimerActive(false);
  };

  useEffect(() => {
    if (nameSubmitted) shuffleCards();
  }, [nameSubmitted]);

  useEffect(() => {
    let interval;
    if (timerActive) interval = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleClick = (id) => {
    if (flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
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
      alert(`🎉 You won! Moves: ${moves}, Time: ${time}s`);
      saveScore();
    }
  }, [matched]);

  const saveScore = async () => {
    try {
      await fetch("https://memory-game-backend-4.onrender.com/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName, moves, time }),
      });
      navigate("/leaderboard");
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

  if (!nameSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Animal Memory Game</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={e => setPlayerName(e.target.value)}
          className="px-4 py-2 border rounded-lg mb-4 text-lg"
        />
        <button
          onClick={() => playerName.trim() && setNameSubmitted(true)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Animal Memory Game</h1>

      <Score playerName={playerName} moves={moves} time={time} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            flipped={flipped}
            matched={matched}
            handleClick={handleClick}
          />
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={shuffleCards} className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
          Restart Game
        </button>
        <Link to="/leaderboard" className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600">
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}
