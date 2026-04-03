"use client";

import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { categoryToSystem, systemNames, systemCategories } from "@/lib/categoryMapping";

type StatEntry = { category: string; rate: number };

interface Props {
  userStats: StatEntry[];
  averages?: StatEntry[];
}

function aggregate3Axis(stats: StatEntry[]): { axis: string; rate: number }[] {
  return systemNames.map((sys) => {
    const cats = systemCategories[sys];
    const matched = stats.filter((s) => cats.includes(s.category as never));
    if (matched.length === 0) return { axis: sys, rate: 0 };
    const avg = Math.round(matched.reduce((sum, m) => sum + m.rate, 0) / matched.length);
    return { axis: sys, rate: avg };
  });
}

function to14Axis(stats: StatEntry[]): { axis: string; rate: number }[] {
  const allCats = Object.keys(categoryToSystem);
  return allCats.map((cat) => {
    const found = stats.find((s) => s.category === cat);
    return { axis: cat, rate: found?.rate ?? 0 };
  });
}

export default function RadarChartView({ userStats, averages }: Props) {
  const [mode, setMode] = useState<"3" | "14">("3");

  const userData = mode === "3" ? aggregate3Axis(userStats) : to14Axis(userStats);
  const avgData = averages
    ? mode === "3"
      ? aggregate3Axis(averages)
      : to14Axis(averages)
    : null;

  const chartData = userData.map((d, i) => ({
    axis: d.axis,
    user: d.rate,
    ...(avgData ? { average: avgData[i]?.rate ?? 0 } : {}),
  }));

  return (
    <div>
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setMode("3")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === "3" ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          3系統
        </button>
        <button
          onClick={() => setMode("14")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === "14" ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          14分野
        </button>
      </div>

      <ResponsiveContainer width="100%" height={mode === "14" ? 400 : 320}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fontSize: mode === "14" ? 9 : 12, fill: "#374151" }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="あなた"
            dataKey="user"
            stroke="#059669"
            fill="#059669"
            fillOpacity={0.3}
          />
          {avgData && (
            <Radar
              name="全体平均"
              dataKey="average"
              stroke="#9CA3AF"
              fill="#9CA3AF"
              fillOpacity={0.15}
              strokeDasharray="4 4"
            />
          )}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
