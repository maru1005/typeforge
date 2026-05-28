// app/conponents/category-select.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { useGameStore } from "@/store/game-store";

const categories: { label: string; value: Category }[] = [
  { label: "Random", value: "random" },
  { label: "React", value: "react" },
  { label: "Go", value: "go" },
  { label: "Python", value: "python" },
  { label: "CSS", value: "css" },
  { label: "Linux", value: "linux" },
  { label: "CS", value: "cs" },
  { label: "Tailwind", value: "tailwind" },
];

export default function CategorySelect() {
  const router = useRouter();
  const setCategory = useGameStore((state) => state.setCategory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      router.push("/game");
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((c) => c! - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleSelect = (category: Category) => {
    setCategory(category);
    setIsModalOpen(true);
  };

  const handleStart = () => {
    setIsModalOpen(false);
    setCountdown(3);
  };

  return (
    <div>
      {categories.map((cat) => (
        <button key={cat.value} onClick={() => handleSelect(cat.value)}>
          {cat.label}
        </button>
      ))}

      {isModalOpen && (
        <div>
          <p>ルール説明</p>
          <button onClick={handleStart}>Start</button>
        </div>
      )}
      {countdown !== null && (
        <div>
          <p>{countdown}</p>
        </div>
      )}
    </div>
  );
}
