"use client";

import { useState, useCallback, useRef } from "react";
import BreakEvenSimulator from "./BreakEvenSimulator";
import TermFlash from "./TermFlash";
import BinaryConverter from "./BinaryConverter";
import CalcQuiz from "./CalcQuiz";
import LearningDashboard from "./LearningDashboard";

function R({ b, r }: { b: string; r: string }) {
  return (
    <ruby>
      {b}
      <rp>(</rp>
      <rt>{r}</rt>
      <rp>)</rp>
    </ruby>
  );
}

type Mode = "quiz" | "calc" | "terms" | "binary" | "dashboard";

const tabs: { mode: Mode; icon: string; label: React.ReactNode; ariaLabel: string }[] = [
  {
    mode: "quiz",
    icon: "📝",
    label: (
      <>
        <R b="問題" r="もんだい" />ドリル
      </>
    ),
    ariaLabel: "問題ドリル",
  },
  {
    mode: "calc",
    icon: "📊",
    label: (
      <>
        シミュレーター
      </>
    ),
    ariaLabel: "損益分岐点シミュレーター",
  },
  {
    mode: "terms",
    icon: "🔤",
    label: (
      <>
        <R b="用語" r="ようご" />
      </>
    ),
    ariaLabel: "用語フラッシュカード",
  },
  {
    mode: "binary",
    icon: "💻",
    label: (
      <>
        2<R b="進数" r="しんすう" />
      </>
    ),
    ariaLabel: "2進数変換ツール",
  },
  {
    mode: "dashboard",
    icon: "📈",
    label: (
      <>
        <R b="学習" r="がくしゅう" /><R b="履歴" r="りれき" />
      </>
    ),
    ariaLabel: "学習履歴ダッシュボード",
  },
];

export default function GameContainer() {
  const [mode, setMode] = useState<Mode>("quiz");
  const categoryResultsRef = useRef(new Map<string, { correct: number; total: number }>());

  const handleAnswer = useCallback((category: string, isCorrect: boolean) => {
    const map = categoryResultsRef.current;
    const entry = map.get(category) ?? { correct: 0, total: 0 };
    entry.total++;
    if (isCorrect) entry.correct++;
    map.set(category, entry);
  }, []);

  return (
    <div>
      {/* Tab navigation — horizontal scroll on mobile */}
      <nav
        role="tablist"
        aria-label="学習モード切り替え"
        className="tab-scroll mb-4 sm:mb-6 justify-center"
      >
        {tabs.map((tab) => (
          <button
            key={tab.mode}
            role="tab"
            aria-selected={mode === tab.mode}
            aria-label={tab.ariaLabel}
            onClick={() => setMode(tab.mode)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-4 rounded-xl
              text-sm sm:text-base font-bold transition-all duration-200 whitespace-nowrap
              ${
                mode === tab.mode
                  ? "bg-white text-emerald-700 shadow-lg scale-[1.02]"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }`}
          >
            <span className="text-lg" aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div
        role="tabpanel"
        className="bg-white rounded-2xl shadow-xl p-3 sm:p-5 md:p-8"
      >
        {mode === "quiz" && <CalcQuiz onAnswer={handleAnswer} />}
        {mode === "calc" && <BreakEvenSimulator />}
        {mode === "terms" && <TermFlash />}
        {mode === "binary" && <BinaryConverter />}
        {mode === "dashboard" && (
          <LearningDashboard localStats={{ categoryResults: categoryResultsRef.current }} />
        )}
      </div>
    </div>
  );
}
