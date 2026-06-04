// app/select/page.tsx

import { createClient } from "@/lib/api/supabase/server";
import CategorySelect from "@/app/components/category-select";
import Ranking from "@/app/components/ranking";

export default async function SelectPage() {
  const supabase = await createClient();

  const { data: scores } = await supabase
    .from("scores")
    .select("id, score, correct_count, miss_count, created_at, user_id")
    .order("score", { ascending: false })
    .limit(10);

  const userIds = scores?.map((s) => s.user_id) ?? [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, user_id, username")
    .in("user_id", userIds);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">TypeForge</h1>
          <p className="text-slate-500 mt-1 text-sm">
            カテゴリを選んでスタート
          </p>
        </div>
        <CategorySelect />
        <Ranking scores={scores ?? []} profiles={profiles ?? []} />
      </div>
    </div>
  );
}
