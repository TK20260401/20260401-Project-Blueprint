"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PixelTargetIcon, PixelConfettiIcon, PixelGiftIcon } from "@/components/pixel-icons";
import type { FamilyChallenge, User } from "@/lib/types";

type Props = {
  challenge: FamilyChallenge | null;
  children: User[];
  familyId: string;
  isParent?: boolean;
  onCreated?: () => void;
};

type ChildProgress = {
  childId: string;
  name: string;
  icon: string;
  count: number;
};

export function FamilyChallengeCard({
  challenge,
  children: kids,
  familyId,
  isParent,
  onCreated,
}: Props) {
  const [progress, setProgress] = useState<ChildProgress[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!challenge || kids.length === 0) return;
    async function load() {
      const childIds = kids.map((k) => k.id);
      const { data: logs } = await supabase
        .from("otetsudai_task_logs")
        .select("child_id")
        .in("child_id", childIds)
        .eq("status", "approved")
        .gte("approved_at", `${challenge!.start_date}T00:00:00`)
        .lte("approved_at", `${challenge!.end_date}T23:59:59`);

      const counts: Record<string, number> = {};
      (logs || []).forEach((l: { child_id: string }) => {
        counts[l.child_id] = (counts[l.child_id] || 0) + 1;
      });

      const prog = kids.map((k) => ({
        childId: k.id,
        name: k.name,
        icon: k.icon,
        count: counts[k.id] || 0,
      }));
      setProgress(prog);
      setTotalCount(prog.reduce((s, p) => s + p.count, 0));
    }
    load();
  }, [challenge?.id, kids]);

  async function handleCreate() {
    setCreating(true);
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 6);
    const titles = [
      "みんなで 20クエスト クリアしよう！",
      "家族で力を合わせよう！",
      "今週もがんばろう！",
      "めざせクエストマスター！",
    ];
    await supabase.from("otetsudai_family_challenges").insert({
      family_id: familyId,
      title: titles[Math.floor(Math.random() * titles.length)],
      target_quests: 20,
      bonus_amount: 50,
      start_date: today.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
    });
    setCreating(false);
    onCreated?.();
  }

  if (!challenge) {
    if (!isParent) return null;
    return (
      <Card className="mb-4 border-dashed border-amber-300">
        <CardContent className="p-4 text-center">
          <Button
            variant="outline"
            className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
            disabled={creating}
            onClick={handleCreate}
          >
            {creating ? "作成中..." : <span className="flex items-center gap-1"><PixelTargetIcon size={16} /> 今週のチャレンジを作る</span>}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const percent = Math.min(100, Math.round((totalCount / challenge.target_quests) * 100));
  const remaining = Math.max(0, challenge.target_quests - totalCount);
  const isComplete = challenge.is_achieved || totalCount >= challenge.target_quests;
  const daysLeft = Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - Date.now()) / 86400000));

  return (
    <Card className={`mb-4 ${isComplete ? "border-green-300 bg-gradient-to-r from-green-50 to-emerald-50" : "border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50"}`}>
      <CardContent className="p-4">
        <p className="text-sm font-bold text-center text-amber-700 mb-1">
          <span className="flex items-center justify-center gap-1">{isComplete ? <><PixelConfettiIcon size={16} /> 家族チャレンジ達成！</> : <><PixelTargetIcon size={16} /> 家族チャレンジ</>}</span>
        </p>
        <p className="text-base font-bold text-center text-gray-800 mb-3">
          「{challenge.title}」
        </p>

        {/* メンバー進捗 */}
        <div className="space-y-1.5 mb-3">
          {progress.map((p) => {
            const ratio = challenge.target_quests > 0
              ? Math.min(100, Math.round((p.count / Math.ceil(challenge.target_quests / kids.length)) * 100))
              : 0;
            return (
              <div key={p.childId} className="flex items-center gap-2">
                <span className="text-base w-6">{p.icon}</span>
                <span className="text-xs font-bold w-12 truncate">{p.name}</span>
                <div className="flex-1">
                  <Progress value={ratio} className="h-2.5" />
                </div>
                <span className="text-xs font-bold w-6 text-right">{p.count}</span>
              </div>
            );
          })}
        </div>

        {/* 合計 */}
        <p className="text-xs text-center text-gray-600 mb-1">
          家族合計: {totalCount}/{challenge.target_quests} クエスト
        </p>
        <Progress value={percent} className="h-3 mb-1" />
        <p className="text-[10px] text-right text-muted-foreground">{percent}%</p>

        {/* ボーナス */}
        <p className="text-xs font-bold text-amber-600 text-center mt-2">
          <span className="flex items-center justify-center gap-1"><PixelGiftIcon size={16} /> 達成ボーナス: みんなに {challenge.bonus_amount}円！</span>
        </p>
        {!isComplete && (
          <p className="text-[11px] text-center text-gray-500 mt-1">
            あと {remaining}クエスト！ 残り{daysLeft}日 がんばろう！
          </p>
        )}
        {isComplete && (
          <p className="text-xs font-bold text-green-600 text-center mt-1">
            <span className="flex items-center justify-center gap-1">みんなで達成した！ おめでとう！ <PixelConfettiIcon size={16} /></span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
