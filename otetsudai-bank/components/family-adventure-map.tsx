"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import type { User, Wallet } from "@/lib/types";

const LEVEL_THRESHOLDS = [0, 100, 500, 1500, 3000, 5000, 10000];
function getLevel(total: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (total >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

const LEVEL_EMOJI = ["🐣", "🐥", "🐤", "🦅", "🦉", "🐉", "👑"];

type Props = {
  familyName: string;
  children: User[];
  wallets: Record<string, Wallet>;
};

export function FamilyAdventureMap({ familyName, children: kids, wallets }: Props) {
  const [stats, setStats] = useState({ weeklyQuests: 0, weeklyEarned: 0, familyStreak: 0 });

  useEffect(() => {
    async function load() {
      if (kids.length === 0) return;
      const childIds = kids.map((k) => k.id);
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { data: logs } = await supabase
        .from("otetsudai_task_logs")
        .select("*, task:otetsudai_tasks(reward_amount)")
        .in("child_id", childIds)
        .eq("status", "approved")
        .gte("approved_at", weekStart.toISOString());

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const weeklyEarned = (logs || []).reduce((s: number, l: any) => s + (l.task?.reward_amount || 0), 0);

      const { data: streakLogs } = await supabase
        .from("otetsudai_task_logs")
        .select("approved_at")
        .in("child_id", childIds)
        .eq("status", "approved")
        .not("approved_at", "is", null)
        .order("approved_at", { ascending: false })
        .limit(90);

      let familyStreak = 0;
      if (streakLogs && streakLogs.length > 0) {
        const days = new Set(streakLogs.map((l: { approved_at: string }) => new Date(l.approved_at).toDateString()));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const check = new Date(today);
        if (!days.has(check.toDateString())) check.setDate(check.getDate() - 1);
        while (days.has(check.toDateString())) { familyStreak++; check.setDate(check.getDate() - 1); }
      }

      setStats({ weeklyQuests: logs?.length || 0, weeklyEarned, familyStreak });
    }
    load();
  }, [kids]);

  const familyTotal = kids.reduce((sum, k) => {
    const w = wallets[k.id];
    return sum + (w ? w.spending_balance + w.saving_balance + w.invest_balance : 0);
  }, 0);

  return (
    <Card className="mb-4 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50">
      <CardContent className="p-4">
        <p className="text-base font-bold text-amber-800 text-center mb-3">
          🗺️ {familyName}の ぼうけんちず
        </p>

        {/* メンバー横並び */}
        <div className="flex justify-center gap-3 mb-4">
          {kids.map((kid) => {
            const w = wallets[kid.id];
            const total = w ? w.spending_balance + w.saving_balance + w.invest_balance : 0;
            const level = getLevel(total);
            return (
              <div
                key={kid.id}
                className="flex flex-col items-center bg-white/70 rounded-xl p-2 border border-amber-200 min-w-[72px]"
              >
                <span className="text-2xl">{LEVEL_EMOJI[Math.min(level - 1, 6)]}</span>
                <span className="text-[10px] font-bold text-amber-600">Lv.{level}</span>
                <span className="text-xs font-bold text-gray-800 truncate max-w-[64px]">{kid.name}</span>
                <span className="text-[10px] text-muted-foreground">{total.toLocaleString()}円</span>
              </div>
            );
          })}
        </div>

        {/* 家族統計 */}
        <div className="grid grid-cols-4 gap-2 bg-amber-100/50 rounded-xl p-2">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">{stats.weeklyQuests}</p>
            <p className="text-[9px] text-muted-foreground">今週クエスト</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">¥{stats.weeklyEarned.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground">稼いだ</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">
              {stats.familyStreak > 0 ? `🔥${stats.familyStreak}` : "—"}
            </p>
            <p className="text-[9px] text-muted-foreground">連続日</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-800">¥{familyTotal.toLocaleString()}</p>
            <p className="text-[9px] text-muted-foreground">合計</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
