// app/api/scores/route.ts

import { createClient } from "@/lib/api/supabase/server";
import  { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    const { data, error } = await supabase
    .from("scores")
    .select("id, score, correct_count, miss_count, created_at, profiles(username)")
    .order("score", { ascending: false })
    .limit(10);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}