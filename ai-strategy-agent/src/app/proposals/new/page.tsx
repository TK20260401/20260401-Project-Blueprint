"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import AppShell from "@/components/app-shell";

const INDUSTRIES = [
  "製造業", "IT・通信", "金融・保険", "小売・流通", "医療・ヘルスケア",
  "教育", "不動産・建設", "物流・運輸", "飲食・サービス", "官公庁・自治体", "その他",
];

const PHASES = [
  { num: "01", title: "AI AGENTによる事前調査", desc: "IR・採用・口コミ・ニュースから情報収集、課題分析" },
  { num: "02", title: "ヒアリングと業務分解", desc: "業務棚卸し、承認プロセス分解、ROI算出" },
  { num: "03", title: "PoC/BPO実証", desc: "現場で自律運用できる状態まで伴走" },
  { num: "04", title: "現場導入・ラストワンマイル調整", desc: "試験導入、実業務での調整" },
  { num: "05", title: "定着支援", desc: "継続サポート、バージョンアップ、最適化" },
];

export default function NewProposalPage() {
  const router = useRouter();
  const supabase = createClient();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [challenges, setChallenges] = useState("");
  const [employeeCount, setEmployeeCount] = useState("");
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [targetProcesses, setTargetProcesses] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim()) { setError("企業名を入力してください。"); return; }
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("ログインが必要です。"); setLoading(false); return; }

    const { error: insertError } = await supabase.from("proposals").insert({
      user_id: user.id,
      company_name: companyName,
      industry: industry || null,
      challenges: challenges || null,
      employee_count: employeeCount ? parseInt(employeeCount) : null,
      annual_revenue: annualRevenue || null,
      target_processes: targetProcesses || null,
      status: "draft",
      current_phase: 1,
    });

    if (insertError) { setError(insertError.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  const inputClass = "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <AppShell>
      <div className="px-6 py-8 sm:px-10">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">新しい提案書を作成</h2>
        <p className="mb-8 text-sm text-gray-500">企業情報を入力すると、AIが戦略提案書を生成します</p>

        {/* 伴走プロセスフロー */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {PHASES.map((phase, i) => (
              <div key={phase.num} className={`flex min-w-[160px] flex-col rounded-lg p-3 ${i === 0 ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                <span className={`text-xs font-bold ${i === 0 ? "text-violet-200" : "text-gray-400"}`}>{phase.num}</span>
                <span className="mt-1 text-xs font-semibold leading-tight">{phase.title}</span>
                <span className={`mt-1 text-[10px] leading-tight ${i === 0 ? "text-violet-200" : "text-gray-400"}`}>{phase.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">基本情報</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>企業名 <span className="text-red-500">*</span></label>
                <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} placeholder="例: 株式会社サンプル" required />
              </div>
              <div>
                <label className={labelClass}>業界</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputClass}>
                  <option value="">選択してください</option>
                  {INDUSTRIES.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
                </select>
              </div>
              <div>
                <label className={labelClass}>従業員数</label>
                <input type="number" value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)} className={inputClass} placeholder="例: 500" />
              </div>
              <div>
                <label className={labelClass}>年間売上</label>
                <input type="text" value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)} className={inputClass} placeholder="例: 50億円" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">ヒアリング項目</h3>
            <div>
              <label className={labelClass}>現在の課題・悩み</label>
              <textarea value={challenges} onChange={(e) => setChallenges(e.target.value)} className={inputClass + " min-h-[80px] resize-y"}
                placeholder="例: 手作業が多く残業が常態化、属人化した業務が多い、データ活用ができていない" />
            </div>
            <div>
              <label className={labelClass}>AI化を検討したい業務プロセス</label>
              <textarea value={targetProcesses} onChange={(e) => setTargetProcesses(e.target.value)} className={inputClass + " min-h-[80px] resize-y"}
                placeholder="例: 請求書処理、問い合わせ対応、在庫管理、採用スクリーニング" />
            </div>
          </section>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:opacity-50">
            {loading ? "作成中..." : "提案書を作成する"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
