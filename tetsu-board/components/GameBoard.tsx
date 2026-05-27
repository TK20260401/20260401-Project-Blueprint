"use client";

// WF1 ゲーム画面（DESIGN 14.1 / 16.5）。円環マップ・サイコロ・クイズ(WF2)・結果を1画面に集約。
// 状態は useGameStore に集約し、このコンポーネントは描画とイベント送出に専念する。

import { useGameStore } from "@/store/gameStore";
import { RubyText } from "@/components/RubyText";
import type { Station } from "@/lib/game/types";

const CATEGORY_COLOR: Record<string, string> = {
  station: "bg-sky-200 border-sky-400",
  shop: "bg-rose-200 border-rose-400",
  factory: "bg-amber-200 border-amber-400",
  tourism: "bg-violet-200 border-violet-400",
  farm: "bg-lime-200 border-lime-400",
};

const KIND_COLOR: Record<string, string> = {
  start: "bg-emerald-300 border-emerald-500",
  event: "bg-yellow-200 border-yellow-400",
  goal: "bg-emerald-300 border-emerald-500",
};

function stationColor(st: Station) {
  if (st.kind === "property" && st.property) {
    return CATEGORY_COLOR[st.property.category] ?? "bg-stone-200 border-stone-400";
  }
  return KIND_COLOR[st.kind] ?? "bg-stone-200 border-stone-400";
}

export function GameBoard() {
  const {
    map,
    players,
    currentPlayerIndex,
    turn,
    phase,
    lastDice,
    lastGainedCoin,
    activeQuiz,
    lastAnswerCorrect,
    message,
    roll,
    answer,
    endTurn,
  } = useGameStore();

  const current = players[currentPlayerIndex];
  const n = map.stations.length;
  const radius = 160;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:flex-row">
      {/* 盤面 */}
      <div className="flex flex-1 flex-col items-center">
        <div className="mb-3 text-center text-sm font-bold text-stone-600">
          {turn}ターン目 ・ <span className="text-rose-600">{current.nickname}</span>のばん
        </div>
        <div className="relative h-[400px] w-[400px] rounded-full bg-[#f3ead7] shadow-inner">
          {map.stations.map((st, i) => {
            const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            const x = 200 + radius * Math.cos(angle) - 36;
            const y = 200 + radius * Math.sin(angle) - 36;
            const here = players.filter((p) => p.stationIndex === i);
            return (
              <div
                key={st.id}
                className={`absolute flex h-[72px] w-[72px] flex-col items-center justify-center rounded-xl border-2 text-center text-xs font-bold shadow ${stationColor(st)}`}
                style={{ left: x, top: y }}
              >
                <RubyText text={st.label} />
                {here.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {here.map((p) => (
                      <span
                        key={p.userId}
                        className={`h-3 w-3 rounded-full border border-white ${
                          p.userId === current.userId ? "bg-rose-500" : "bg-blue-500"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {/* 中央：サイコロ表示 */}
          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl bg-white text-4xl font-black text-stone-700 shadow-lg">
            {lastDice ?? "?"}
            <span className="text-[10px] font-medium text-stone-400">サイコロ</span>
          </div>
        </div>
      </div>

      {/* 操作パネル */}
      <div className="flex w-full flex-col gap-4 md:w-80">
        {/* プレイヤー情報 */}
        <div className="grid grid-cols-2 gap-2">
          {players.map((p, i) => (
            <div
              key={p.userId}
              className={`rounded-xl border-2 p-3 ${
                i === currentPlayerIndex
                  ? "border-rose-400 bg-rose-50"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="text-xs font-bold text-stone-500">{p.nickname}</div>
              <div className="text-lg font-black text-amber-600">{p.coin}コイン</div>
              <div className="text-[11px] text-stone-500">
                物件{p.ownedPropertyIds.length} ・ {p.score}点
              </div>
            </div>
          ))}
        </div>

        {/* メッセージ */}
        <div className="min-h-[56px] rounded-xl bg-white p-3 text-sm font-medium text-stone-700 shadow">
          {message}
          {lastGainedCoin > 0 && phase !== "quiz" && (
            <span className="ml-1 font-bold text-amber-600">(+{lastGainedCoin})</span>
          )}
        </div>

        {/* クイズ（WF2） */}
        {phase === "quiz" && activeQuiz && (
          <div className="rounded-xl border-2 border-sky-300 bg-sky-50 p-4">
            <div className="mb-3 text-base font-bold text-stone-800">
              <RubyText text={activeQuiz.quiz.question} />
            </div>
            <div className="flex flex-col gap-2">
              {activeQuiz.quiz.choices.map((c) => (
                <button
                  key={c.key}
                  onClick={() => answer(c.key)}
                  className="rounded-lg border-2 border-stone-300 bg-white px-4 py-3 text-left text-base font-bold text-stone-700 transition hover:border-sky-400 hover:bg-sky-100 active:scale-[0.98]"
                >
                  <span className="mr-2 text-sky-500">{c.key}.</span>
                  <RubyText text={c.text} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* アクションボタン */}
        {phase === "idle" && (
          <button
            onClick={roll}
            className="rounded-2xl bg-rose-500 py-5 text-2xl font-black text-white shadow-lg transition hover:bg-rose-600 active:scale-[0.97]"
          >
            🎲 サイコロをふる
          </button>
        )}
        {phase === "result" && (
          <button
            onClick={endTurn}
            className="rounded-2xl bg-emerald-500 py-5 text-2xl font-black text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.97]"
          >
            {lastAnswerCorrect === false ? "つぎへ" : "つぎのプレイヤーへ"} ▶
          </button>
        )}
      </div>
    </div>
  );
}
