// app/game/page.tsx
// ゲーム画面

"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/game-store";
import { wordMap } from "@/lib/words";
import GameHeader from "@/app/components/game-header";
import WordList from "@/app/components/word-list";

export default function GamePage() {
  const router = useRouter();
  const {
    category,
    words,
    timeLeft,
    score,
    status,
    setWords,
    startGame,
    endGame,
    tick,
    addCorrect,
    addMiss,
    correctCount,
    missCount,
    reset,
  } = useGameStore((state) => state);

  const [input, setInput] = useState("");
  const [gameKey, setGameKey] = useState(0);

  // 初期化処理
  const initGame = () => {
    if (!category) {
      router.push("/select");
      return;
    }
    const allWords = wordMap[category];
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 1));
    startGame();
  };

  // マウント時にinitGameを実行
  useEffect(() => {
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // タイマー
  useEffect(() => {
    if (status !== "playing") return;
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [status, tick]);

  // タイムアップ
  useEffect(() => {
    if (timeLeft <= 0 && status === "playing") {
      endGame();

      const saveScore = async () => {
        await fetch("/api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score,
            correct_count: correctCount,
            miss_count: missCount,
            category,
          }),
        });
      };

      saveScore();
    }
  }, [status, endGame, timeLeft, score, correctCount, missCount, category]);

  // 入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const target = words[0];

    if (!target.startsWith(value)) {
      addMiss();
      return;
    }

    setInput(value);

    if (value === target) {
      addCorrect();
      const allWords = wordMap[category!];
      const remaining = allWords.filter((word) => !words.includes(word));
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      setWords(next ? [next] : []);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <GameHeader
          key={gameKey}
          timeLeft={timeLeft}
          score={score}
          status={status}
        />

        <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 text-center space-y-6 max-w-2xl mx-auto">
          <WordList words={words} />
          <div className="flex items-center gap-2 max-w-md mx-auto border-b-2 border-slate-300 pb-2">
            <span>✏️</span>
            {status === "playing" && (
              <input
                type="text"
                value={input}
                onChange={handleChange}
                autoFocus
                className="w-full max-w-lg px-4 py-3 font-mono text-sm text-center bg-transparent focus:outline-none"
                placeholder=""
              />
            )}
          </div>
        </div>

        {status === "gameover" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 space-y-4">
              <h2 className=" text-xl font-bold text-slate-800 text-center">
                Time Up!
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">正解数</span>
                  <span className="text-sm font-bold text-slate-800">
                    {correctCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">ミス数</span>
                  <span className="text-sm font-bold text-slate-800">
                    {missCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">スコア</span>
                  <span className="text-sm font-bold text-slate-800">
                    {score}pt
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    reset();
                    setInput("");
                    setGameKey((k) => k + 1);
                    initGame();
                  }}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => {
                    reset();
                    router.push("/select");
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
