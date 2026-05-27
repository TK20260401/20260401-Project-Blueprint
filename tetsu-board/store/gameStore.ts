// ゲームセッションストア（DESIGN 16 状態管理 / Zustand 4ストアのうちの1つ）。
// 状態遷移はすべて engine.ts の純関数に委譲する薄い層。
// 将来は各アクションを Server Action 呼び出し + Realtime 購読に置き換える（境界はここ）。

import { create } from "zustand";
import { generateMap, newSeed } from "@/lib/game/generateMap";
import {
  type DiceValue,
  calcScore,
  continueFromBranch,
  judgeAnswer,
  rollDice,
  walk,
} from "@/lib/game/engine";
import type { BranchInfo, GameMap, GamePhase, Player, Quiz, Station } from "@/lib/game/types";

type GameState = {
  seed: string;
  map: GameMap;
  players: Player[];
  currentPlayerIndex: number;
  turn: number;
  phase: GamePhase;

  // 直近アクションの一時表示用
  lastDice: DiceValue | null;
  lastGainedCoin: number; // 直近の通過コイン（負=ピンチで損失）
  activeQuiz: { quiz: Quiz; station: Station } | null;
  pendingBranch: { branch: BranchInfo; remaining: number } | null; // 分岐選択待ち
  lastAnswerCorrect: boolean | null;
  message: string;

  // actions
  start: (nicknames: string[], seed?: string) => void;
  newGame: () => void; // 新しいシードでマップ再生成（児童モード）
  roll: () => void;
  chooseBranch: (firstNextId: string) => void; // DESIGN 4.5 どっちにいく
  answer: (selected: "A" | "B" | "C") => void;
  endTurn: () => void;
};

const makePlayer = (nickname: string, i: number): Player => ({
  userId: `local-${i}`,
  nickname,
  coin: 200,
  score: 0,
  stationId: "st-start",
  ownedPropertyIds: [],
});

const DEFAULT_NICKNAMES = ["プレイヤー1", "プレイヤー2"];
const INITIAL_SEED = "tetsu-mvp"; // SSR 一致のため初期は固定シード
const MAX_TURNS = 5; // この周回数で年度末（決算）。DESIGN 4.6 大目的の簡易版

const clampCoin = (c: number) => Math.max(0, c);

/** 移動の到着処理：コイン反映・到着駅に応じて quiz / result へ。roll と chooseBranch で共用。 */
function arrive(
  map: GameMap,
  players: Player[],
  idx: number,
  stationId: string,
  passCoin: number,
) {
  const station = map.stations.find((s) => s.id === stationId)!;
  const players2 = players.map((p, i) =>
    i === idx ? { ...p, stationId, coin: clampCoin(p.coin + passCoin) } : p,
  );
  if (station.kind === "property" && station.property) {
    return {
      players: players2,
      phase: "quiz" as const,
      activeQuiz: { quiz: station.property.quiz, station },
      lastAnswerCorrect: null,
      message: `${station.label.base}にとうちゃく！クイズにこたえよう`,
    };
  }
  return {
    players: players2,
    phase: "result" as const,
    activeQuiz: null,
    lastAnswerCorrect: null,
    message: station.danger
      ? "ピンチ！コインをすこし おとした…"
      : station.kind === "event"
        ? "イベントマス！"
        : station.kind === "start"
          ? "スタートに もどってきた！"
          : "なにもないマス",
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  seed: INITIAL_SEED,
  map: generateMap(INITIAL_SEED),
  players: DEFAULT_NICKNAMES.map(makePlayer),
  currentPlayerIndex: 0,
  turn: 1,
  phase: "idle",
  lastDice: null,
  lastGainedCoin: 0,
  activeQuiz: null,
  pendingBranch: null,
  lastAnswerCorrect: null,
  message: "サイコロをふってね",

  start: (nicknames, seed = INITIAL_SEED) =>
    set({
      seed,
      map: generateMap(seed),
      players: nicknames.map(makePlayer),
      currentPlayerIndex: 0,
      turn: 1,
      phase: "idle",
      lastDice: null,
      lastGainedCoin: 0,
      activeQuiz: null,
      pendingBranch: null,
      lastAnswerCorrect: null,
      message: "サイコロをふってね",
    }),

  newGame: () => {
    const { players } = get();
    get().start(
      players.length ? players.map((p) => p.nickname) : DEFAULT_NICKNAMES,
      newSeed(),
    );
  },

  roll: () => {
    const { phase, map, players, currentPlayerIndex } = get();
    if (phase !== "idle") return;
    const dice = rollDice();
    const player = players[currentPlayerIndex];
    const res = walk(map, player.stationId, dice);

    if (res.type === "branch") {
      // 分岐に到達：駒を fork へ進め、選択待ちにする（DESIGN 4.5）
      const players2 = players.map((p, i) =>
        i === currentPlayerIndex
          ? { ...p, stationId: res.forkId, coin: clampCoin(p.coin + res.passCoin) }
          : p,
      );
      const branch = map.branches.find((b) => b.forkId === res.forkId)!;
      set({
        players: players2,
        lastDice: dice,
        lastGainedCoin: res.passCoin,
        phase: "branch",
        pendingBranch: { branch, remaining: res.remaining },
        activeQuiz: null,
        lastAnswerCorrect: null,
        message: "わかれみち！どっちに いく？",
      });
      return;
    }

    set({
      lastDice: dice,
      lastGainedCoin: res.passCoin,
      ...arrive(map, players, currentPlayerIndex, res.stationId, res.passCoin),
    });
  },

  chooseBranch: (firstNextId) => {
    const { phase, map, players, currentPlayerIndex, pendingBranch } = get();
    if (phase !== "branch" || !pendingBranch) return;
    const res = continueFromBranch(map, firstNextId, pendingBranch.remaining);

    if (res.type === "branch") {
      // 続きでまた分岐（まれ）：再度選択待ち
      const players2 = players.map((p, i) =>
        i === currentPlayerIndex
          ? { ...p, stationId: res.forkId, coin: clampCoin(p.coin + res.passCoin) }
          : p,
      );
      const branch = map.branches.find((b) => b.forkId === res.forkId)!;
      set({
        players: players2,
        lastGainedCoin: res.passCoin,
        pendingBranch: { branch, remaining: res.remaining },
        message: "また わかれみち！どっちに いく？",
      });
      return;
    }

    set({
      lastGainedCoin: res.passCoin,
      pendingBranch: null,
      ...arrive(map, players, currentPlayerIndex, res.stationId, res.passCoin),
    });
  },

  answer: (selected) => {
    const { activeQuiz, players, currentPlayerIndex, map } = get();
    if (!activeQuiz) return;
    const { quiz, station } = activeQuiz;
    const property = station.property!;
    const player = players[currentPlayerIndex];
    const result = judgeAnswer(player, quiz, selected, property.id, property.price);

    const updated = players.map((p, i) => {
      if (i !== currentPlayerIndex) return p;
      const coin = p.coin + result.coinDelta;
      const ownedPropertyIds = result.acquiredPropertyId
        ? [...p.ownedPropertyIds, result.acquiredPropertyId]
        : p.ownedPropertyIds;
      const next = { ...p, coin, ownedPropertyIds };
      return { ...next, score: calcScore(next, map) };
    });

    set({
      players: updated,
      phase: "result",
      lastAnswerCorrect: result.correct,
      message: result.correct
        ? result.acquiredPropertyId
          ? `せいかい！${property.name.base}を手に入れた！`
          : "せいかい！でもコインがたりなかった…"
        : `ざんねん…ヒント: ${quiz.hint.base}`,
    });
  },

  endTurn: () => {
    const { players, currentPlayerIndex, turn, map } = get();
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    const nextTurn = nextIndex === 0 ? turn + 1 : turn;

    // 年度末（決算）: 全員のスコアを確定し勝者を出す（DESIGN 4.6 / 決算簡易版）
    if (nextTurn > MAX_TURNS) {
      const settled = players.map((p) => ({ ...p, score: calcScore(p, map) }));
      const winner = settled.reduce((a, b) => (b.score > a.score ? b : a));
      set({
        players: settled,
        phase: "finished",
        activeQuiz: null,
        pendingBranch: null,
        lastDice: null,
        lastAnswerCorrect: null,
        message: `🏆 ${winner.nickname}のゆうしょう！（${winner.score}てん）`,
      });
      return;
    }

    set({
      currentPlayerIndex: nextIndex,
      turn: nextTurn,
      phase: "idle",
      lastDice: null,
      lastGainedCoin: 0,
      activeQuiz: null,
      pendingBranch: null,
      lastAnswerCorrect: null,
      message: "サイコロをふってね",
    });
  },
}));

export { MAX_TURNS };
