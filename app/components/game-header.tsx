// app/components/game-header.tsx

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type GameHeaderProps = {
  timeLeft: number;
  score: number;
  status: string;
};

export default function GamaeHeader({
  timeLeft,
  score,
  status,
}: GameHeaderProps) {
  const [catPosition, setCatPosition] = useState(0);

  useEffect(() => {
    console.log("status", status);
    if (status !== "playing") return;
    console.log("interval starat");
    const interval = setInterval(() => {
      console.log("tick");
      setCatPosition((prev) => prev + 40);
    }, 3000);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Time</span>
          <span
            className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-500" : "text-slate-800"}`}
          >
            {timeLeft}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Score</span>
          <span className="text-2xl font-bold text-indigo-600">{score}</span>
        </div>
      </div>

      <div className="relative h-16 bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div
          className="absolute top-1/2 -translate-y-1/2 transitioin-all duratioin-500"
          style={{ left: `${catPosition}px` }}
        >
          <Image
            src={
              status === "gameover"
                ? "/cats/cat-sleep.png"
                : "/cats/cat-jump.png"
            }
            alt="cat"
            width={48}
            height={48}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
