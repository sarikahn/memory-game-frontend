import React from "react";

export default function Card({ card, index, flipped, matched, handleClick }) {
  const isFlipped = flipped.includes(index) || matched.includes(index);

  return (
    <div
      onClick={() => handleClick(index)}
      className={`h-24 w-24 flex items-center justify-center text-4xl bg-white rounded-lg shadow-lg cursor-pointer transform transition duration-300
        ${isFlipped ? "bg-green-100 scale-105" : "bg-white"}`}
    >
      {isFlipped ? card.emoji : "❓"}
    </div>
  );
}













