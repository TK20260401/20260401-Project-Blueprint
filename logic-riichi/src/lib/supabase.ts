import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// ビルド時（SSG）は環境変数が空の場合がある。ランタイムでのみ接続する。
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

// ブラウザセッションID（タブごとに一意）
let sessionId: string | null = null;

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  if (!sessionId) {
    sessionId = sessionStorage.getItem("logic-riichi-session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("logic-riichi-session", sessionId);
    }
  }
  return sessionId;
}

// スコア保存
export async function saveScore(params: {
  difficulty: string;
  quizType: "tile" | "algorithm";
  isCorrect: boolean;
  timeLeft?: number;
}) {
  if (!supabase) return;
  const { error } = await supabase.from("scores").insert({
    difficulty: params.difficulty,
    quiz_type: params.quizType,
    is_correct: params.isCorrect,
    time_left: params.timeLeft ?? null,
    session_id: getSessionId(),
  });
  if (error) console.error("Score save error:", error);
}

// セッションの得点集計を取得
export async function getSessionStats() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("session_id", getSessionId())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Stats fetch error:", error);
    return null;
  }

  const total = data.length;
  const correct = data.filter((d) => d.is_correct).length;
  const byType = {
    tile: data.filter((d) => d.quiz_type === "tile"),
    algorithm: data.filter((d) => d.quiz_type === "algorithm"),
  };

  return {
    total,
    correct,
    rate: total > 0 ? Math.round((correct / total) * 100) : 0,
    tile: {
      total: byType.tile.length,
      correct: byType.tile.filter((d) => d.is_correct).length,
    },
    algorithm: {
      total: byType.algorithm.length,
      correct: byType.algorithm.filter((d) => d.is_correct).length,
    },
    history: data,
  };
}
