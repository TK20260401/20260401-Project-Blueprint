import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppShell from "@/components/app-shell";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: proposals } = await supabase
    .from("proposals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <AppShell>
      <div className="px-6 py-8 sm:px-10">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">提案書履歴</h2>
        <p className="mb-8 text-sm text-gray-500">過去に作成した提案書の一覧</p>

        {(proposals ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20">
            <p className="text-gray-400">まだ提案書がありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">企業名</th>
                  <th className="px-4 py-3 font-medium text-gray-600">業界</th>
                  <th className="px-4 py-3 font-medium text-gray-600">フェーズ</th>
                  <th className="px-4 py-3 font-medium text-gray-600">ステータス</th>
                  <th className="px-4 py-3 font-medium text-gray-600">作成日</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(proposals ?? []).map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.company_name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.industry ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-600">
                        Phase {p.current_phase}/5
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.status === "completed" ? "bg-green-50 text-green-600" :
                        p.status === "in_progress" ? "bg-yellow-50 text-yellow-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {p.status === "completed" ? "完了" : p.status === "in_progress" ? "進行中" : "下書き"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString("ja-JP")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
