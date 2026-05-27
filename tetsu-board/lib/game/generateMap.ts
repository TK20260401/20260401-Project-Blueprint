// マップ自動生成（DESIGN 4.3.1 E-25 + 4.4 円環+少数分岐 + 4.5 αβγ分岐）。
// 同一シード = 同一マップ（決定的）。
//
// 構造: start を含む7ノードの周回（spine）を長方形の縁に配置し、
// そのうち3辺を「分岐」に置き換える。各分岐は fork から
//   近道(short): fork → S → merge（2マス）
//   遠回り(long): fork → L1 → L2 → merge（3マス）
// の2ルートで merge に合流する。盤の外側へふくらむarcとして座標を与える。
// 4パターン(4.5)で各ルートに 安全/危険 を割り当て、危険マスは通過でコインを失う。

import { PROPERTY_POOL } from "./stationPool";
import { rngFromSeed, shuffle } from "./rng";
import type { BranchInfo, GameMap, Property, RubyText, Station } from "./types";

const r = (base: string, ruby?: string): RubyText => ({ base, ruby });

// 盤面ジオメトリ（px）。GameBoard はこの BOARD を読む。
export const BOARD = 560;
const INSET = 124; // 縁から周回トラックまでの距離
const CENTER = BOARD / 2;
const SIDE = BOARD - 2 * INSET; // 周回トラック1辺の長さ
const SPINE = 7; // 周回ノード数（start + 6）

type Pt = { x: number; y: number };
const I = (p: Pt): Pt => ({ x: Math.round(p.x), y: Math.round(p.y) });
const lerp = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});
const outward = (p: Pt): Pt => {
  const dx = p.x - CENTER;
  const dy = p.y - CENTER;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
};

/** 周回フラクション t(0..1) → トラック上の座標（中心）。t=0 は左上角、時計回り。 */
function perimeter(t: number): Pt {
  const d = t * 4 * SIDE;
  if (d < SIDE) return { x: INSET + d, y: INSET };
  if (d < 2 * SIDE) return { x: INSET + SIDE, y: INSET + (d - SIDE) };
  if (d < 3 * SIDE) return { x: INSET + SIDE - (d - 2 * SIDE), y: INSET + SIDE };
  return { x: INSET, y: INSET + SIDE - (d - 3 * SIDE) };
}

export function generateMap(seed: string): GameMap {
  const rng = rngFromSeed(seed);
  const pool = shuffle(PROPERTY_POOL, rng);
  let pi = 0;
  const takeProp = (): Property => pool[pi++];

  const stations: Station[] = [];
  const branches: BranchInfo[] = [];
  let idx = 0;
  const mk = (st: Omit<Station, "index">): Station => {
    const full = { ...st, index: idx++ } as Station;
    stations.push(full);
    return full;
  };

  // 1. 周回ノード（spine）を縁に配置。0=start、1..6=物件駅。
  const spine: Station[] = [];
  for (let k = 0; k < SPINE; k++) {
    const c = I(perimeter(k / SPINE));
    if (k === 0) {
      spine.push(
        mk({ id: "st-start", kind: "start", label: r("スタート"), next: [], pos: c, passCoin: 2 }),
      );
    } else {
      const p = takeProp();
      spine.push(
        mk({
          id: `st-${p.id}`,
          kind: "property",
          label: p.name,
          next: [],
          pos: c,
          property: p,
          passCoin: 1,
        }),
      );
    }
  }

  // 2. まず全エッジを直進で結線（k → k+1、最後は start へ）
  for (let k = 0; k < SPINE; k++) {
    spine[k].next = [spine[(k + 1) % SPINE].id];
  }

  // 3. 3辺を分岐に置き換える（隣り合わない (1→2),(3→4),(5→6)）
  const branchEdges: [number, number][] = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  let bseq = 0;
  for (const [fi, mi] of branchEdges) {
    bseq++;
    const fork = spine[fi];
    const merge = spine[mi];
    const fp = perimeter(fi / SPINE);
    const mp = perimeter(mi / SPINE);
    const mid = lerp(fp, mp, 0.5);
    const o = outward(mid);

    // パターン(4.5)を決め、安全/危険を割り当てる
    const pattern = (1 + Math.floor(rng() * 4)) as 1 | 2 | 3 | 4;
    const shortDanger = pattern === 1 || pattern === 3; // 近道&危険 / 両方危険
    const longDanger = pattern === 2 || pattern === 3; // 遠回り&危険 / 両方危険

    // 近道: S（mid から少し外側）
    const sPos = I({ x: mid.x + o.x * 50, y: mid.y + o.y * 50 });
    const S = shortDanger
      ? mk({
          id: `st-pinch-${bseq}s`,
          kind: "event",
          label: r("ピンチ"),
          next: [merge.id],
          pos: sPos,
          passCoin: -20,
          danger: true,
        })
      : (() => {
          const p = takeProp();
          return mk({
            id: `st-${p.id}`,
            kind: "property",
            label: p.name,
            next: [merge.id],
            pos: sPos,
            property: p,
            passCoin: 1,
          });
        })();

    // 遠回り: L1, L2（さらに外側のarc）
    const l1Base = lerp(fp, mp, 0.33);
    const l2Base = lerp(fp, mp, 0.67);
    const l1Pos = I({ x: l1Base.x + o.x * 90, y: l1Base.y + o.y * 90 });
    const l2Pos = I({ x: l2Base.x + o.x * 90, y: l2Base.y + o.y * 90 });
    const p1 = takeProp();
    const L1 = mk({
      id: `st-${p1.id}`,
      kind: "property",
      label: p1.name,
      next: [],
      pos: l1Pos,
      property: p1,
      passCoin: 1,
    });
    const L2 = longDanger
      ? mk({
          id: `st-pinch-${bseq}l`,
          kind: "event",
          label: r("ピンチ"),
          next: [merge.id],
          pos: l2Pos,
          passCoin: -20,
          danger: true,
        })
      : (() => {
          const p = takeProp();
          return mk({
            id: `st-${p.id}`,
            kind: "property",
            label: p.name,
            next: [merge.id],
            pos: l2Pos,
            property: p,
            passCoin: 1,
          });
        })();
    L1.next = [L2.id];

    // fork から2方向（近道・遠回りの順）
    fork.next = [S.id, L1.id];

    branches.push({
      forkId: fork.id,
      pattern,
      options: [
        { firstNextId: S.id, routeLabel: merge.label, route: "short", steps: 2, danger: shortDanger },
        { firstNextId: L1.id, routeLabel: merge.label, route: "long", steps: 3, danger: longDanger },
      ],
    });
  }

  return { id: `map-${seed}`, seed, stations, branches };
}

/** 日時+ランダムから新規シード文字列を作る（児童モード: 毎回新規） */
export function newSeed(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
