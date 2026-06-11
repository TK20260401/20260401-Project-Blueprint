// engine.ts（移動・分岐・回答の純ロジック）の回帰テスト。
// 直近実装した分岐(DESIGN 4.5)の「歩数」と「通過コイン」の数え方を固定する。
// マップは generateMap に依存せず、手組みの最小 fixture で意図を明示する。

import { describe, expect, it } from "vitest";
import {
  walk,
  continueFromBranch,
  judgeAnswer,
  calcScore,
  shortestDistance,
  shortestPath,
  destinationCandidates,
  pickDestination,
} from "./engine";
import type { GameMap, Player, Property, Quiz, Station } from "./types";

// --- fixture ヘルパ --------------------------------------------------------
const r = (base: string) => ({ base });

function st(id: string, next: string[], passCoin: number, extra: Partial<Station> = {}): Station {
  return { id, index: 0, kind: "event", label: r(id), next, pos: { x: 0, y: 0 }, passCoin, ...extra };
}

// 直線ループ: A(start,+2) → B(+1) → C(+1) → A
const linear: GameMap = {
  id: "m",
  seed: "s",
  stations: [
    st("A", ["B"], 2, { kind: "start" }),
    st("B", ["C"], 1),
    st("C", ["A"], 1),
  ],
  branches: [],
};

// 分岐: X(+1) → F[fork] → 近道 S(+1)→M / 遠回り L1(+1)→L2(+1)→M、M(+1)→X
const branchMap: GameMap = {
  id: "m2",
  seed: "s2",
  stations: [
    st("X", ["F"], 1),
    st("F", ["S", "L1"], 5, { kind: "property" }),
    st("S", ["M"], 1),
    st("L1", ["L2"], 1),
    st("L2", ["M"], 1),
    st("M", ["X"], 1),
  ],
  branches: [
    {
      forkId: "F",
      pattern: 4,
      options: [
        { firstNextId: "S", routeLabel: r("M"), route: "short", steps: 2, danger: false },
        { firstNextId: "L1", routeLabel: r("M"), route: "long", steps: 3, danger: false },
      ],
    },
  ],
};

// --- walk ------------------------------------------------------------------
describe("walk", () => {
  it("到着駅は通過コインに含めず、途中駅ぶんだけ加算する", () => {
    const res = walk(linear, "A", 2); // A→B(通過)→C(到着)
    expect(res).toEqual({ type: "arrived", stationId: "C", passedIds: ["B"], passCoin: 1 });
  });

  it("1歩なら通過なしで隣に到着する", () => {
    const res = walk(linear, "A", 1);
    expect(res).toEqual({ type: "arrived", stationId: "B", passedIds: [], passCoin: 0 });
  });

  it("ループを1周すると全駅を通過してコインが貯まる", () => {
    const res = walk(linear, "A", 3); // A→B→C→A、到着Aは通過に含めない
    expect(res.type).toBe("arrived");
    if (res.type === "arrived") {
      expect(res.stationId).toBe("A");
      expect(res.passedIds).toEqual(["B", "C"]);
      expect(res.passCoin).toBe(2); // B(1)+C(1)
    }
  });

  it("分岐を通り抜ける手前で停止し、残り歩数を返す", () => {
    const res = walk(branchMap, "X", 3); // X→F で分岐に到達、残り2歩
    expect(res).toEqual({
      type: "branch",
      forkId: "F",
      remaining: 2,
      passedIds: ["F"],
      passCoin: 5, // F の passCoin は通過として加算
    });
  });

  it("分岐マスから振り出すと歩数を消費せず即選択待ちになる", () => {
    const res = walk(branchMap, "F", 4);
    expect(res).toEqual({ type: "branch", forkId: "F", remaining: 4, passedIds: [], passCoin: 0 });
  });
});

// --- continueFromBranch ----------------------------------------------------
describe("continueFromBranch", () => {
  it("近道(2歩)は S を通過して M に到着する", () => {
    const res = continueFromBranch(branchMap, "S", 2);
    expect(res).toEqual({ type: "arrived", stationId: "M", passedIds: ["S"], passCoin: 1 });
  });

  it("遠回り(3歩)は L1・L2 を通過して M に到着する", () => {
    const res = continueFromBranch(branchMap, "L1", 3);
    expect(res.type).toBe("arrived");
    if (res.type === "arrived") {
      expect(res.stationId).toBe("M");
      expect(res.passedIds).toEqual(["L1", "L2"]);
      expect(res.passCoin).toBe(2);
    }
  });

  it("残り1歩なら選んだ先にそのまま到着する（通過コインなし）", () => {
    const res = continueFromBranch(branchMap, "S", 1);
    expect(res).toEqual({ type: "arrived", stationId: "S", passedIds: [], passCoin: 0 });
  });
});

// --- judgeAnswer -----------------------------------------------------------
const quiz: Quiz = {
  id: "q",
  subject: "geography",
  question: r("?"),
  choices: [
    { key: "A", text: r("a") },
    { key: "B", text: r("b") },
    { key: "C", text: r("c") },
  ],
  answer: "B",
  hint: r("ヒント"),
};

const player = (over: Partial<Player> = {}): Player => ({
  userId: "u",
  nickname: "n",
  coin: 100,
  score: 0,
  stationId: "A",
  ownedPropertyIds: [],
  ...over,
});

describe("judgeAnswer", () => {
  it("正解かつ資金が足りれば物件を取得して価格ぶん支払う", () => {
    const res = judgeAnswer(player(), quiz, "B", "prop1", 60);
    expect(res).toEqual({ correct: true, coinDelta: -60, acquiredPropertyId: "prop1" });
  });

  it("不正解なら取得もコイン変動もなし", () => {
    expect(judgeAnswer(player(), quiz, "A", "prop1", 60)).toEqual({ correct: false, coinDelta: 0 });
  });

  it("正解でも資金不足なら取得しない", () => {
    const res = judgeAnswer(player({ coin: 30 }), quiz, "B", "prop1", 60);
    expect(res).toEqual({ correct: true, coinDelta: 0 });
  });

  it("すでに所有している物件は二重取得しない", () => {
    const res = judgeAnswer(player({ ownedPropertyIds: ["prop1"] }), quiz, "B", "prop1", 60);
    expect(res).toEqual({ correct: true, coinDelta: 0 });
  });
});

// --- calcScore -------------------------------------------------------------
describe("calcScore", () => {
  const prop = (id: string, price: number): Property => ({
    id,
    name: r(id),
    price,
    category: "city",
    quiz,
  });
  const scoreMap: GameMap = {
    id: "m3",
    seed: "s3",
    stations: [
      st("P1", [], 0, { kind: "property", property: prop("p1", 50) }),
      st("P2", [], 0, { kind: "property", property: prop("p2", 80) }),
    ],
    branches: [],
  };

  it("所持コイン + 所有物件価格の合計", () => {
    expect(calcScore(player({ coin: 100, ownedPropertyIds: ["p1", "p2"] }), scoreMap)).toBe(230);
  });

  it("未所有の物件は加算しない", () => {
    expect(calcScore(player({ coin: 100, ownedPropertyIds: ["p1"] }), scoreMap)).toBe(150);
  });
});

// --- shortestDistance（DESIGN 4.6 あと◯マス） --------------------------------
describe("shortestDistance", () => {
  it("同じ駅なら 0", () => {
    expect(shortestDistance(linear, "A", "A")).toBe(0);
  });

  it("直線ループでは進行方向の歩数を返す（一方通行なので逆走はしない）", () => {
    expect(shortestDistance(linear, "A", "C")).toBe(2); // A→B→C
    expect(shortestDistance(linear, "C", "B")).toBe(2); // C→A→B（ループを回る）
  });

  it("分岐があるときは短いほうのルートで数える", () => {
    // F→S→M（近道2歩）と F→L1→L2→M（遠回り3歩）→ 2 を返す
    expect(shortestDistance(branchMap, "F", "M")).toBe(2);
  });

  it("到達できない駅は Infinity", () => {
    const isolated: GameMap = {
      id: "m4",
      seed: "s4",
      stations: [st("A", [], 0), st("B", [], 0)],
      branches: [],
    };
    expect(shortestDistance(isolated, "A", "B")).toBe(Infinity);
  });
});

// --- shortestPath（DESIGN 4.6 目的地への誘導線） ----------------------------
describe("shortestPath", () => {
  it("同じ駅なら自分1つだけの経路", () => {
    expect(shortestPath(linear, "A", "A")).toEqual(["A"]);
  });

  it("from を含み to を含む駅 id の並びを返す", () => {
    expect(shortestPath(linear, "A", "C")).toEqual(["A", "B", "C"]);
  });

  it("分岐があるときは短いほうのルートの駅列を返す", () => {
    // F→S→M（近道）が F→L1→L2→M（遠回り）より短い
    expect(shortestPath(branchMap, "F", "M")).toEqual(["F", "S", "M"]);
  });

  it("到達できなければ空配列", () => {
    const isolated: GameMap = {
      id: "m6",
      seed: "s6",
      stations: [st("A", [], 0), st("B", [], 0)],
      branches: [],
    };
    expect(shortestPath(isolated, "A", "B")).toEqual([]);
  });
});

// --- destinationCandidates / pickDestination（DESIGN 4.6 目的地駅） ----------
describe("destinationCandidates", () => {
  it("周回(loop)上の物件駅だけが候補になる", () => {
    const m: GameMap = {
      id: "m5",
      seed: "s5",
      stations: [
        st("start", ["P1"], 0, { kind: "start", loop: true }),
        st("P1", ["E"], 0, { kind: "property", loop: true }),
        st("E", ["P2"], 0, { kind: "event", loop: true }), // 物件でない → 候補外
        st("P2", ["start"], 0, { kind: "property" }), // loop でない → 候補外
      ],
      branches: [],
    };
    expect(destinationCandidates(m)).toEqual(["P1"]);
  });
});

describe("pickDestination", () => {
  const candidates = ["P1", "P2", "P3", "P4", "P5", "P6"];

  it("同じシード・同じ世代なら同じ目的地を返す（決定的）", () => {
    expect(pickDestination("seed-x", 0, candidates)).toBe(pickDestination("seed-x", 0, candidates));
  });

  it("候補の中から選ばれる", () => {
    for (let seq = 0; seq < 10; seq++) {
      expect(candidates).toContain(pickDestination("seed-x", seq, candidates));
    }
  });

  it("直前の目的地（excludeId）は選ばれない", () => {
    for (let seq = 0; seq < 20; seq++) {
      expect(pickDestination("seed-x", seq, candidates, "P3")).not.toBe("P3");
    }
  });
});
