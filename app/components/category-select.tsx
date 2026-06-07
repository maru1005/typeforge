// app/conponents/category-select.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { useGameStore } from "@/store/game-store";
import { createClient } from "@/lib/api/supabase/client";
import Image from "next/image";

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
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div>
      <div className="relative flex flex-col gap-2">
        {hoverIndex !== null && (
          <div
            className="absolute -right-16 transition-all duration-300"
            style={{ top: `${hoverIndex * 52}px` }}
          >
            <Image
              src="/cats/cat-hightouch.png"
              alt="cat"
              width={60}
              height={60}
              unoptimized
            />
          </div>
        )}

        {categories.map((cat, i) => (
          <button
            key={cat.value}
            onClick={() => handleSelect(cat.value)}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            className="bg-white border border-slate-200 rounded-xl px-6 py-3 text-sm font-bold text-slate-700 hover:bg-teal-50 hover:border-teal-300 transition-colors"
          >
            {cat.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 text-xs text-slate-400 hover:text-slate-600"
      >
        ログアウト
      </button>

      {/* カウントダウン */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="text-white text-8xl font-bold">
            {countdown === 0 ? "GO!" : countdown}
          </div>
        </div>
      )}

      {/* スタートモーダル */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="text-sm text-slate-600 space-y-2">
              <li>⏰ 初期時間：30秒</li>
              <li>✅ 正解：+2秒 / +10pt</li>
              <li>❌ ミス：-1秒 / -1pt</li>
              <li>📝 単語3つ同時表示</li>
            </ul>
            <button
              onClick={handleStart}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
