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

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (words.includes(input)) {
      addCorrect();

      const newWords = words.filter((word) => word !== input);

      const allWords = wordMap[category!];
      const remaining = allWords.filter((word) => !words.includes(word));
      const next = remaining[Math.floor(Math.random() * remaining.length)];

      if (next) {
        setWords([...newWords, next]);
      } else {
        setWords(newWords);
      }
    } else {
      addMiss();
    }
    setInput("");
  };

  // 初期化処理
  const initGame = () => {
    if (!category) {
      router.push("/select");
      return;
    }
    const allWords = wordMap[category];
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    setWords(shuffled.slice(0, 5));
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
        await fetch("api/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score,
            correct_count: correctCount,
            miss_count: missCount,
          }),
        });
      };

      saveScore();
    }
  }, [status, endGame, timeLeft, score, correctCount, missCount]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-aout px-4 py-8 space-y-6">
        <GameHeader timeLeft={timeLeft} score={score} />
        <WordList words={words} />

        {status === "playing" && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 focus:outLin-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              placeholder="単語を入力..."
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-sl font-bold hover:bg-indigo-700 transitioni-colors"
            >
              Enter
            </button>
          </form>
        )}

        {status === "gameover" && (
          <div className="fixed iset-0 bg-blac/50 flex items-center justify-center z-50">
            <div className="bg-white ronded-2xl p-8 max-w-sm w-full mx-4 space-y-4">
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
                    initGame();
                  }}
                  className="flex-1 bg-indigo-600 textwhite py-3 rounded-xl font bold hover:bgindigo-700 tarasition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => {
                    reset();
                    router.push("/select");
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 taransition-colors"
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
