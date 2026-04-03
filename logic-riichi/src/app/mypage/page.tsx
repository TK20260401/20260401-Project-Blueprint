"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { signOut } from "@/lib/auth";
import { getUserStats, type UserStats } from "@/lib/supabase";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function MyPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserStats(user.id).then((s) => {
        setStats(s);
        setStatsLoading(false);
      });
    } else {
      setStatsLoading(false);
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-lg font-bold">
          <ruby>読<rp>(</rp><rt>よ</rt><rp>)</rp></ruby>み<ruby>込<rp>(</rp><rt>こ</rt><rp>)</rp></ruby>み<ruby>中<rp>(</rp><rt>ちゅう</rt><rp>)</rp></ruby>...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full">
          <p className="text-gray-700 font-bold mb-4">ログインが<ruby>必要<rp>(</rp><rt>ひつよう</rt><rp>)</rp></ruby>です</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all"
          >
            ログインページへ
          </a>
        </div>
      </div>
    );
  }

  // レーダーチャート用データ
  const radarData = stats
    ? [
        { subject: "待ち牌(Easy)", value: stats.tile.easy, fullMark: Math.max(stats.tile.total, 1) },
        { subject: "待ち牌(Med)", value: stats.tile.medium, fullMark: Math.max(stats.tile.total, 1) },
        { subject: "待ち牌(Hard)", value: stats.tile.hard, fullMark: Math.max(stats.tile.total, 1) },
        { subject: "Algo(Easy)", value: stats.algorithm.easy, fullMark: Math.max(stats.algorithm.total, 1) },
        { subject: "Algo(Med)", value: stats.algorithm.medium, fullMark: Math.max(stats.algorithm.total, 1) },
        { subject: "Algo(Hard)", value: stats.algorithm.hard, fullMark: Math.max(stats.algorithm.total, 1) },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* ヘッダー */}
        <div className="text-center">
          <a href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-white">LogicRiichi</h1>
          </a>
        </div>

        {/* プロフィールカード */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
          <div className="text-center mb-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-base font-bold text-gray-800">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              <ruby>登録日<rp>(</rp><rt>とうろくび</rt><rp>)</rp></ruby>: {new Date(user.created_at).toLocaleDateString("ja-JP")}
            </p>
          </div>

          {statsLoading ? (
            <div className="text-center text-gray-400 py-8">
              <ruby>統計<rp>(</rp><rt>とうけい</rt><rp>)</rp></ruby>を<ruby>読<rp>(</rp><rt>よ</rt><rp>)</rp></ruby>み<ruby>込<rp>(</rp><rt>こ</rt><rp>)</rp></ruby>み<ruby>中<rp>(</rp><rt>ちゅう</rt><rp>)</rp></ruby>...
            </div>
          ) : !stats || stats.total === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 font-bold mb-2">まだ<ruby>学習<rp>(</rp><rt>がくしゅう</rt><rp>)</rp></ruby><ruby>記録<rp>(</rp><rt>きろく</rt><rp>)</rp></ruby>がありません</p>
              <p className="text-gray-400 text-sm">ログイン<ruby>状態<rp>(</rp><rt>じょうたい</rt><rp>)</rp></ruby>でクイズに<ruby>回答<rp>(</rp><rt>かいとう</rt><rp>)</rp></ruby>すると、ここに<ruby>履歴<rp>(</rp><rt>りれき</rt><rp>)</rp></ruby>が<ruby>表示<rp>(</rp><rt>ひょうじ</rt><rp>)</rp></ruby>されます</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 総合スコア */}
              <div>
                <h2 className="text-sm font-bold text-gray-500 mb-2">
                  <ruby>総合<rp>(</rp><rt>そうごう</rt><rp>)</rp></ruby>スコア
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-indigo-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-700">{stats.total}</div>
                    <div className="text-xs text-indigo-500 font-bold">
                      <ruby>回答数<rp>(</rp><rt>かいとうすう</rt><rp>)</rp></ruby>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-700">{stats.correct}</div>
                    <div className="text-xs text-green-500 font-bold">
                      <ruby>正解数<rp>(</rp><rt>せいかいすう</rt><rp>)</rp></ruby>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-amber-700">{stats.rate}%</div>
                    <div className="text-xs text-amber-500 font-bold">
                      <ruby>正答率<rp>(</rp><rt>せいとうりつ</rt><rp>)</rp></ruby>
                    </div>
                  </div>
                </div>
              </div>

              {/* 相対位置 */}
              <div>
                <h2 className="text-sm font-bold text-gray-500 mb-2">
                  <ruby>他<rp>(</rp><rt>ほか</rt><rp>)</rp></ruby>のユーザーとの<ruby>比較<rp>(</rp><rt>ひかく</rt><rp>)</rp></ruby>
                </h2>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-600">
                      あなたの<ruby>位置<rp>(</rp><rt>いち</rt><rp>)</rp></ruby>
                    </span>
                    <span className="text-2xl font-bold text-indigo-700">
                      <ruby>上位<rp>(</rp><rt>じょうい</rt><rp>)</rp></ruby> {100 - stats.percentile}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${stats.percentile}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-700 rounded-full shadow"
                      style={{ left: `${stats.percentile}%`, transform: `translate(-50%, -50%)` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span><ruby>初心者<rp>(</rp><rt>しょしんしゃ</rt><rp>)</rp></ruby></span>
                    <span><ruby>上級者<rp>(</rp><rt>じょうきゅうしゃ</rt><rp>)</rp></ruby></span>
                  </div>
                </div>
              </div>

              {/* 分野×難易度別 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-purple-700 mb-1">
                    <ruby>待<rp>(</rp><rt>ま</rt><rp>)</rp></ruby>ち<ruby>牌<rp>(</rp><rt>はい</rt><rp>)</rp></ruby>
                  </div>
                  <div className="text-lg font-bold text-purple-800">
                    {stats.tile.correct}/{stats.tile.total}
                  </div>
                  <div className="text-xs text-purple-500 mt-1">
                    E:{stats.tile.easy} M:{stats.tile.medium} H:{stats.tile.hard}
                  </div>
                </div>
                <div className="bg-pink-50 rounded-xl p-3 text-center">
                  <div className="text-sm font-bold text-pink-700 mb-1">アルゴリズム</div>
                  <div className="text-lg font-bold text-pink-800">
                    {stats.algorithm.correct}/{stats.algorithm.total}
                  </div>
                  <div className="text-xs text-pink-500 mt-1">
                    E:{stats.algorithm.easy} M:{stats.algorithm.medium} H:{stats.algorithm.hard}
                  </div>
                </div>
              </div>

              {/* レーダーチャート */}
              <div>
                <h2 className="text-sm font-bold text-gray-500 mb-2">
                  <ruby>全体的<rp>(</rp><rt>ぜんたいてき</rt><rp>)</rp></ruby>な<ruby>理解度<rp>(</rp><rt>りかいど</rt><rp>)</rp></ruby>
                </h2>
                <div className="bg-gray-50 rounded-xl p-2">
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="#d1d5db" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                      />
                      <PolarRadiusAxis
                        tick={{ fontSize: 10, fill: "#9ca3af" }}
                        axisLine={false}
                      />
                      <Radar
                        name="正解数"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 学習履歴（日別棒グラフ） */}
              {stats.history.length > 1 && (
                <div>
                  <h2 className="text-sm font-bold text-gray-500 mb-2">
                    <ruby>学習<rp>(</rp><rt>がくしゅう</rt><rp>)</rp></ruby><ruby>履歴<rp>(</rp><rt>りれき</rt><rp>)</rp></ruby>
                  </h2>
                  <div className="bg-gray-50 rounded-xl p-2">
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={stats.history} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(d) => d.slice(5)}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip
                          formatter={(v, name) => [String(v), name === "correct" ? "正解" : "回答"]}
                          labelFormatter={(l) => String(l)}
                        />
                        <Bar dataKey="total" name="回答数" fill="#c7d2fe" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="correct" name="正解数" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* アクションボタン */}
          <div className="space-y-3 pt-4">
            <a
              href="/"
              className="block w-full py-3 bg-indigo-600 text-white font-bold text-center rounded-xl
                         hover:bg-indigo-700 transition-all"
            >
              <ruby>学習<rp>(</rp><rt>がくしゅう</rt><rp>)</rp></ruby>をつづける
            </a>
            <button
              onClick={handleSignOut}
              className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl
                         hover:bg-gray-200 transition-all"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
