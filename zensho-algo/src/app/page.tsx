"use client";

import { useState, useCallback } from "react";
import PseudoEditor from "@/components/PseudoEditor";
import TraceTable from "@/components/TraceTable";
import { execute, type TraceEntry } from "@/lib/interpreter";
import { samplePrograms } from "@/lib/samplePrograms";

export default function Home() {
  const [code, setCode] = useState(samplePrograms[0].code);
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [currentStep, setCurrentStep] = useState<number | undefined>();
  const [stepIndex, setStepIndex] = useState(0);
  const [allTrace, setAllTrace] = useState<TraceEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(() => {
    const result = execute(code);
    setTrace(result);
    setAllTrace(result);
    setCurrentStep(undefined);
    setStepIndex(0);
    setIsRunning(false);
  }, [code]);

  const handleStepStart = useCallback(() => {
    const result = execute(code);
    setAllTrace(result);
    setTrace(result.slice(0, 1));
    setCurrentStep(0);
    setStepIndex(1);
    setIsRunning(true);
  }, [code]);

  const handleStepNext = useCallback(() => {
    if (stepIndex < allTrace.length) {
      setTrace(allTrace.slice(0, stepIndex + 1));
      setCurrentStep(stepIndex);
      setStepIndex(stepIndex + 1);
    } else {
      setIsRunning(false);
      setCurrentStep(undefined);
    }
  }, [stepIndex, allTrace]);

  const handleReset = useCallback(() => {
    setTrace([]);
    setAllTrace([]);
    setCurrentStep(undefined);
    setStepIndex(0);
    setIsRunning(false);
  }, []);

  const handleSampleChange = (idx: number) => {
    setCode(samplePrograms[idx].code);
    handleReset();
  };

  const highlightLine = currentStep != null && trace[currentStep]
    ? trace[currentStep].line
    : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="bg-slate-800 text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Zensho-Algo
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            全商検定アルゴリズム・トレーナー
          </p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 py-6">
        {/* サンプル選択 */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-bold text-slate-700">サンプル:</label>
          <select
            onChange={(e) => handleSampleChange(parseInt(e.target.value))}
            className="border-2 border-slate-300 rounded-lg px-3 py-2 text-sm bg-white font-bold text-slate-700"
          >
            {samplePrograms.map((p, i) => (
              <option key={i} value={i}>
                [{p.grade}] {p.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-500 hidden sm:inline">
            {samplePrograms.find((_, i) => i === 0)?.description}
          </span>
        </div>

        {/* 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 左: エディタ */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-600">疑似言語エディタ</h2>
            <PseudoEditor
              code={code}
              onChange={setCode}
              highlightLine={highlightLine}
            />

            {/* 実行ボタン */}
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm
                           hover:bg-emerald-700 active:scale-95 transition-all shadow"
              >
                ▶ 実行
              </button>
              {!isRunning ? (
                <button
                  onClick={handleStepStart}
                  className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-bold text-sm
                             hover:bg-sky-700 active:scale-95 transition-all shadow"
                >
                  ▶▶ ステップ開始
                </button>
              ) : (
                <button
                  onClick={handleStepNext}
                  disabled={stepIndex >= allTrace.length}
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow ${
                    stepIndex >= allTrace.length
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-sky-600 text-white hover:bg-sky-700 active:scale-95"
                  }`}
                >
                  ▶▶ 次のステップ ({stepIndex}/{allTrace.length})
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-slate-500 text-white rounded-lg font-bold text-sm
                           hover:bg-slate-600 active:scale-95 transition-all shadow"
              >
                ↺ リセット
              </button>
            </div>
          </div>

          {/* 右: トレース表 */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-600">トレース表</h2>
            <TraceTable trace={trace} currentStep={currentStep} />
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-slate-800 text-slate-400 text-center py-4 text-xs">
        &copy; 2026 Zensho-Algo ー 全商情報処理検定 完全攻略
      </footer>
    </div>
  );
}
