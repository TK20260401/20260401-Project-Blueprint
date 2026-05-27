// ゲームロジック（純関数）。DESIGN 15.3 Server Action と同じ責務を副作用なしで実装。
// クライアントでも将来のサーバ実装でも共用できる。乱数だけ注入可能にして、
// サーバ移行時は crypto.randomInt(1,7)（DESIGN 15.3.2 不正防止）へ差し替える。

import type { GameMap, Player, Quiz } from "./types";

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

/** サイコロ。乱数源を注入可能（テスト容易・サーバ移行容易） */
export function rollDice(rng: () => number = Math.random): DiceValue {
  return (Math.floor(rng() * 6) + 1) as DiceValue;
}

export type MoveResult = {
  toIndex: number;
  passedStationIds: string[]; // 通過した駅（到着駅は含まない）
  passCoin: number; // 通過コインの合計（DESIGN 15.3.2）
};

/** 円環上の移動を計算。fromIndex から steps 進む。 */
export function move(map: GameMap, fromIndex: number, steps: DiceValue): MoveResult {
  const n = map.stations.length;
  const passedStationIds: string[] = [];
  let passCoin = 0;
  for (let i = 1; i < steps; i++) {
    const idx = (fromIndex + i) % n;
    const st = map.stations[idx];
    passedStationIds.push(st.id);
    passCoin += st.passCoin;
  }
  const toIndex = (fromIndex + steps) % n;
  return { toIndex, passedStationIds, passCoin };
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
