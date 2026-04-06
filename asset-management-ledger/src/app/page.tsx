import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "./logout-button";

// サンプルデータ（後日DBから取得に切り替え）
const sampleAssets = [
  {
    asset_code: "EQ-2026-0001",
    category: "PC",
    name: "ノートPC Dell Latitude 5540",
    model_number: "LAT-5540",
    purchased_at: "2024-04-01",
    useful_life: 5,
    location: "事務室A",
    status: "使用中" as const,
    needs_renewal: false,
  },
  {
    asset_code: "EQ-2026-0002",
    category: "モニター",
    name: "Dell 27インチモニター",
    model_number: "U2723QE",
    purchased_at: "2023-06-15",
    useful_life: 5,
    location: "事務室A",
    status: "使用中" as const,
    needs_renewal: false,
  },
  {
    asset_code: "EQ-2026-0003",
    category: "プリンター",
    name: "Canon複合機 imageRUNNER",
    model_number: "iR-C3226F",
    purchased_at: "2020-09-01",
    useful_life: 5,
    location: "共用スペース",
    status: "使用中" as const,
    needs_renewal: true,
  },
  {
    asset_code: "EQ-2026-0004",
    category: "ネットワーク機器",
    name: "Cisco Catalyst スイッチ",
    model_number: "C1000-24T",
    purchased_at: "2021-03-10",
    useful_life: 7,
    location: "サーバー室",
    status: "使用中" as const,
    needs_renewal: false,
  },
  {
    asset_code: "EQ-2026-0005",
    category: "PC",
    name: "デスクトップPC HP ProDesk",
    model_number: "PD-400G9",
    purchased_at: "2019-11-20",
    useful_life: 5,
    location: "教室B",
    status: "修理中" as const,
    needs_renewal: true,
  },
  {
    asset_code: "EQ-2026-0006",
    category: "什器",
    name: "スチールデスク",
    model_number: "SD-120",
    purchased_at: "2018-04-01",
    useful_life: 10,
    location: "事務室A",
    status: "使用中" as const,
    needs_renewal: false,
  },
  {
    asset_code: "EQ-2026-0007",
    category: "PC",
    name: "MacBook Air M2",
    model_number: "MBA-M2-2023",
    purchased_at: "2023-01-15",
    useful_life: 5,
    location: "会議室1",
    status: "使用中" as const,
    needs_renewal: false,
  },
  {
    asset_code: "EQ-2026-0008",
    category: "プリンター",
    name: "EPSON インクジェット",
    model_number: "EW-M873T",
    purchased_at: "2017-08-01",
    useful_life: 5,
    location: "教室A",
    status: "廃棄済" as const,
    needs_renewal: true,
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    使用中: "bg-green-100 text-green-800",
    修理中: "bg-yellow-100 text-yellow-800",
    廃棄済: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}

function RenewalBadge({ needsRenewal }: { needsRenewal: boolean }) {
  if (!needsRenewal) return null;
  return (
    <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
      更新推奨
    </span>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 集計
  const totalCount = sampleAssets.length;
  const activeCount = sampleAssets.filter((a) => a.status === "使用中").length;
  const repairCount = sampleAssets.filter((a) => a.status === "修理中").length;
  const renewalCount = sampleAssets.filter((a) => a.needs_renewal).length;

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-foreground/10 px-4 py-3 sm:px-6 sm:py-4">
        <h1 className="text-base font-bold sm:text-lg">備品管理台帳</h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden text-sm text-foreground/60 sm:inline">
            {user.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        {/* ダッシュボードカード */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-lg border border-foreground/10 p-3 sm:p-4">
            <p className="text-xs text-foreground/50 sm:text-sm">全備品数</p>
            <p className="text-xl font-bold sm:text-2xl">{totalCount}</p>
          </div>
          <div className="rounded-lg border border-foreground/10 p-3 sm:p-4">
            <p className="text-xs text-foreground/50 sm:text-sm">使用中</p>
            <p className="text-xl font-bold text-green-600 sm:text-2xl">
              {activeCount}
            </p>
          </div>
          <div className="rounded-lg border border-foreground/10 p-3 sm:p-4">
            <p className="text-xs text-foreground/50 sm:text-sm">修理中</p>
            <p className="text-xl font-bold text-yellow-600 sm:text-2xl">
              {repairCount}
            </p>
          </div>
          <div className="rounded-lg border border-foreground/10 p-3 sm:p-4">
            <p className="text-xs text-foreground/50 sm:text-sm">更新推奨</p>
            <p className="text-xl font-bold text-orange-600 sm:text-2xl">
              {renewalCount}
            </p>
          </div>
        </div>

        {/* 見本ラベル */}
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-sm font-semibold sm:text-base">備品一覧</h2>
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            サンプルデータ
          </span>
        </div>

        {/* テーブル（PC表示） */}
        <div className="hidden overflow-x-auto rounded-lg border border-foreground/10 md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-foreground/10 bg-foreground/[0.02]">
              <tr>
                <th className="px-4 py-3 font-medium">備品ID</th>
                <th className="px-4 py-3 font-medium">カテゴリ</th>
                <th className="px-4 py-3 font-medium">品名</th>
                <th className="px-4 py-3 font-medium">型番</th>
                <th className="px-4 py-3 font-medium">購入日</th>
                <th className="px-4 py-3 font-medium">保管場所</th>
                <th className="px-4 py-3 font-medium">ステータス</th>
                <th className="px-4 py-3 font-medium">更新</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {sampleAssets.map((asset) => (
                <tr key={asset.asset_code} className="hover:bg-foreground/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs">
                    {asset.asset_code}
                  </td>
                  <td className="px-4 py-3">{asset.category}</td>
                  <td className="px-4 py-3">{asset.name}</td>
                  <td className="px-4 py-3 text-foreground/60">
                    {asset.model_number}
                  </td>
                  <td className="px-4 py-3">{asset.purchased_at}</td>
                  <td className="px-4 py-3">{asset.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-4 py-3">
                    <RenewalBadge needsRenewal={asset.needs_renewal} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* カードリスト（モバイル表示） */}
        <div className="space-y-3 md:hidden">
          {sampleAssets.map((asset) => (
            <div
              key={asset.asset_code}
              className="rounded-lg border border-foreground/10 p-4"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="font-mono text-xs text-foreground/50">
                    {asset.asset_code}
                  </p>
                </div>
                <StatusBadge status={asset.status} />
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-foreground/60">
                <p>カテゴリ: {asset.category}</p>
                <p>型番: {asset.model_number}</p>
                <p>購入日: {asset.purchased_at}</p>
                <p>場所: {asset.location}</p>
              </div>
              {asset.needs_renewal && (
                <div className="mt-2">
                  <RenewalBadge needsRenewal={asset.needs_renewal} />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
