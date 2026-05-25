// app/conponents/category-select.tsx

"use client";

import { useState } from "react";
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

  const handleSelect = (category: Category) => {
    setCategory(category);
    setIsModalOpen(true);
  };

  const handleStart = () => {
    setIsModalOpen(false);
    router.push("/game");
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
    </div>
  );
}
