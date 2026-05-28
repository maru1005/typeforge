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

export async function POST(request: Request) {
    const supabase =await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, correct_count, miss_count } = await request.json();

    const { error } = await supabase.from("scores").insert({
        user_id: user.id,
        score,
        correct_count,
        miss_count,
    });

    if (error) {
        return NextResponse.json({ error:error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}