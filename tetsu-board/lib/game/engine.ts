// ゲームロジック（純関数）。DESIGN 15.3 Server Action と同じ責務を副作用なしで実装。
// クライアントでも将来のサーバ実装でも共用できる。乱数だけ注入可能にして、
// サーバ移行時は crypto.randomInt(1,7)（DESIGN 15.3.2 不正防止）へ差し替える。

import { rngFromSeed } from "./rng";
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
  const passCoin = firstSt.passCoin;
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

/**
 * fromId から toId への最短歩数（BFS）。「あと◯マス」常時表示用（DESIGN 4.6）。
 * 分岐があるため next エッジのグラフ上で幅優先する。到達不能なら Infinity
 * （生成器の不変条件上は起きない）。
 */
export function shortestDistance(map: GameMap, fromId: string, toId: string): number {
  if (fromId === toId) return 0;
  const byId = indexById(map);
  const visited = new Set([fromId]);
  let frontier = [fromId];
  let dist = 0;
  while (frontier.length > 0) {
    dist++;
    const next: string[] = [];
    for (const id of frontier) {
      for (const nid of byId.get(id)!.next) {
        if (nid === toId) return dist;
        if (visited.has(nid)) continue;
        visited.add(nid);
        next.push(nid);
      }
    }
    frontier = next;
  }
  return Infinity;
}

/**
 * fromId から toId への最短経路（駅 id の並び。from を含み to を含む）。BFS。
 * 目的地への視覚誘導線（DESIGN 4.6「目的地まで線でつなぐ」）の描画用。
 * 分岐があるため複数経路のうち最短を返す。到達不能なら空配列。
 */
export function shortestPath(map: GameMap, fromId: string, toId: string): string[] {
  if (fromId === toId) return [fromId];
  const byId = indexById(map);
  const prev = new Map<string, string>();
  const visited = new Set([fromId]);
  let frontier = [fromId];
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const nid of byId.get(id)!.next) {
        if (visited.has(nid)) continue;
        visited.add(nid);
        prev.set(nid, id);
        if (nid === toId) {
          // 復元
          const path = [nid];
          let cur = nid;
          while (cur !== fromId) {
            cur = prev.get(cur)!;
            path.push(cur);
          }
          return path.reverse();
        }
        next.push(nid);
      }
    }
    frontier = next;
  }
  return [];
}

/**
 * 目的地駅にできる駅 id 一覧（DESIGN 4.6 小目的）。
 * 周回（loop）上の物件駅のみ：分岐の選択に依らず毎周必ず通るため、
 * どのルートを選んでも目的地に到達できることが保証される。
 */
export function destinationCandidates(map: GameMap): string[] {
  return map.stations.filter((s) => s.loop && s.kind === "property").map((s) => s.id);
}

/**
 * 目的地駅の決定（DESIGN 4.6「数ターンごとに目的地が変わる」）。
 * シード + 何代目か(seq) で決定的 → 将来サーバ移植してもクライアントと同じ結果になる。
 * excludeId（直前の目的地）は除外して連続選出を防ぐ。
 */
export function pickDestination(
  seed: string,
  seq: number,
  candidateIds: string[],
  excludeId?: string,
): string {
  const pool = candidateIds.filter((id) => id !== excludeId);
  const rng = rngFromSeed(`${seed}-dest-${seq}`);
  return pool[Math.floor(rng() * pool.length)];
}

/** スコア = 所持コイン + 所有物件価格の合計（DESIGN 決算の簡易版） */
export function calcScore(player: Player, map: GameMap): number {
  const owned = map.stations
    .filter((s) => s.property && player.ownedPropertyIds.includes(s.property.id))
    .reduce((sum, s) => sum + (s.property?.price ?? 0), 0);
  return player.coin + owned;
}
