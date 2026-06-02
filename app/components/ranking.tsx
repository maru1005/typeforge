// app/components/ranking.tsx

import { Score, Profile } from "@/types";

type RankingProps = {
  scores: Score[];
  profiles: Profile[];
};

export default function Ranking({ scores, profiles }: RankingProps) {
  return (
    <div className="bg-white ronded-2xl border border-slate-100 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">👑Ranking</h2>
      {scores.length > 0 ? (
        <div className="space-y-2">
          {scores.map((score, index) => {
            const profile = profiles.find((p) => p.user_id === score.user_id);
            return (
              <div
                key={score.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="fles items-center gap-3">
                  <span className="text-sm font-bold text-slate-400 w-6">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {profile?.username ?? "匿名"}
                  </span>
                </div>
                <span className="text-sm font-bold text-indigo-600">
                  {score.score}pt
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center">
          まだスコアがありません
        </p>
      )}
    </div>
  );
}
