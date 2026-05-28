// app/select/page.tsx

import { createClient } from "@/lib/api/supabase/server";
import CategorySelect from "@/app/components/category-select";

export default async function SelectPage() {
  const supabase = await createClient();

  const { data: scores, error } = await supabase
    .from("scores")
    .select("id, score, correct_count, miss_count, created_at, user_id")
    .order("score", { ascending: false })
    .limit(10);

  const userIds = scores?.map((s) => s.user_id) ?? [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, username")
    .in("user_id", userIds);

  return (
    <div>
      <CategorySelect />
      <div>
        {scores?.map((score) => {
          const profile = profiles?.find((p) => p.user_id === score.user_id);
          return (
            <div key={score.id}>
              <p>{profile?.username}</p>
              <p>{score.score}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
