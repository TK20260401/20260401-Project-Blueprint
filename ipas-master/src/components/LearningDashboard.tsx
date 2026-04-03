"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import RadarChartView from "./RadarChartView";
import { categoryToSystem } from "@/lib/categoryMapping";

type StatEntry = { category: string; correct: number; total: number; rate: number };

interface LocalStats {
  categoryResults: Map<string, { correct: number; total: number }>;
}

interface Props {
  localStats?: LocalStats;
}

export default function LearningDashboard({ localStats }: Props) {
  const { data: session } = useSession();
  const [userStats, setUserStats] = useState<StatEntry[]>([]);
  const [averages, setAverages] = useState<StatEntry[] | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setLoading(true);
      fetch("/api/history")
        .then((res) => res.json())
        .then((data) => {
          setUserStats(data.userStats ?? []);
          setAverages(data.averages);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [session]);

  // ゲスト: ローカルstatsから生成
  const displayStats = session?.user
    ? userStats
    : localStats
      ? Array.from(localStats.categoryResults.entries()).map(([category, { correct, total }]) => ({
          category,
          correct,
          total,
          rate: total > 0 ? Math.round((correct / total) * 100) : 0,
        }))
      : [];

  const totalAnswered = displayStats.reduce((sum, s) => sum + s.total, 0);
  const totalCorrect = displayStats.reduce((sum, s) => sum + s.correct, 0);
  const overallRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="space-y-5">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-800 text-center">
        学習履歴ダッシュボード
      </h2>

      {!session?.user && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
          <p className="text-sm text-amber-800 font-bold">
            ログインすると学習履歴が保存され、他のユーザーとの比較ができます
          </p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : totalAnswered === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg font-bold">まだ回答データがありません</p>
          <p className="text-sm mt-2">問題ドリルで学習を始めましょう</p>
        </div>
      ) : (
        <>
          {/* サマリー */}
          <div className="flex flex-wrap justify-center gap-3">
            <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-emerald-600 font-bold">回答数</p>
              <p className="text-2xl font-bold text-emerald-800">{totalAnswered}</p>
            </div>
            <div className="bg-blue-50 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-blue-600 font-bold">正答数</p>
              <p className="text-2xl font-bold text-blue-800">{totalCorrect}</p>
            </div>
            <div className="bg-amber-50 rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-amber-600 font-bold">正答率</p>
              <p className="text-2xl font-bold text-amber-800">{overallRate}%</p>
            </div>
          </div>

          {/* レーダーチャート */}
          <RadarChartView
            userStats={displayStats}
            averages={session?.user ? averages : undefined}
          />
        </>
      )}
    </div>
  );
}
