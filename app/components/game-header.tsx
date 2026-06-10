// app/components/game-header.tsx
// ゲーム画面スコア・タイム表示　猫タイマー

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [direction, setDirection] = useState(1); // 1=right
  const [catPosition, setCatPosition] = useState(40);
  const [pawPrints, setPawParints] = useState<number[]>([]);
  const catPos = status === "idle" ? 40 : catPosition;
  const prints = status === "idle" ? [] : pawPrints;

  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(() => {
      setCatPosition((prev) => {
        const next = prev + 70 * direction;
        if (next > 800) {
          setDirection(-1);
          setPawParints([]);
          return prev;
        }
        if (next < 0) {
          setDirection(1);
          setPawParints([]);
          return prev;
        }
        setPawParints((prints) => [...prints, prev]);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [status, direction]);

  return (
    <div className="space-y-6">
      {/* Exit 表示Time Score */}
      <div className="flex item-center justify-between">
        <button
          onClick={() => router.push("/select")}
          className="text-sm border boder-slate-300 rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          Exit
        </button>

        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Time</p>
            <div
              className={`border-2 rounded-xl px-6 py-2 text-xl font-bold ${timeLeft <= 10 ? "border-red-400 text-red-500" : "border-slate-300 text-slate-800"}`}
            >
              {timeLeft}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Score</p>
            <div className="border-2 border-slate-300 rounded-xl px-6 py-2 text-xl font-bold text-indigo-600">
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* 猫タイマー */}
      <div className="relative h-40 bg-slate-50 rounded-2xl overflow-hidden">
        {/* 足跡 */}
        {prints.map((pos, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 text-lg"
            style={{ left: `${pos}px` }}
          >
            🐾
          </div>
        ))}
        {/* 猫 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
          style={{
            left: `${catPos}px`,
            transform: direction === -1 ? "scaleX(-1)" : "none",
          }}
        >
          <Image
            src={
              status === "gameover"
                ? "/cats/cat-sleep.png"
                : "/cats/cat-jump.png"
            }
            alt="cat"
            width={150}
            height={150}
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
