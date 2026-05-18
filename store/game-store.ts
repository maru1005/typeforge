// store/game-store.ts

import { create } from "zustand";
import { Category } from "@/types"

type GameState = {
    //状態
    timeLeft: number //残り時間
    score: number //スコア
    correctCount: number //正解数
    missCount: number //ミス数
    words: string[] //表示中単語
    status: "idle" | "playing" | "gameover" //ゲーム状態
    category: Category | null //
    // アクション
    setCategory: (category: Category) => void
    setWords: (words: string[]) => void
    addCorrect: () => void // 正解時
    addMiss: () => void // ミス時
    tick: () => void // 1秒ごとに呼ばれる
    startGame: () => void
    endGame: () => void
    reset: () => void
}

export const useGameStore = create<GameState>((set) => ({
    // 初期値
    timeLeft: 30,
    score: 0,
    correctCount: 0,
    missCount: 0,
    words: [],
    status: "idle",
    category: null,
    // アクション
    setCategory: (category) => set({ category }),
    setWords: (words) => set({ words }),

    addCorrect: () =>
        set((state) => ({
            score: state.score + 10,
            timeLeft: state.timeLeft + 2,
            correctCount: state.correctCount + 1,
        })),

    addMiss: () =>
        set((state) => ({
            score: Math.max(0, state.score - 1),
            timeLeft: state.timeLeft - 1,
            missCount: state.missCount + 1,
        })),
    
    tick: () =>
        set((state) => ({
            timeLeft: state.timeLeft - 1,
        })),

    startGame: () => set({ status: "playing" }),
    endGame: () => set({ status: "gameover" }),

    reset: () =>
        set({
            timeLeft: 30,
            score: 0,
            correctCount: 0,
            missCount: 0,
            words: [],
            status: "idle",
        }),
}));