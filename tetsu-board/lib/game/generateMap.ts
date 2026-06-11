// マップ生成（DESIGN 4.4 円環+少数分岐 を「日本地図」に対応づけて構築）。
// 駅は実在都市に固定（japanMap.ts の地理レイアウト）。同一シード=同一マップ。
// シードで変わるのは各分岐の「災難（ピンチ）パターン」のみ（目的地は store 側で決定）。
// engine（walk/分岐/BFS/目的地）はグラフ構造なので無改修で再利用できる。

import { BRANCHES, SPINE } from "./japanMap";
import { PROPERTY_POOL } from "./stationPool";
import { rngFromSeed } from "./rng";
import type { BranchInfo, GameMap, Property, RubyText, Station } from "./types";

const r = (base: string, ruby?: string): RubyText => ({ base, ruby });

// 盤面サイズ・装飾（GameBoard が読む）。japanMap の portrait 盤に合わせる。
export { BOARD_W, BOARD_H, REGIONS, FERRY_EDGES, LAND_PATHS, OKINAWA_PATH, SADO } from "./japanMap";

const PASS_PROP = 1; // 物件駅の通過コイン
const PASS_START = 2; // スタートの通過コイン
const PASS_PINCH = -20; // ピンチ（災難）通過で失うコイン

const PROP_BY_ID = new Map(PROPERTY_POOL.map((p) => [p.id, p]));
const prop = (id: string): Property => {
  const p = PROP_BY_ID.get(id);
  if (!p) throw new Error(`unknown property id: ${id}`);
  return p;
};

export function generateMap(seed: string): GameMap {
  const rng = rngFromSeed(seed);
  const stations: Station[] = [];
  const branches: BranchInfo[] = [];
  let idx = 0;
  const mk = (st: Omit<Station, "index">): Station => {
    const full = { ...st, index: idx++ } as Station;
    stations.push(full);
    return full;
  };

  // 都市駅を作る。danger のときは kind=event のピンチ駅（都市名は残すが物件・クイズなし）、
  // それ以外は物件駅。周回（spine）上なら loop=true。
  const cityStation = (propId: string, pos: { x: number; y: number }, loop: boolean, danger: boolean): Station => {
    const p = prop(propId);
    if (danger) {
      return mk({
        id: `st-${propId}`,
        kind: "event",
        label: p.name,
        sub: p.sub,
        next: [],
        pos,
        passCoin: PASS_PINCH,
        danger: true,
        loop,
      });
    }
    return mk({
      id: `st-${propId}`,
      kind: "property",
      label: p.name,
      sub: p.sub,
      next: [],
      pos,
      property: p,
      passCoin: PASS_PROP,
      loop,
    });
  };

  // 1. 周回（spine）駅。index 0 = スタート、1..N = 都市（物件）。
  const spine: Station[] = SPINE.map((node, i) => {
    if (i === 0) {
      return mk({
        id: "st-start",
        kind: "start",
        label: r("スタート"),
        sub: r("東京・東京駅", "とうきょう・とうきょうえき"),
        next: [],
        pos: { x: node.x, y: node.y },
        passCoin: PASS_START,
        loop: true,
      });
    }
    return cityStation(node.propId, { x: node.x, y: node.y }, true, false);
  });

  const spineById = new Map(spine.map((s) => [s.id, s]));
  const forkIds = new Set(BRANCHES.map((b) => b.forkId));

  // 2. 分岐（中継都市）を作って結線。short=1中継, long=2中継。fork/merge は駅 id 参照。
  for (const b of BRANCHES) {
    const fork = spineById.get(b.forkId)!;
    const merge = spineById.get(b.mergeId)!;

    // 災難パターン（DESIGN 4.5 4パターン）をシードで割当
    const pattern = (1 + Math.floor(rng() * 4)) as 1 | 2 | 3 | 4;
    const shortDanger = pattern === 1 || pattern === 3; // 近道&危険 / 両方危険
    const longDanger = pattern === 2 || pattern === 3; // 遠回り&危険 / 両方危険

    // 中継都市の列を fork→…→merge に結線。危険ルートは最後の中継をピンチにする。
    const buildChain = (cities: typeof b.short, dangerLast: boolean) => {
      const sts = cities.map((c, i) =>
        cityStation(c.propId, c, false, dangerLast && i === cities.length - 1),
      );
      sts.forEach((s, i) => {
        s.next = [i < sts.length - 1 ? sts[i + 1].id : merge.id];
      });
      return sts;
    };
    const shortSts = buildChain(b.short, shortDanger);
    const longSts = buildChain(b.long, longDanger);
    fork.next = [shortSts[0].id, longSts[0].id];

    branches.push({
      forkId: fork.id,
      pattern,
      options: [
        { firstNextId: shortSts[0].id, routeLabel: merge.label, route: "short", steps: b.short.length + 1, danger: shortDanger },
        { firstNextId: longSts[0].id, routeLabel: merge.label, route: "long", steps: b.long.length + 1, danger: longDanger },
      ],
    });
  }

  // 3. spine の直進エッジ（分岐 fork でない駅は次の spine 駅へ。最後は start へ）
  for (let i = 0; i < spine.length; i++) {
    if (forkIds.has(spine[i].id)) continue; // fork は分岐側で next 設定済み
    spine[i].next = [spine[(i + 1) % spine.length].id];
  }

  return { id: `map-${seed}`, seed, stations, branches };
}

/** 日時+ランダムから新規シード文字列を作る（児童モード: 毎回新規） */
export function newSeed(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
