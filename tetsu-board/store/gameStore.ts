// ゲームセッションストア（DESIGN 16 状態管理 / Zustand 4ストアのうちの1つ）。
// 状態遷移はすべて engine.ts の純関数に委譲する薄い層。
// 将来は各アクションを Server Action 呼び出し + Realtime 購読に置き換える（境界はここ）。

import { create } from "zustand";
import { generateMap, newSeed } from "@/lib/game/generateMap";
import {
  type DiceValue,
  type WalkResult,
  calcScore,
  continueFromBranch,
  destinationCandidates,
  judgeAnswer,
  pickDestination,
  rollDice,
  walk,
} from "@/lib/game/engine";
import { applyCard, drawCard } from "@/lib/game/cards";
import {
  DEFAULT_CAPS,
  type DiffState,
  initDiff,
  manualAdjust,
  recordAnswer,
} from "@/lib/game/difficulty";
import { pickQuiz, quizById } from "@/lib/game/quizBank";
import { rngFromSeed } from "@/lib/game/rng";
import type {
  BranchInfo,
  Card,
  GameMap,
  GamePhase,
  Player,
  Quiz,
  Station,
  Subject,
} from "@/lib/game/types";

/** プレイヤー×教科ごとの難易度状態（DESIGN 7.3.2 教科別独立） */
type DiffMap = Record<string, Partial<Record<Subject, DiffState>>>;
const diffLevel = (diff: DiffMap, userId: string, subject: Subject) =>
  (diff[userId]?.[subject] ?? initDiff()).level;

type GameState = {
  seed: string;
  map: GameMap;
  players: Player[];
  currentPlayerIndex: number;
  turn: number;
  phase: GamePhase;

  // 二段階目的地（DESIGN 4.6 小目的）。到達でボーナス → 次の目的地へローテーション
  destinationId: string;
  destSeq: number; // 何代目の目的地か（シードと合わせて決定的に選出）

  // 直近アクションの一時表示用
  lastDice: DiceValue | null;
  lastGainedCoin: number; // 直近の通過コイン（負=ピンチで損失）
  activeQuiz: { quiz: Quiz; station: Station; review?: boolean } | null; // review=苦手のふくしゅう出題
  pendingBranch: { branch: BranchInfo; remaining: number } | null; // 分岐選択待ち
  lastAnswerCorrect: boolean | null;
  message: string;

  // 移動アニメ（DESIGN 4.7.4）。駒をマス単位で動かす演出用の一時状態。
  animPath: string[]; // この移動で通る駅 id の並び（現在地の次〜到着まで）
  pendingMove: WalkResult | null; // アニメ完了後に確定する移動結果
  rollToken: number; // roll のたびに増やしてサイコロ演出を再生
  moveToken: number; // moving 開始のたびに増やして駒移動演出を再生

  // カード・災難（DESIGN 4.2）。card フェーズで表示し closeCard で効果を適用。
  activeCard: Card | null;
  bonbyHolderId: string | null; // 災難キャラが憑いているプレイヤー（次の自ターン開始で発動）

  // 動的難易度（DESIGN 7.3 E-24）。プレイヤー×教科ごとに独立管理。
  diff: DiffMap;
  lastSubject: Subject | null; // 直近に回答したクイズの教科（手動調整の対象）

  // 苦手問題リスト（DESIGN 7.6 学習接続）。プレイヤーごとに不正解の quizId を保持し、
  // 後日「ふくしゅう」として再出題、正解で克服（除去）。将来 learning_records 相当。
  wrong: Record<string, string[]>;

  // actions
  start: (nicknames: string[], seed?: string) => void;
  newGame: () => void; // 新しいシードでマップ再生成（児童モード）
  roll: () => void;
  beginMove: () => void; // サイコロ演出後に駒移動を開始（rolling→moving）
  finishMove: () => void; // 駒移動アニメ完了後に着地を確定（moving→quiz/result/branch/card）
  closeCard: () => void; // カードの効果を適用して result へ（DESIGN 4.2）
  chooseBranch: (firstNextId: string) => void; // DESIGN 4.5 どっちにいく
  answer: (selected: "A" | "B" | "C") => void;
  adjustDifficulty: (dir: 1 | -1) => void; // 感情ベース手動調整（DESIGN 7.3.4）
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
const DEST_BONUS = 50; // 目的地1着到達ボーナス（DESIGN 4.6 小目的の簡易版）
const BONBY_BITE = 15; // 災難キャラが次ターン開始で奪うコイン（DESIGN 4.2 災難キャラ）
const REVIEW_RATE = 0.5; // 苦手があるとき ふくしゅう出題になる確率（DESIGN 7.6 学習接続）

const clampCoin = (c: number) => Math.max(0, c);

/** WalkResult から、駒がこの移動で通る駅 id の並び（到着 or fork まで）を作る */
function animPathOf(res: WalkResult): string[] {
  return res.type === "branch" ? [...res.passedIds, res.forkId] : [...res.passedIds, res.stationId];
}

/** 目的地まわりの現在状態（arrive に渡して到達判定・ローテーションする） */
type DestState = { seed: string; destinationId: string; destSeq: number };

/**
 * 移動の到着処理：コイン反映・到着駅に応じて quiz / result へ。roll と chooseBranch で共用。
 * 目的地（DESIGN 4.6）に到達したらボーナスを与え、次の目的地へローテーションする。
 */
function arrive(
  map: GameMap,
  players: Player[],
  idx: number,
  stationId: string,
  passCoin: number,
  dest: DestState,
) {
  const station = map.stations.find((s) => s.id === stationId)!;
  const isDest = stationId === dest.destinationId;
  const bonus = isDest ? DEST_BONUS : 0;
  const players2 = players.map((p, i) =>
    i === idx ? { ...p, stationId, coin: clampCoin(p.coin + passCoin + bonus) } : p,
  );
  // 到達したら次の目的地へ（直前の目的地は除外。シード+世代で決定的）
  const destSeq = isDest ? dest.destSeq + 1 : dest.destSeq;
  const destinationId = isDest
    ? pickDestination(dest.seed, destSeq, destinationCandidates(map), dest.destinationId)
    : dest.destinationId;
  const destPrefix = isDest ? `🚩 もくてきちに とうちゃく！ +${DEST_BONUS}コイン！ ` : "";

  if (station.kind === "property" && station.property) {
    return {
      players: players2,
      destinationId,
      destSeq,
      phase: "quiz" as const,
      activeQuiz: { quiz: station.property.quiz, station },
      lastAnswerCorrect: null,
      message: `${destPrefix}${station.label.base}にとうちゃく！クイズにこたえよう`,
    };
  }
  return {
    players: players2,
    destinationId,
    destSeq,
    phase: "result" as const,
    activeQuiz: null,
    lastAnswerCorrect: null,
    message:
      destPrefix +
      (station.danger
        ? "ピンチ！コインをすこし おとした…"
        : station.kind === "event"
          ? "イベントマス！"
          : station.kind === "start"
            ? "スタートに もどってきた！"
            : "なにもないマス"),
  };
}

const INITIAL_MAP = generateMap(INITIAL_SEED);

export const useGameStore = create<GameState>((set, get) => ({
  seed: INITIAL_SEED,
  map: INITIAL_MAP,
  players: DEFAULT_NICKNAMES.map(makePlayer),
  currentPlayerIndex: 0,
  turn: 1,
  phase: "idle",
  destinationId: pickDestination(INITIAL_SEED, 0, destinationCandidates(INITIAL_MAP)),
  destSeq: 0,
  lastDice: null,
  lastGainedCoin: 0,
  activeQuiz: null,
  pendingBranch: null,
  lastAnswerCorrect: null,
  message: "サイコロをふってね",
  animPath: [],
  pendingMove: null,
  rollToken: 0,
  moveToken: 0,
  activeCard: null,
  bonbyHolderId: null,
  diff: {},
  lastSubject: null,
  wrong: {},

  start: (nicknames, seed = INITIAL_SEED) => {
    const map = generateMap(seed);
    set({
      seed,
      map,
      players: nicknames.map(makePlayer),
      currentPlayerIndex: 0,
      turn: 1,
      phase: "idle",
      destinationId: pickDestination(seed, 0, destinationCandidates(map)),
      destSeq: 0,
      lastDice: null,
      lastGainedCoin: 0,
      activeQuiz: null,
      pendingBranch: null,
      lastAnswerCorrect: null,
      message: "サイコロをふってね",
      animPath: [],
      pendingMove: null,
      activeCard: null,
      bonbyHolderId: null,
      diff: {},
      lastSubject: null,
      wrong: {},
    });
  },

  newGame: () => {
    const { players } = get();
    get().start(
      players.length ? players.map((p) => p.nickname) : DEFAULT_NICKNAMES,
      newSeed(),
    );
  },

  roll: () => {
    const { phase, map, players, currentPlayerIndex, rollToken } = get();
    if (phase !== "idle") return;
    const dice = rollDice();
    const player = players[currentPlayerIndex];
    const res = walk(map, player.stationId, dice);
    // ここでは確定せず、サイコロ演出(rolling)→駒移動(moving)→着地(finishMove) の順に進める。
    set({
      lastDice: dice,
      phase: "rolling",
      pendingMove: res,
      animPath: animPathOf(res),
      lastGainedCoin: 0,
      activeQuiz: null,
      pendingBranch: null,
      lastAnswerCorrect: null,
      rollToken: rollToken + 1,
      message: "コロコロ…🎲",
    });
  },

  beginMove: () => {
    const { phase, moveToken } = get();
    if (phase !== "rolling") return; // サイコロ演出が終わってから駒を動かす
    set({ phase: "moving", moveToken: moveToken + 1, message: "しゅっぱつ！" });
  },

  finishMove: () => {
    const { phase, pendingMove, map, players, currentPlayerIndex, seed, destinationId, destSeq, turn } =
      get();
    if (phase !== "moving" || !pendingMove) return;
    const res = pendingMove;
    const player = players[currentPlayerIndex];

    if (res.type === "branch") {
      // 分岐に到達：駒は fork で停止。通過コインを反映し選択待ちへ（DESIGN 4.5）
      const players2 = players.map((p, i) =>
        i === currentPlayerIndex
          ? { ...p, stationId: res.forkId, coin: clampCoin(p.coin + res.passCoin) }
          : p,
      );
      const branch = map.branches.find((b) => b.forkId === res.forkId)!;
      set({
        players: players2,
        lastGainedCoin: res.passCoin,
        phase: "branch",
        pendingBranch: { branch, remaining: res.remaining },
        pendingMove: null,
        animPath: [],
        message: "わかれみち！どっちに いく？",
      });
      return;
    }

    const patch = arrive(map, players, currentPlayerIndex, res.stationId, res.passCoin, {
      seed,
      destinationId,
      destSeq,
    });

    // カード・災難（DESIGN 4.2）: イベント駅=さいなん / スタート=ラッキー を着地時に1枚引く。
    // クイズ駅(property)はクイズ優先なのでカードは引かない。
    const landed = map.stations.find((s) => s.id === res.stationId)!;
    if (patch.phase === "result" && (landed.kind === "event" || landed.kind === "start")) {
      const kind = landed.kind === "event" ? "disaster" : "lucky";
      const card = drawCard(`${seed}-card-${turn}-${currentPlayerIndex}-${landed.id}`, kind);
      set({
        ...patch,
        lastGainedCoin: res.passCoin,
        pendingMove: null,
        animPath: [],
        phase: "card",
        activeCard: card,
        message: card.kind === "lucky" ? "カードを ひいた！🃏" : "ピンチ！さいなん カード…",
      });
      return;
    }

    // クイズ駅の出題決定。優先度: ①苦手のふくしゅう(7.6) ②教科別難易度(7.3)。
    let activeQuiz: { quiz: Quiz; station: Station; review?: boolean } | null = patch.activeQuiz;
    if (patch.phase === "quiz" && activeQuiz) {
      const themed = activeQuiz.quiz;
      const wrongIds = get().wrong[player.userId] ?? [];
      const reviewRng = rngFromSeed(`${seed}-review-${turn}-${currentPlayerIndex}-${landed.id}`);
      const reviewQuiz =
        wrongIds.length > 0 && reviewRng() < REVIEW_RATE ? quizById(wrongIds[0]) : undefined;

      if (reviewQuiz) {
        // ふくしゅう（DESIGN 7.6）: 苦手リストの最古問題を再出題
        activeQuiz = { quiz: reviewQuiz, station: activeQuiz.station, review: true };
      } else {
        // 通常: 難易度に応じて themed / バンクから出題（DESIGN 7.3）
        const level = diffLevel(get().diff, player.userId, themed.subject);
        const quiz =
          level === "normal"
            ? themed
            : pickQuiz(
                `${seed}-q-${turn}-${currentPlayerIndex}-${landed.id}`,
                themed.subject,
                level,
                themed,
              );
        activeQuiz = { quiz, station: activeQuiz.station };
      }
    }

    set({
      lastGainedCoin: res.passCoin,
      pendingMove: null,
      animPath: [],
      ...patch,
      activeQuiz,
    });
  },

  closeCard: () => {
    const { activeCard, players, currentPlayerIndex, map, bonbyHolderId } = get();
    if (!activeCard) return;
    const { coin, bonby } = applyCard(activeCard);
    const me = players[currentPlayerIndex];
    const updated = players.map((p, i) => {
      if (i !== currentPlayerIndex) return p;
      const next = { ...p, coin: clampCoin(p.coin + coin) };
      return { ...next, score: calcScore(next, map) };
    });
    set({
      players: updated,
      activeCard: null,
      phase: "result",
      lastGainedCoin: coin,
      bonbyHolderId: bonby ? me.userId : bonbyHolderId,
      message: `${activeCard.emoji} ${activeCard.desc.base}（${coin >= 0 ? "+" : ""}${coin}コイン）`,
    });
  },

  chooseBranch: (firstNextId) => {
    const { phase, map, pendingBranch, moveToken } = get();
    if (phase !== "branch" || !pendingBranch) return;
    const res = continueFromBranch(map, firstNextId, pendingBranch.remaining);
    // 選んだ方向へ駒移動アニメを再生 → finishMove で着地（また分岐ならその時点で再度選択待ち）
    set({
      phase: "moving",
      pendingMove: res,
      animPath: animPathOf(res),
      pendingBranch: null,
      moveToken: moveToken + 1,
      message: "しゅっぱつ！",
    });
  },

  answer: (selected) => {
    const { activeQuiz, players, currentPlayerIndex, map, diff, wrong } = get();
    if (!activeQuiz) return;
    const { quiz, station, review } = activeQuiz;
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

    // 動的難易度（DESIGN 7.3.2）: クイズ正答のみを教科別に反映（カード/災難は対象外）。
    const subj = quiz.subject;
    const prevState = diff[player.userId]?.[subj] ?? initDiff();
    const nextState = recordAnswer(prevState, result.correct, DEFAULT_CAPS);
    const nextDiff: DiffMap = {
      ...diff,
      [player.userId]: { ...diff[player.userId], [subj]: nextState },
    };

    // 苦手問題リスト（DESIGN 7.6）: 不正解は追加、正解は除去（克服）。
    const list = wrong[player.userId] ?? [];
    const nextList = result.correct
      ? list.filter((id) => id !== quiz.id)
      : list.includes(quiz.id)
        ? list
        : [...list, quiz.id];
    const nextWrong = { ...wrong, [player.userId]: nextList };
    const mastered = review && result.correct; // ふくしゅうを正解＝克服

    set({
      players: updated,
      phase: "result",
      lastAnswerCorrect: result.correct,
      diff: nextDiff,
      lastSubject: subj,
      wrong: nextWrong,
      message: result.correct
        ? mastered
          ? `🎉 ふくしゅう せいかい！にがてを こくふくしたね！${
              result.acquiredPropertyId ? `${property.name.base}も手に入れた！` : ""
            }`
          : result.acquiredPropertyId
            ? `せいかい！${property.name.base}を手に入れた！`
            : "せいかい！でもコインがたりなかった…"
        : `ざんねん…ヒント: ${quiz.hint.base}（ふくしゅうリストに ついか）`,
    });
  },

  adjustDifficulty: (dir) => {
    const { diff, lastSubject, players, currentPlayerIndex } = get();
    if (!lastSubject) return;
    const userId = players[currentPlayerIndex].userId;
    const prevState = diff[userId]?.[lastSubject] ?? initDiff();
    const nextState = manualAdjust(prevState, dir, DEFAULT_CAPS);
    set({
      diff: { ...diff, [userId]: { ...diff[userId], [lastSubject]: nextState } },
      message:
        dir === 1
          ? "🔥 もっと がんばるモードに したよ！"
          : "😌 ゆっくり モードに したよ。あせらなくて だいじょうぶ",
    });
  },

  endTurn: () => {
    const { players, currentPlayerIndex, turn, map, bonbyHolderId } = get();
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
        pendingMove: null,
        animPath: [],
        lastDice: null,
        lastAnswerCorrect: null,
        message: `🏆 ${winner.nickname}のゆうしょう！（${winner.score}てん）`,
      });
      return;
    }

    // 災難キャラ（DESIGN 4.2）: 憑いているプレイヤーのターン開始で いたずら→立ち去る
    const nextPlayer = players[nextIndex];
    const bonbyBites = bonbyHolderId === nextPlayer.userId;
    const players2 = bonbyBites
      ? players.map((p) => {
          if (p.userId !== bonbyHolderId) return p;
          const next = { ...p, coin: clampCoin(p.coin - BONBY_BITE) };
          return { ...next, score: calcScore(next, map) };
        })
      : players;

    set({
      players: players2,
      currentPlayerIndex: nextIndex,
      turn: nextTurn,
      phase: "idle",
      lastDice: null,
      lastGainedCoin: bonbyBites ? -BONBY_BITE : 0,
      activeQuiz: null,
      pendingBranch: null,
      pendingMove: null,
      animPath: [],
      lastAnswerCorrect: null,
      bonbyHolderId: bonbyBites ? null : bonbyHolderId,
      message: bonbyBites
        ? `👹 びんぼうがみの いたずら！${nextPlayer.nickname}は ${BONBY_BITE}コイン とられた…`
        : "サイコロをふってね",
    });
  },
}));

export { MAX_TURNS, DEST_BONUS };
