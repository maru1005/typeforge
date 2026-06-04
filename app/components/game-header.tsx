// app/components/game-header.tsx

type GameHeaderProps = {
  timeLeft: number;
  score: number;
};

export default function GamaeHeader({ timeLeft, score }: GameHeaderProps) {
  return (
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
  );
}
