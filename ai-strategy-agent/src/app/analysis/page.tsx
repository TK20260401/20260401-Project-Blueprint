import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";

export default async function AnalysisPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: proposals } = await supabase
    .from("proposals")
    .select("industry, current_phase, status")
    .eq("user_id", user.id);

  // 業界別集計
  const industryMap = new Map<string, number>();
  (proposals ?? []).forEach((p) => {
    const key = p.industry ?? "未分類";
    industryMap.set(key, (industryMap.get(key) ?? 0) + 1);
  });

  // フェーズ別集計
  const phaseMap = new Map<number, number>();
  (proposals ?? []).forEach((p) => {
    phaseMap.set(p.current_phase, (phaseMap.get(p.current_phase) ?? 0) + 1);
  });

  // ステータス別集計
  const statusMap = new Map<string, number>();
  (proposals ?? []).forEach((p) => {
    statusMap.set(p.status, (statusMap.get(p.status) ?? 0) + 1);
  });

  const phaseLabels: Record<number, string> = {
    1: "事前調査", 2: "ヒアリング", 3: "PoC実証", 4: "現場導入", 5: "定着支援",
  };

  return (
    <AppShell>
      <div className="px-6 py-8 sm:px-10">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">分析</h2>
        <p className="mb-8 text-sm text-gray-500">提案書データの業界別・フェーズ別分析</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 業界別 */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">業界別</h3>
            {industryMap.size === 0 ? (
              <p className="text-sm text-gray-400">データなし</p>
            ) : (
              <div className="space-y-3">
                {Array.from(industryMap.entries()).sort((a, b) => b[1] - a[1]).map(([industry, count]) => (
                  <div key={industry} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{industry}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-violet-200" style={{ width: `${Math.max(count * 40, 20)}px` }} />
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* フェーズ別 */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">フェーズ別</h3>
            {phaseMap.size === 0 ? (
              <p className="text-sm text-gray-400">データなし</p>
            ) : (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((phase) => (
                  <div key={phase} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{phaseLabels[phase]}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-violet-400" style={{ width: `${Math.max((phaseMap.get(phase) ?? 0) * 40, 4)}px` }} />
                      <span className="text-sm font-medium text-gray-900">{phaseMap.get(phase) ?? 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ステータス別 */}
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold text-gray-700">ステータス別</h3>
            {statusMap.size === 0 ? (
              <p className="text-sm text-gray-400">データなし</p>
            ) : (
              <div className="space-y-3">
                {[
                  { key: "draft", label: "下書き", color: "bg-gray-300" },
                  { key: "in_progress", label: "進行中", color: "bg-yellow-400" },
                  { key: "completed", label: "完了", color: "bg-green-400" },
                ].map(({ key, label, color }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.max((statusMap.get(key) ?? 0) * 40, 4)}px` }} />
                      <span className="text-sm font-medium text-gray-900">{statusMap.get(key) ?? 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
