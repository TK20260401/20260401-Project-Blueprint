"use client";

// WF1 ゲーム画面（DESIGN 14.1 / 16.5）。円環+分岐マップ・サイコロ・分岐選択・クイズ(WF2)・結果を集約。
// 状態は useGameStore に集約し、このコンポーネントは描画とイベント送出に専念する。

import { MAX_TURNS, useGameStore } from "@/store/gameStore";
import { BOARD } from "@/lib/game/generateMap";
import { shortestDistance } from "@/lib/game/engine";
import { RubyText } from "@/components/RubyText";
import type { Station } from "@/lib/game/types";

const HALF = 28; // 駅マス(56px)の半分

// 物件カテゴリ5色（DESIGN 16.6.2）
const CATEGORY_COLOR: Record<string, string> = {
  farm: "bg-lime-200 border-lime-400",
  sea: "bg-cyan-200 border-cyan-400",
  factory: "bg-amber-200 border-amber-400",
  city: "bg-sky-200 border-sky-500",
  tourism: "bg-violet-200 border-violet-400",
};

function stationColor(st: Station) {
  if (st.danger) return "bg-red-200 border-red-400 text-red-800";
  if (st.kind === "property" && st.property) {
    return CATEGORY_COLOR[st.property.category] ?? "bg-stone-200 border-stone-400";
  }
  if (st.kind === "start") return "bg-emerald-300 border-emerald-500";
  if (st.kind === "event") return "bg-yellow-200 border-yellow-400";
  return "bg-stone-200 border-stone-400";
}

export function GameBoard() {
  const {
    map,
    players,
    currentPlayerIndex,
    turn,
    phase,
    destinationId,
    lastDice,
    lastGainedCoin,
    activeQuiz,
    pendingBranch,
    lastAnswerCorrect,
    message,
    roll,
    chooseBranch,
    answer,
    endTurn,
    newGame,
  } = useGameStore();

  const current = players[currentPlayerIndex];
  const byId = new Map(map.stations.map((s) => [s.id, s]));

  // 二段階目的地の常時表示（DESIGN 4.6）: 目的地名・あと◯マス・年度末までのこり◯ターン
  const destination = byId.get(destinationId);
  const destDistance = destination ? shortestDistance(map, current.stationId, destinationId) : 0;
  const remainingTurns = MAX_TURNS - turn + 1;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 lg:flex-row">
      {/* 盤面 */}
      <div className="flex flex-1 flex-col items-center">
        {/* 二段階目的地の常時表示（DESIGN 4.6 画面上部） */}
        {destination && phase !== "finished" && (
          <div className="mb-3 flex w-full max-w-[560px] flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-rose-200 bg-white px-4 py-2 shadow">
            <div className="flex items-center gap-2 text-sm font-bold text-stone-700">
              <span className="text-lg">🚩</span>
              <span className="text-stone-500">つぎの もくてきち:</span>
              <RubyText text={destination.label} />
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-black text-rose-600">
                あと {destDistance}マス
              </span>
            </div>
            <div className="text-xs font-bold text-stone-500">
              ⏱ ねんどまつまで のこり {remainingTurns}ターン
            </div>
          </div>
        )}
        <div className="mb-3 flex items-center gap-3 text-sm font-bold text-stone-600">
          <span>
            {turn}／{MAX_TURNS}ターン ・{" "}
            <span className="text-rose-600">{current.nickname}</span>のばん
          </span>
          {phase === "idle" && (
            <button
              onClick={newGame}
              className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-stone-500 transition hover:bg-stone-100"
            >
              🗺 新しいマップ
            </button>
          )}
        </div>
        <div
          className="relative max-w-full rounded-3xl bg-[#efe3c7] shadow-inner"
          style={{ width: BOARD, height: BOARD }}
        >
          {/* 線路（グラフのエッジ）。分岐は fork から2方向に分かれて merge で合流する */}
          <svg
            className="pointer-events-none absolute inset-0"
            width={BOARD}
            height={BOARD}
            viewBox={`0 0 ${BOARD} ${BOARD}`}
          >
            {map.stations.flatMap((s) =>
              s.next.map((nid) => {
                const t = byId.get(nid);
                if (!t) return null;
                return (
                  <line
                    key={`${s.id}->${nid}`}
                    x1={s.pos.x}
                    y1={s.pos.y}
                    x2={t.pos.x}
                    y2={t.pos.y}
                    stroke="#cdb98c"
                    strokeWidth={8}
                    strokeLinecap="round"
                  />
                );
              }),
            )}
          </svg>

          {/* 駅マス */}
          {map.stations.map((st) => {
            const here = players.filter((p) => p.stationId === st.id);
            return (
              <div
                key={st.id}
                className={`absolute flex h-14 w-14 flex-col items-center justify-center rounded-lg border-2 px-0.5 text-center text-[10px] font-bold leading-tight shadow ${stationColor(st)} ${
                  st.id === destinationId ? "ring-4 ring-rose-400" : ""
                }`}
                style={{ left: st.pos.x - HALF, top: st.pos.y - HALF }}
              >
                {/* 目的地の旗（DESIGN 4.6 マップ上の目的地に大きな旗） */}
                {st.id === destinationId && (
                  <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce text-2xl drop-shadow">
                    🚩
                  </span>
                )}
                <RubyText text={st.label} />
                {here.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {here.map((p) => (
                      <span
                        key={p.userId}
                        className={`h-2.5 w-2.5 rounded-full border border-white ${
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
      <div className="flex w-full flex-col gap-4 lg:w-80">
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
          {lastGainedCoin < 0 && (
            <span className="ml-1 font-bold text-red-500">({lastGainedCoin})</span>
          )}
        </div>

        {/* 分岐の選択（DESIGN 4.5 どっちにいく？） */}
        {phase === "branch" && pendingBranch && (
          <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-3">
            <div className="mb-2 text-center text-base font-bold text-orange-700">
              どっちに いく？
            </div>
            <div className="grid grid-cols-2 gap-2">
              {pendingBranch.branch.options.map((opt) => (
                <button
                  key={opt.firstNextId}
                  onClick={() => chooseBranch(opt.firstNextId)}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 bg-white px-2 py-3 font-bold transition active:scale-[0.97] ${
                    opt.danger
                      ? "border-red-300 hover:bg-red-50"
                      : "border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <span className="text-sm text-stone-700">
                    {opt.route === "short" ? "🏃 ちかみち" : "🚶 とおまわり"}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    <RubyText text={opt.routeLabel} />まで {opt.steps}マス
                  </span>
                  <span
                    className={`text-xs font-black ${
                      opt.danger ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    {opt.danger ? "⚠ きけん" : "✓ あんぜん"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

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
        {phase === "finished" && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 text-center">
            <div className="mb-3 text-lg font-black text-amber-700">けっか はっぴょう 🏆</div>
            <ol className="mb-4 flex flex-col gap-2">
              {[...players]
                .sort((a, b) => b.score - a.score)
                .map((p, rank) => (
                  <li
                    key={p.userId}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold ${
                      rank === 0 ? "bg-amber-200 text-amber-900" : "bg-white text-stone-600"
                    }`}
                  >
                    <span>
                      {["🥇", "🥈", "🥉"][rank] ?? `${rank + 1}い`} {p.nickname}
                    </span>
                    <span>
                      {p.score}てん（物件{p.ownedPropertyIds.length}）
                    </span>
                  </li>
                ))}
            </ol>
            <button
              onClick={newGame}
              className="w-full rounded-2xl bg-rose-500 py-4 text-xl font-black text-white shadow-lg transition hover:bg-rose-600 active:scale-[0.97]"
            >
              🔄 もういちど あそぶ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
