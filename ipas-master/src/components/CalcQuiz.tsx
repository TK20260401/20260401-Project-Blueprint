"use client";

import { useState, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  allQuestions,
  batches,
  allCategories,
  getQuestionsByCategory,
  type Question,
  type QuestionCategory,
} from "@/lib/allQuestions";

function R({ b, r }: { b: string; r: string }) {
  return <ruby>{b}<rp>(</rp><rt>{r}</rt><rp>)</rp></ruby>;
}

type QuizState = "answering" | "answered";
type FilterMode = "batch" | "category";

interface CalcQuizProps {
  onAnswer?: (category: string, isCorrect: boolean) => void;
}

export default function CalcQuiz({ onAnswer }: CalcQuizProps) {
  const { data: session } = useSession();
  const [filterMode, setFilterMode] = useState<FilterMode>("batch");
  const [batchIndex, setBatchIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>("企業活動");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [state, setState] = useState<QuizState>("answering");
  const [stats, setStats] = useState({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
  const [shuffled, setShuffled] = useState(false);
  const [skippedIndices, setSkippedIndices] = useState<Set<number>>(new Set());
  const [showSkippedList, setShowSkippedList] = useState(false);

  const pool = useMemo(() => {
    let qs: Question[];
    if (filterMode === "batch") {
      qs = batches[batchIndex].questions;
    } else {
      qs = getQuestionsByCategory(selectedCategory);
    }
    if (shuffled) {
      const copy = [...qs];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
    return qs;
  }, [filterMode, batchIndex, selectedCategory, shuffled]);

  const currentQ = pool[questionIndex] ?? pool[0];

  const resetQuiz = useCallback((newIndex?: number) => {
    setQuestionIndex(newIndex ?? 0);
    setSelectedIndex(null);
    setState("answering");
  }, []);

  const resetAll = useCallback(() => {
    resetQuiz(0);
    setStats({ total: 0, correct: 0, streak: 0, bestStreak: 0 });
    setSkippedIndices(new Set());
    setShowSkippedList(false);
    setReviewMode(false);
  }, [resetQuiz]);

  const changeBatch = (idx: number) => {
    setBatchIndex(idx);
    setFilterMode("batch");
    resetAll();
  };

  const changeCategory = (cat: QuestionCategory) => {
    setSelectedCategory(cat);
    setFilterMode("category");
    resetAll();
  };

  const submitAnswer = () => {
    if (selectedIndex === null) {
      setState("answered");
      setStats((p) => ({ ...p, total: p.total + 1, streak: 0 }));
      onAnswer?.(currentQ.category, false);
      recordToServer(currentQ.id, currentQ.category, false);
    } else {
      const isCorrect = selectedIndex === currentQ.correctIndex;
      setState("answered");
      setStats((p) => ({
        total: p.total + 1,
        correct: p.correct + (isCorrect ? 1 : 0),
        streak: isCorrect ? p.streak + 1 : 0,
        bestStreak: isCorrect ? Math.max(p.bestStreak, p.streak + 1) : p.bestStreak,
      }));
      onAnswer?.(currentQ.category, isCorrect);
      recordToServer(currentQ.id, currentQ.category, isCorrect);
    }
    // スキップ済みから削除
    setSkippedIndices((prev) => {
      const next = new Set(prev);
      next.delete(questionIndex);
      return next;
    });
  };

  const recordToServer = (questionId: number, category: string, isCorrect: boolean) => {
    if (!session?.user) return;
    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, category, isCorrect }),
    }).catch(() => {});
  };

  const nextQuestion = () => {
    if (state === "answering") {
      setSkippedIndices((prev) => new Set(prev).add(questionIndex));
    }
    const next = questionIndex + 1;
    if (next < pool.length) {
      setQuestionIndex(next);
      setSelectedIndex(null);
      setState("answering");
    }
  };

  const [reviewMode, setReviewMode] = useState(false);

  const jumpToQuestion = (idx: number) => {
    setReviewMode(true);
    setQuestionIndex(idx);
    setSelectedIndex(null);
    setState("answering");
    setShowSkippedList(false);
  };

  const isLastQuestion = questionIndex >= pool.length - 1;
  const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-800 text-center">
        ITパスポート <R b="問題" r="もんだい" />ドリル（500<R b="問" r="もん" />）
      </h2>

      {/* フィルタモード切り替え */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => { setFilterMode("batch"); resetAll(); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            filterMode === "batch"
              ? "bg-emerald-700 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          100<R b="問" r="もん" /><R b="単位" r="たんい" />
        </button>
        <button
          onClick={() => { setFilterMode("category"); resetAll(); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            filterMode === "category"
              ? "bg-emerald-700 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <R b="分野別" r="ぶんやべつ" />
        </button>
        <button
          onClick={() => { setShuffled((p) => !p); resetQuiz(0); }}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            shuffled
              ? "bg-amber-600 text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-pressed={shuffled}
        >
          シャッフル{shuffled ? " ON" : " OFF"}
        </button>
      </div>

      {/* バッチ or カテゴリ選択 — 横スクロール対応 */}
      <div className="tab-scroll justify-center" role="group" aria-label="出題範囲の選択">
        {filterMode === "batch"
          ? batches.map((b, i) => (
              <button
                key={i}
                onClick={() => changeBatch(i)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  batchIndex === i
                    ? "bg-emerald-700 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {b.label}
              </button>
            ))
          : allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => changeCategory(cat)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
      </div>

      {/* スコア + 進捗 */}
      <div className="flex flex-wrap gap-2 justify-center text-xs sm:text-sm">
        <span className="bg-emerald-100 rounded-lg px-3 py-1.5 font-bold text-emerald-800">
          {stats.correct}/{stats.total} ({pct}%)
        </span>
        <span className="bg-amber-100 rounded-lg px-3 py-1.5 font-bold text-amber-800">
          <R b="連続" r="れんぞく" />: {stats.streak}
        </span>
        <span className="bg-blue-100 rounded-lg px-3 py-1.5 font-bold text-blue-800">
          {questionIndex + 1} / {pool.length}
        </span>
      </div>

      {/* プログレスバー */}
      <div className="w-full bg-gray-200 rounded-full h-2.5" role="progressbar"
        aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={pool.length}
        aria-label={`進捗: ${questionIndex + 1}/${pool.length}`}
      >
        <div
          className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((questionIndex + 1) / pool.length) * 100}%` }}
        />
      </div>

      {/* 問題カード */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 px-4 sm:px-5 py-3 flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-200 text-teal-900">
            {currentQ.category}
          </span>
          <span className="text-sm text-gray-500">
            Q{currentQ.id}
          </span>
          {currentQ.formula && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 sm:ml-auto">
              <R b="公式" r="こうしき" />: {currentQ.formula}
            </span>
          )}
        </div>

        <div className="px-4 sm:px-5 py-4 sm:py-5">
          <p className="text-base sm:text-lg font-bold text-gray-900 leading-relaxed">
            {currentQ.question}
          </p>
        </div>

        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-2">
          {currentQ.choices.map((choice, i) => {
            const letter = ["ア", "イ", "ウ", "エ"][i];
            let btnClass = "bg-gray-50 border-2 border-gray-200 text-gray-800 hover:bg-gray-100";

            if (state === "answering" && selectedIndex === i) {
              btnClass = "bg-emerald-100 border-2 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300";
            }
            if (state === "answered") {
              if (i === currentQ.correctIndex) {
                btnClass = "bg-green-100 border-2 border-green-600 text-green-900 font-bold";
              } else if (i === selectedIndex) {
                btnClass = "bg-red-100 border-2 border-red-500 text-red-900";
              } else {
                btnClass = "bg-gray-50 border-2 border-gray-200 text-gray-400";
              }
            }

            return (
              <button
                key={i}
                onClick={() => {
                  if (state === "answering") setSelectedIndex(i);
                }}
                disabled={state === "answered"}
                aria-label={`選択肢${letter}: ${choice}`}
                className={`w-full text-left px-4 sm:px-5 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all ${btnClass}`}
              >
                <span className="mr-2 sm:mr-3 text-sm opacity-70">{letter}</span>
                {choice}
                {state === "answered" && i === currentQ.correctIndex && (
                  <span className="ml-2 text-green-700" aria-label="正解">✓</span>
                )}
                {state === "answered" && i === selectedIndex && i !== currentQ.correctIndex && (
                  <span className="ml-2 text-red-600" aria-label="不正解">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {state === "answered" && (
          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
              <p className="font-bold text-blue-900 text-sm mb-2"><R b="解説" r="かいせつ" /></p>
              <p className="text-gray-800 text-sm leading-loose whitespace-pre-line">
                {currentQ.explanation}
              </p>
            </div>
          </div>
        )}

        <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col items-center gap-3">
          {/* レビューモード: スキップ問題を回答中 */}
          {reviewMode ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex justify-center gap-3">
                <button
                  onClick={submitAnswer}
                  disabled={state === "answered"}
                  className={`px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg ${
                    state === "answered"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95"
                  }`}
                >
                  <R b="回答" r="かいとう" />する
                </button>
              </div>
              {state === "answered" && (
                <button
                  onClick={() => {
                    if (skippedIndices.size > 0) {
                      setReviewMode(false);
                      setQuestionIndex(pool.length - 1);
                      setState("answered");
                      setShowSkippedList(true);
                    } else {
                      setReviewMode(false);
                      setQuestionIndex(pool.length - 1);
                      setState("answered");
                    }
                  }}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-sm
                             hover:bg-orange-600 active:scale-95 transition-all shadow"
                >
                  {skippedIndices.size > 0
                    ? <>スキップ<R b="一覧" r="いちらん" />に<R b="戻" r="もど" />る（<R b="残" r="のこ" />り{skippedIndices.size}<R b="問" r="もん" />）</>
                    : <><R b="結果" r="けっか" /><R b="画面" r="がめん" />に<R b="戻" r="もど" />る</>
                  }
                </button>
              )}
            </div>
          ) : (isLastQuestion && state === "answered") || (isLastQuestion && skippedIndices.size > 0 && state === "answered") ? (
            <div className="text-center w-full">
              <p className="text-lg font-bold text-emerald-800 mb-3">
                <R b="完了" r="かんりょう" />！ {stats.correct}/{stats.total}（{pct}%）
              </p>

              {skippedIndices.size > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowSkippedList((p) => !p)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm
                               hover:bg-orange-600 active:scale-95 transition-all shadow"
                  >
                    スキップした<R b="問題" r="もんだい" />（{skippedIndices.size}<R b="問" r="もん" />）
                    {showSkippedList ? " ▲" : " ▼"}
                  </button>

                  {showSkippedList && (
                    <div className="mt-3 bg-orange-50 border-2 border-orange-200 rounded-xl p-3 max-h-60 overflow-y-auto">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {Array.from(skippedIndices)
                          .sort((a, b) => a - b)
                          .map((idx) => (
                            <button
                              key={idx}
                              onClick={() => jumpToQuestion(idx)}
                              className="px-3 py-2 bg-white border-2 border-orange-300 rounded-lg text-sm font-bold
                                         text-orange-800 hover:bg-orange-100 active:scale-95 transition-all"
                            >
                              Q{pool[idx].id}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={resetAll}
                className="px-6 sm:px-8 py-3 bg-amber-600 text-white rounded-xl font-bold text-base sm:text-lg
                           hover:bg-amber-700 active:scale-95 transition-all shadow-lg"
              >
                もう<R b="一度" r="いちど" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center gap-3">
              <button
                onClick={submitAnswer}
                disabled={state === "answered"}
                className={`px-6 sm:px-8 py-3 rounded-xl font-bold text-base sm:text-lg transition-all shadow-lg ${
                  state === "answered"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-700 text-white hover:bg-emerald-800 active:scale-95"
                }`}
              >
                <R b="回答" r="かいとう" />する
              </button>
              {!isLastQuestion ? (
                <button
                  onClick={nextQuestion}
                  className="px-6 sm:px-8 py-3 bg-sky-600 text-white rounded-xl font-bold text-base sm:text-lg
                             hover:bg-sky-700 active:scale-95 transition-all shadow-lg"
                >
                  <R b="次" r="つぎ" />の<R b="問" r="もん" />い
                </button>
              ) : state === "answering" ? (
                <button
                  onClick={() => {
                    setSkippedIndices((prev) => new Set(prev).add(questionIndex));
                    setState("answered");
                    setShowSkippedList(true);
                  }}
                  className="px-6 sm:px-8 py-3 bg-sky-600 text-white rounded-xl font-bold text-base sm:text-lg
                             hover:bg-sky-700 active:scale-95 transition-all shadow-lg"
                >
                  スキップ
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
