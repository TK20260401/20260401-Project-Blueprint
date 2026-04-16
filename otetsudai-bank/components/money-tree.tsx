"use client";

import { getTreeStage } from "@/lib/money-tree";
import { R } from "@/components/ruby-text";
import { Progress } from "@/components/ui/progress";

type Props = {
  investBalance: number;
  isParent?: boolean;
};

export function MoneyTree({ investBalance, isParent }: Props) {
  const { stage, label, emoji, next } = getTreeStage(investBalance);

  const stageEmojis: Record<string, string> = {
    seed: "🌰",
    sprout: "🌱",
    sapling: "🌿",
    tree: "🌳",
  };

  const progress = next
    ? Math.min(100, Math.round((investBalance / next) * 100))
    : 100;

  return (
    <div className="flex flex-col items-center p-4 bg-gradient-to-b from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
      {/* 木のビジュアル */}
      <div className="relative mb-2">
        <span className="text-6xl block text-center">{stageEmojis[stage]}</span>
        {stage === "tree" && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-lg">👑</span>
        )}
      </div>

      {/* ステージ名 */}
      <p className="text-sm font-bold text-emerald-700">
        🌳 {isParent ? `ふやすの木: ${label}` : (
          <>ふやすの<R k="木" r="き" />: {label}</>
        )}
      </p>

      {/* 進捗バー */}
      {next ? (
        <div className="w-full mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-[11px] text-muted-foreground text-center mt-1">
            {isParent
              ? `次の成長まで あと ${(next - investBalance).toLocaleString()}円`
              : <>つぎの<R k="成長" r="せいちょう" />まで あと {(next - investBalance).toLocaleString()}<R k="円" r="えん" /></>
            }
          </p>
        </div>
      ) : (
        <p className="text-xs text-amber-600 font-bold mt-1">
          {isParent ? "最大まで成長した！ 🎉" : (
            <><R k="最大" r="さいだい" />まで <R k="成長" r="せいちょう" />した！ 🎉</>
          )}
        </p>
      )}

      {/* ステージ一覧 */}
      <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
        {["seed", "sprout", "sapling", "tree"].map((s) => (
          <span
            key={s}
            className={`${s === stage ? "opacity-100 font-bold" : "opacity-40"}`}
          >
            {stageEmojis[s]}
          </span>
        ))}
      </div>
    </div>
  );
}
