"use client";

// WF1 ゲーム画面（DESIGN 14.1 / 16.5）。円環+分岐マップ・サイコロ・分岐選択・クイズ(WF2)・結果を集約。
// 状態は useGameStore に集約し、このコンポーネントは描画とイベント送出に専念する。

import { useEffect, useState } from "react";
import { MAX_TURNS, useGameStore } from "@/store/gameStore";
import { BOARD } from "@/lib/game/generateMap";
import { shortestDistance, shortestPath } from "@/lib/game/engine";
import { RubyText } from "@/components/RubyText";
import type { Player, Quiz, Station } from "@/lib/game/types";

// 難易度の気分アイコン（DESIGN 7.3.1: 児童には段階名を出さず感情ベースで表す）
const MOOD_EMOJI: Record<"easy" | "normal" | "hard", string> = {
  easy: "😌",
  normal: "🙂",
  hard: "🔥",
};

const DICE_TICK_MS = 80; // サイコロの目が切り替わる間隔
const DICE_TICKS = 7; // 何回まわして止めるか
const STEP_MS = 220; // 駒が1マス進む間隔（DESIGN 4.7.4 移動アニメ）

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

// 地図風の背景レイヤー（海・大陸・海岸線・地形）。盤面を「ちず」に見せる装飾で、
// pointer-events-none・駅マスより後ろに描画される。決定的（毎回同じ形）。
// 大陸の輪郭は線路ループ(円環+外側にふくらむ分岐)をすべて陸地で覆うように大きめにとる。
const LAND_PATH =
  "M64 96 C120 52 200 70 268 52 C344 32 430 48 478 92 " +
  "C516 132 500 196 522 252 C540 332 506 396 474 446 " +
  "C420 512 332 500 256 514 C176 528 96 506 62 452 " +
  "C30 396 52 324 38 260 C24 184 36 132 64 96 Z";
// 海に浮かぶ小島（地図感を出す装飾）
const ISLETS: { x: number; y: number; r: number }[] = [
  { x: 502, y: 70, r: 14 },
  { x: 44, y: 486, r: 11 },
  { x: 510, y: 470, r: 9 },
];
// 地形の絵文字（陸地の内側・中央付近に散らす。駅マスとは重ならない位置）
const TERRAIN: { e: string; x: number; y: number; s: number }[] = [
  { e: "⛰️", x: 232, y: 196, s: 26 },
  { e: "🏔️", x: 296, y: 188, s: 22 },
  { e: "🌲", x: 196, y: 250, s: 18 },
  { e: "🌲", x: 348, y: 256, s: 18 },
  { e: "🌳", x: 250, y: 330, s: 18 },
  { e: "🏞️", x: 320, y: 330, s: 20 },
];

function MapBackdrop() {
  return (
    <>
      <svg
        className="pointer-events-none absolute inset-0"
        width={BOARD}
        height={BOARD}
        viewBox={`0 0 ${BOARD} ${BOARD}`}
        aria-hidden
      >
        {/* 海の波（うっすら） */}
        {[120, 240, 360, 480].map((y) =>
          [70, 170, 270, 370, 470].map((x) => (
            <path
              key={`w-${x}-${y}`}
              d={`M${x} ${y} q8 -7 16 0 q8 7 16 0`}
              fill="none"
              stroke="#bfe3f4"
              strokeWidth={3}
              strokeLinecap="round"
            />
          )),
        )}
        {/* 陸地（緑）＋砂浜の海岸線（太いストローク） */}
        <path d={LAND_PATH} fill="#dcebc2" stroke="#ecd9a4" strokeWidth={14} strokeLinejoin="round" />
        <path d={LAND_PATH} fill="none" stroke="#c7dca0" strokeWidth={2} strokeLinejoin="round" />
        {/* 小島 */}
        {ISLETS.map((i) => (
          <circle key={`i-${i.x}`} cx={i.x} cy={i.y} r={i.r} fill="#efe2bf" stroke="#e7d199" strokeWidth={5} />
        ))}
      </svg>
      {/* 地形の絵文字 + 方位（コンパス） */}
      <div className="pointer-events-none absolute inset-0">
        {TERRAIN.map((t, i) => (
          <span
            key={`t-${i}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 opacity-80"
            style={{ left: t.x, top: t.y, fontSize: t.s }}
          >
            {t.e}
          </span>
        ))}
        <span className="absolute right-2 top-2 text-2xl opacity-80">🧭</span>
        <span className="absolute right-3 top-9 text-[10px] font-black text-sky-700/70">N</span>
        <span className="absolute bottom-2 left-3 text-xl opacity-70">⛵</span>
      </div>
    </>
  );
}

// クイズの消去法パネル（DESIGN 7.4.2）。短タップで×（候補を消す）→1つにしぼって「これだ！」で確定。
// 親から key={quiz.id} で渡されるのでクイズが変わると再マウントされ、eliminated は自動リセットされる。
function QuizPanel({
  quiz,
  mood,
  onAnswer,
}: {
  quiz: Quiz;
  mood: string;
  onAnswer: (k: "A" | "B" | "C") => void;
}) {
  const [eliminated, setEliminated] = useState<Record<string, boolean>>({});
  const remaining = quiz.choices.filter((c) => !eliminated[c.key]);
  const canConfirm = remaining.length === 1;
  return (
    <div className="rounded-xl border-2 border-sky-300 bg-sky-50 p-4">
      <div className="mb-1 flex items-start gap-2 text-base font-bold text-stone-800">
        <span className="shrink-0" title="いまの むずかしさ">
          {mood}
        </span>
        <RubyText text={quiz.question} />
      </div>
      <div className="mb-3 text-[11px] font-medium text-stone-400">
        ちがうとおもうものを タップして けそう（消去法）
      </div>
      <div className="flex flex-col gap-2">
        {quiz.choices.map((c) => {
          const x = !!eliminated[c.key];
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setEliminated((e) => ({ ...e, [c.key]: !e[c.key] }))}
              className={`flex items-center rounded-lg border-2 px-4 py-3 text-left text-base font-bold transition active:scale-[0.98] ${
                x
                  ? "border-stone-200 bg-stone-100 text-stone-400 line-through"
                  : "border-stone-300 bg-white text-stone-700 hover:border-sky-400 hover:bg-sky-100"
              }`}
            >
              <span className={`mr-2 ${x ? "text-stone-300" : "text-sky-500"}`}>{c.key}.</span>
              <span className="flex-1">
                <RubyText text={c.text} />
              </span>
              {x && <span className="ml-2 text-lg text-red-400">✗</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setEliminated({})}
          className="rounded-lg border-2 border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-500 transition hover:bg-stone-100 active:scale-[0.98]"
        >
          ↺ もどす
        </button>
        <button
          type="button"
          onClick={() => canConfirm && onAnswer(remaining[0].key)}
          disabled={!canConfirm}
          className={`flex-1 rounded-lg border-2 py-2 text-base font-black transition active:scale-[0.98] ${
            canConfirm
              ? "border-sky-500 bg-sky-500 text-white hover:bg-sky-600"
              : "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
          }`}
        >
          {canConfirm ? "✓ これだ！" : `あと ${remaining.length - 1}こ けそう`}
        </button>
      </div>
    </div>
  );
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
    animPath,
    rollToken,
    moveToken,
    activeCard,
    bonbyHolderId,
    diff,
    roll,
    beginMove,
    finishMove,
    chooseBranch,
    answer,
    closeCard,
    adjustDifficulty,
    endTurn,
    newGame,
  } = useGameStore();

  const current = players[currentPlayerIndex];
  const byId = new Map(map.stations.map((s) => [s.id, s]));

  // サイコロ演出（DESIGN 4.7.4）。rolling の間だけ目をパラパラ回し、止まったら駒移動へ。
  const [diceFace, setDiceFace] = useState<number | null>(null);
  // 駒移動アニメ。moving の間、アクティブプレイヤーの駒を animPath に沿って1マスずつ進める。
  const [animStationId, setAnimStationId] = useState<string | null>(null);
  // 実在駅・都道府県の副表示（DESIGN 4.1）。タップで切替（C層配慮で OFF も可）。
  const [showSub, setShowSub] = useState(true);

  useEffect(() => {
    if (phase !== "rolling") return;
    let ticks = 0;
    const id = setInterval(() => {
      setDiceFace(1 + Math.floor(Math.random() * 6));
      if (++ticks >= DICE_TICKS) {
        clearInterval(id);
        setDiceFace(null);
        beginMove();
      }
    }, DICE_TICK_MS);
    return () => clearInterval(id);
    // rollToken が増えるたび（＝サイコロを振るたび）に1回だけ再生する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rollToken]);

  useEffect(() => {
    if (phase !== "moving" || animPath.length === 0) return;
    // 1マスぶん待ってから animPath[0] へ（最初の STEP_MS は出発駅に駒が留まる）。
    // setState はインターバル内（=非同期）でのみ呼び、エフェクト本体では呼ばない。
    let i = -1;
    const id = setInterval(() => {
      i++;
      if (i >= animPath.length) {
        clearInterval(id);
        setAnimStationId(null);
        finishMove();
      } else {
        setAnimStationId(animPath[i]);
      }
    }, STEP_MS);
    return () => clearInterval(id);
    // moveToken が増えるたび（＝駒移動開始のたび）に1回だけ再生する
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveToken]);

  // 駒の表示位置：移動中のアクティブプレイヤーだけ animStationId、ほかは論理位置。
  const pieceStationId = (p: Player) =>
    p.userId === current.userId && phase === "moving" && animStationId
      ? animStationId
      : p.stationId;

  // 二段階目的地の常時表示（DESIGN 4.6）: 目的地名・あと◯マス・年度末までのこり◯ターン
  const destination = byId.get(destinationId);
  const destDistance = destination ? shortestDistance(map, current.stationId, destinationId) : 0;
  const remainingTurns = MAX_TURNS - turn + 1;

  // 現在地 → 🚩目的地 の視覚誘導線（DESIGN 4.6）。最短経路の駅座標をつないだ折れ線。
  const routeIds = destination ? shortestPath(map, current.stationId, destinationId) : [];
  const routePoints = routeIds
    .map((id) => byId.get(id))
    .filter((s): s is Station => !!s)
    .map((s) => `${s.pos.x},${s.pos.y}`)
    .join(" ");

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
          <button
            onClick={() => setShowSub((v) => !v)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              showSub
                ? "border-sky-300 bg-sky-50 text-sky-600"
                : "border-stone-300 bg-white text-stone-400 hover:bg-stone-100"
            }`}
          >
            📍 じつざい駅 {showSub ? "ON" : "OFF"}
          </button>
        </div>
        <div
          className="relative max-w-full overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 to-cyan-100 shadow-inner"
          style={{ width: BOARD, height: BOARD }}
        >
          {/* 地図風の背景（海・大陸・海岸線・地形）。駅・線路より後ろ */}
          <MapBackdrop />

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

            {/* 目的地への視覚誘導線（DESIGN 4.6）。現在地→🚩を点線でハイライト */}
            {phase !== "finished" && routeIds.length > 1 && (
              <polyline
                points={routePoints}
                fill="none"
                stroke="#fb7185"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 12"
                className="animate-pulse"
                opacity={0.9}
              />
            )}
          </svg>

          {/* 駅マス */}
          {map.stations.map((st) => {
            const here = players.filter((p) => pieceStationId(p) === st.id);
            return (
              <div
                key={st.id}
                title={
                  st.property?.sub ? `${st.label.base}（${st.property.sub.base}）` : st.label.base
                }
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
                {/* 実在駅・都道府県の副表示（DESIGN 4.1。ON のときだけ） */}
                {showSub && st.property?.sub && (
                  <span className="w-full truncate text-[7px] font-medium leading-none text-stone-600/90">
                    {st.property.sub.base}
                  </span>
                )}
                {here.length > 0 && (
                  <div className="mt-0.5 flex gap-0.5">
                    {here.map((p) => (
                      <span
                        key={p.userId}
                        className={`rounded-full border border-white shadow ${
                          p.userId === current.userId
                            ? "h-3.5 w-3.5 bg-rose-500"
                            : "h-2.5 w-2.5 bg-blue-500"
                        } ${p.userId === current.userId && phase === "moving" ? "animate-bounce" : ""}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* 中央：サイコロ表示（rolling 中はパラパラ回る） */}
          <div
            className={`absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-2xl bg-white text-4xl font-black text-stone-700 shadow-lg transition-transform ${
              phase === "rolling" ? "scale-110 rotate-6" : ""
            }`}
          >
            {phase === "rolling" ? (diceFace ?? "?") : (lastDice ?? "?")}
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
              <div className="flex items-center gap-1 text-xs font-bold text-stone-500">
                {p.nickname}
                {bonbyHolderId === p.userId && (
                  <span title="びんぼうがみが ついている" className="animate-pulse">
                    👹
                  </span>
                )}
              </div>
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

        {/* クイズ（WF2）＝消去法UI（DESIGN 7.4.2）。key でクイズごとに状態リセット */}
        {phase === "quiz" && activeQuiz && (
          <QuizPanel
            key={activeQuiz.quiz.id}
            quiz={activeQuiz.quiz}
            mood={MOOD_EMOJI[diff[current.userId]?.[activeQuiz.quiz.subject]?.level ?? "normal"]}
            onAnswer={answer}
          />
        )}

        {/* カード・災難（DESIGN 4.2 カードの駅/ピンチの駅） */}
        {phase === "card" && activeCard && (
          <div
            className={`flex flex-col items-center gap-2 rounded-2xl border-4 p-4 text-center shadow-lg ${
              activeCard.kind === "lucky"
                ? "border-amber-300 bg-amber-50"
                : "border-purple-300 bg-purple-50"
            }`}
          >
            <div className="animate-bounce text-5xl">{activeCard.emoji}</div>
            <div
              className={`text-lg font-black ${
                activeCard.kind === "lucky" ? "text-amber-700" : "text-purple-700"
              }`}
            >
              <RubyText text={activeCard.title} />
            </div>
            <div className="text-sm font-medium text-stone-600">
              <RubyText text={activeCard.desc} />
            </div>
            <div
              className={`text-xl font-black ${
                activeCard.coin >= 0 ? "text-amber-600" : "text-red-500"
              }`}
            >
              {activeCard.coin >= 0 ? "+" : ""}
              {activeCard.coin}コイン
            </div>
            <button
              onClick={closeCard}
              className="mt-1 w-full rounded-xl bg-stone-700 py-3 text-lg font-black text-white shadow transition hover:bg-stone-800 active:scale-[0.98]"
            >
              OK ▶
            </button>
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
          <div className="flex flex-col gap-2">
            {/* 感情ベースの手動むずかしさ調整（DESIGN 7.3.1/7.3.4。段階名は出さない） */}
            {lastAnswerCorrect !== null && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => adjustDifficulty(-1)}
                  className="flex-1 rounded-xl border-2 border-sky-200 bg-sky-50 py-2 text-sm font-bold text-sky-700 transition hover:bg-sky-100 active:scale-[0.98]"
                >
                  😌 ゆっくり やりたい
                </button>
                <button
                  type="button"
                  onClick={() => adjustDifficulty(1)}
                  className="flex-1 rounded-xl border-2 border-orange-200 bg-orange-50 py-2 text-sm font-bold text-orange-700 transition hover:bg-orange-100 active:scale-[0.98]"
                >
                  🔥 もっと がんばりたい
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={endTurn}
              className="rounded-2xl bg-emerald-500 py-5 text-2xl font-black text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.97]"
            >
              {lastAnswerCorrect === false ? "つぎへ" : "つぎのプレイヤーへ"} ▶
            </button>
          </div>
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
