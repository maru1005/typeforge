// app/game/page.tsx
// ゲーム画面

"use client";

import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/game-store";
import { wordMap } from "@/lib/words";

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
    <div>
      <p>残り時間: {timeLeft}</p>
      <p>スコア: {score}</p>
      <div>
        {words.map((word, i) => (
          <p key={i}>{word}</p>
        ))}
      </div>
      {status === "playing" && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit">Enter</button>
        </form>
      )}

      {status === "gameover" && (
        <div>
          <h2>タイムアップ！</h2>
          <p>正解数: {correctCount}</p>
          <p>ミス数: {missCount}</p>
          <p>スコア: {score}</p>
          <button
            onClick={() => {
              reset();
              initGame();
            }}
          >
            Retry
          </button>
          <button
            onClick={() => {
              reset();
              router.push("/select");
            }}
          >
            Select Mode
          </button>
        </div>
      )}
    </div>
  );
}
