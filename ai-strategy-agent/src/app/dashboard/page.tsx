import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/app-shell";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 提案書データ取得
  const { data: proposals, count: totalCount } = await supabase
    .from("proposals")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // 今月の件数
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);
  const { count: monthCount } = await supabase
    .from("proposals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", firstOfMonth.toISOString());

  // 業界数
  const { data: industries } = await supabase
    .from("proposals")
    .select("industry")
    .eq("user_id", user.id);
  const uniqueIndustries = new Set((industries ?? []).map((p) => p.industry).filter(Boolean));

  const stats = [
    { label: "総提案書数", value: totalCount ?? 0, color: "text-gray-900" },
    { label: "今月の作成数", value: monthCount ?? 0, color: "text-gray-900" },
    { label: "対象業界数", value: uniqueIndustries.size, color: "text-gray-900" },
    { label: "平均生成時間", value: "0秒", color: "text-violet-600", isText: true },
  ];

  return (
    <AppShell>
      <div className="px-6 py-8 sm:px-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">ダッシュボード</h2>
          <p className="mt-1 text-sm text-gray-500">AI戦略提案書の管理・分析</p>
        </div>

        {/* 統計カード */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-5">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className={`mt-1 text-3xl font-bold ${stat.color}`}>
                {stat.isText ? stat.value : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* 最近の提案書 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">最近の提案書</h3>
          <Link href="/history" className="text-sm text-gray-500 hover:text-gray-700">
            すべて表示 →
          </Link>
        </div>

        {(proposals ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20">
            <p className="mb-2 text-lg text-gray-400">まだ提案書がありません</p>
            <p className="mb-6 text-sm text-gray-400">企業名を入力して最初の提案書を作成しましょう</p>
            <Link
              href="/proposals/new"
              className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-700"
            >
              新しい提案書を作成
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(proposals ?? []).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4">
                <div>
                  <p className="font-medium text-gray-900">{p.company_name}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                    {p.industry && <span className="rounded bg-violet-50 px-2 py-0.5 text-violet-600">{p.industry}</span>}
                    <span>Phase {p.current_phase}/5</span>
                    <span>{new Date(p.created_at).toLocaleDateString("ja-JP")}</span>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  p.status === "completed" ? "bg-green-50 text-green-600" :
                  p.status === "in_progress" ? "bg-yellow-50 text-yellow-600" :
                  "bg-gray-50 text-gray-500"
                }`}>
                  {p.status === "completed" ? "完了" : p.status === "in_progress" ? "進行中" : "下書き"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 新規作成ボタン（フローティング） */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/proposals/new"
            className="rounded-lg bg-violet-600 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
          >
            新しい提案書を作成
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
