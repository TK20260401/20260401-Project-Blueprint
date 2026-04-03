import { auth } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { questionId, category, isCorrect } = body;

  const supabase = createServerClient();
  const { error } = await supabase.from("learning_history").insert({
    user_id: session.user.id,
    question_id: questionId,
    category,
    is_correct: isCorrect,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  // ユーザーのカテゴリ別正答率
  const { data: userHistory } = await supabase
    .from("learning_history")
    .select("category, is_correct")
    .eq("user_id", session.user.id);

  const userStats = aggregateByCategory(userHistory ?? []);

  // 全ユーザー平均
  const { data: allHistory } = await supabase
    .from("learning_history")
    .select("category, is_correct");

  const averages = aggregateByCategory(allHistory ?? []);

  return NextResponse.json({ userStats, averages });
}

function aggregateByCategory(rows: { category: string; is_correct: boolean }[]) {
  const map = new Map<string, { correct: number; total: number }>();
  for (const row of rows) {
    const entry = map.get(row.category) ?? { correct: 0, total: 0 };
    entry.total++;
    if (row.is_correct) entry.correct++;
    map.set(row.category, entry);
  }
  return Array.from(map.entries()).map(([category, { correct, total }]) => ({
    category,
    correct,
    total,
    rate: total > 0 ? Math.round((correct / total) * 100) : 0,
  }));
}
