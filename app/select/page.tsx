// app/select/page.tsx

import { createClient } from "@/lib/api/supabase/server";
import CategorySelect from "@/app/components/category-select";

export default async function SelectPage() {
  const supabase = await createClient();

  const { data: scores } = await supabase
    .from("scores")
    .select(
      "id, score, correct_count, miss_count, created_at, profiles(username)",
    )
    .order("score", { ascending: false })
    .limit(10);

  return (
    <div>
      <CategorySelect />
      <div>
        {scores?.map((score) => (
          <div key={score.id}>
            {/* @ts-ignore */}
            <p>{score.profiles?.username}</p>
            <p>{score.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
