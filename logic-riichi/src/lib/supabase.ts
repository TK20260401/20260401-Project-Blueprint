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

// スコア保存（ログイン中ならuser_idも付与）
export async function saveScore(params: {
  difficulty: string;
  quizType: "tile" | "algorithm";
  isCorrect: boolean;
  timeLeft?: number;
}) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from("scores").insert({
    difficulty: params.difficulty,
    quiz_type: params.quizType,
    is_correct: params.isCorrect,
    time_left: params.timeLeft ?? null,
    session_id: getSessionId(),
    user_id: user?.id ?? null,
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

// === 訪問者カウント ===

/** 訪問を記録（1ブラウザにつき1日1回） */
export async function recordVisit() {
  if (!supabase) return;
  if (typeof window === "undefined") return;

  const today = new Date().toISOString().slice(0, 10);
  const key = `logic-riichi-visited-${today}`;
  if (sessionStorage.getItem(key)) return; // 今日はもう記録済み

  let visitorId = localStorage.getItem("logic-riichi-visitor-id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("logic-riichi-visitor-id", visitorId);
  }

  await supabase.from("visitors").insert({ visitor_id: visitorId });
  sessionStorage.setItem(key, "1");
}

/** 訪問者数を取得 */
export async function getVisitorCounts(): Promise<{ today: number; total: number }> {
  if (!supabase) return { today: 0, total: 0 };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalRes, todayRes] = await Promise.all([
    supabase.from("visitors").select("id", { count: "exact", head: true }),
    supabase.from("visitors").select("id", { count: "exact", head: true })
      .gte("visited_at", todayStart.toISOString()),
  ]);

  return {
    today: todayRes.count ?? 0,
    total: totalRes.count ?? 0,
  };
}

// === ユーザー別学習統計（ログインユーザー用） ===

export interface UserStats {
  total: number;
  correct: number;
  rate: number;
  tile: { total: number; correct: number; easy: number; medium: number; hard: number };
  algorithm: { total: number; correct: number; easy: number; medium: number; hard: number };
  percentile: number; // 全ユーザー中の相対位置（上位何%）
  history: { date: string; correct: number; total: number }[];
}

/** ログインユーザーの全履歴統計を取得 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  if (!supabase) return null;

  // 自分の全スコア
  const { data: myScores, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !myScores) return null;

  const total = myScores.length;
  const correct = myScores.filter((d) => d.is_correct).length;
  const myRate = total > 0 ? Math.round((correct / total) * 100) : 0;

  // タイプ×難易度別集計
  const calcSub = (type: string) => {
    const filtered = myScores.filter((d) => d.quiz_type === type);
    const byDiff = (diff: string) => filtered.filter((d) => d.difficulty === diff && d.is_correct).length;
    return {
      total: filtered.length,
      correct: filtered.filter((d) => d.is_correct).length,
      easy: byDiff("easy"),
      medium: byDiff("medium"),
      hard: byDiff("hard"),
    };
  };

  // 日別集計（直近30日）
  const dayMap: Record<string, { correct: number; total: number }> = {};
  for (const s of myScores) {
    const d = s.created_at.slice(0, 10);
    if (!dayMap[d]) dayMap[d] = { correct: 0, total: 0 };
    dayMap[d].total++;
    if (s.is_correct) dayMap[d].correct++;
  }
  const history = Object.entries(dayMap)
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  // 他ユーザーとの相対位置（全ユーザーの正答率を取得）
  const { data: allUsers } = await supabase
    .from("scores")
    .select("user_id, is_correct")
    .not("user_id", "is", null);

  let percentile = 100;
  if (allUsers && allUsers.length > 0) {
    const userRates: Record<string, { c: number; t: number }> = {};
    for (const s of allUsers) {
      const uid = s.user_id as string;
      if (!userRates[uid]) userRates[uid] = { c: 0, t: 0 };
      userRates[uid].t++;
      if (s.is_correct) userRates[uid].c++;
    }
    const rates = Object.values(userRates).map((v) => (v.t > 0 ? (v.c / v.t) * 100 : 0));
    const belowMe = rates.filter((r) => r < myRate).length;
    percentile = rates.length > 0 ? Math.round((belowMe / rates.length) * 100) : 50;
  }

  return {
    total,
    correct,
    rate: myRate,
    tile: calcSub("tile"),
    algorithm: calcSub("algorithm"),
    percentile,
    history,
  };
}
