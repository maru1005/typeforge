// app/components/ranking.tsx

import { Score, Profile } from "@/types";

type RankingProps = {
  scores: Score[];
  profiles: Profile[];
};

export default function Ranking({ scores, profiles }: RankingProps) {
  return (
    <div className="bg-slate ronded-2xl p-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4">👑Ranking</h2>
      {scores.length > 0 ? (
        <div className="space-y-2">
          {scores.map((item, index) => {
            const profile = profiles.find((p) => p.user_id === item.user_id);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-400 w-8 text-right">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-700">
                    {profile?.username ?? "匿名"}
                  </span>
                  {item.category && (
                    <span className="text-xs text-slate-400 ml-2">
                      {item.category}
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-indigo-600">
                  {item.score}pt
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
