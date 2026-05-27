// ゲームロジック（純関数）。DESIGN 15.3 Server Action と同じ責務を副作用なしで実装。
// クライアントでも将来のサーバ実装でも共用できる。乱数だけ注入可能にして、
// サーバ移行時は crypto.randomInt(1,7)（DESIGN 15.3.2 不正防止）へ差し替える。

import type { GameMap, Player, Quiz } from "./types";

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

/** サイコロ。乱数源を注入可能（テスト容易・サーバ移行容易） */
export function rollDice(rng: () => number = Math.random): DiceValue {
  return (Math.floor(rng() * 6) + 1) as DiceValue;
}

/**
 * 移動の結果。途中で分岐(next が複数)に達したら停止して選択を促す（DESIGN 4.5）。
 * - arrived: steps を歩き切って到着
 * - branch: 分岐元 forkId に到達。remaining 歩ぶん残して選択待ち
 */
export type WalkResult =
  | { type: "arrived"; stationId: string; passedIds: string[]; passCoin: number }
  | {
      type: "branch";
      forkId: string;
      remaining: number;
      passedIds: string[];
      passCoin: number;
    };

/** 駅 id から駅を引くマップ */
function indexById(map: GameMap): Map<string, GameMap["stations"][number]> {
  return new Map(map.stations.map((s) => [s.id, s]));
}

/**
 * fromId から steps 歩、next エッジを辿る。分岐(next.length>1)に居る状態で
 * まだ歩数が残っていれば、そこで停止して branch を返す。
 */
export function walk(map: GameMap, fromId: string, steps: number): WalkResult {
  const byId = indexById(map);
  let current = fromId;
  const passedIds: string[] = [];
  let passCoin = 0;
  for (let i = 0; i < steps; i++) {
    const cur = byId.get(current)!;
    if (cur.next.length > 1) {
      // 分岐：どちらへ進むか選んでもらう（DESIGN 4.5「どっちにいく?」）
      return { type: "branch", forkId: current, remaining: steps - i, passedIds, passCoin };
    }
    const nextId = cur.next[0];
    const nextSt = byId.get(nextId)!;
    if (i < steps - 1) {
      // 到着駅は通過に含めない（通過はコイン、到着はクイズ。DESIGN 4.7.3）
      passedIds.push(nextId);
      passCoin += nextSt.passCoin;
    }
    current = nextId;
  }
  return { type: "arrived", stationId: current, passedIds, passCoin };
}

/**
 * 分岐で方向を選んだあとの継続移動（DESIGN 4.5）。
 * fork から chosenFirstId へ1歩進み、残り remaining-1 歩を walk で続行。
 */
export function continueFromBranch(
  map: GameMap,
  chosenFirstId: string,
  remaining: number,
): WalkResult {
  const byId = indexById(map);
  const firstSt = byId.get(chosenFirstId)!;
  if (remaining <= 1) {
    // 選んだ先がちょうど到着
    return { type: "arrived", stationId: chosenFirstId, passedIds: [], passCoin: 0 };
  }
  // 選んだ先は通過扱い
  const passedIds = [chosenFirstId];
  let passCoin = firstSt.passCoin;
  const rest = walk(map, chosenFirstId, remaining - 1);
  return {
    ...rest,
    passedIds: [...passedIds, ...rest.passedIds],
    passCoin: passCoin + rest.passCoin,
  };
}

export type AnswerResult = {
  correct: boolean;
  coinDelta: number; // 物件取得で減るコイン or 不正解時 0
  acquiredPropertyId?: string;
};

/**
 * クイズ回答の判定と物件取得（DESIGN 15.3.3 submitAnswer の純ロジック部分）。
 * 正解かつ購入可能なら物件を取得し price 分のコインを支払う。
 */
export function judgeAnswer(
  player: Player,
  quiz: Quiz,
  selected: "A" | "B" | "C",
  propertyId: string,
  price: number,
): AnswerResult {
  const correct = selected === quiz.answer;
  if (!correct) return { correct: false, coinDelta: 0 };
  if (player.coin < price) return { correct: true, coinDelta: 0 }; // 正解だが資金不足
  if (player.ownedPropertyIds.includes(propertyId)) return { correct: true, coinDelta: 0 };
  return { correct: true, coinDelta: -price, acquiredPropertyId: propertyId };
}

/** スコア = 所持コイン + 所有物件価格の合計（DESIGN 決算の簡易版） */
export function calcScore(player: Player, map: GameMap): number {
  const owned = map.stations
    .filter((s) => s.property && player.ownedPropertyIds.includes(s.property.id))
    .reduce((sum, s) => sum + (s.property?.price ?? 0), 0);
  return player.coin + owned;
}
