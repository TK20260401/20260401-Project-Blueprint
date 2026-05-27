// マップ自動生成（DESIGN 4.3.1 E-25）。テンプレ駆動 + 制約付きランダム。
// 同一シード = 同一マップ（決定的）。形は円環（グラフの特殊形）。分岐(4.5)は将来の拡張。
//
// 手順:
//  1. シードから決定的乱数を作る
//  2. プールから各カテゴリ均等に property 駅を選抜
//  3. property 駅をシャッフルして円環の並びを決める
//  4. イベント駅を「隣接禁止」制約で挿入
//  5. start を先頭に置き、next エッジで円環に結線

import { ALL_CATEGORIES, PROPERTY_POOL } from "./stationPool";
import { rngFromSeed, shuffle } from "./rng";
import type { GameMap, RubyText, Station } from "./types";

const r = (base: string, ruby?: string): RubyText => ({ base, ruby });

export type GenerateOptions = {
  /** 取得する property 駅の数（カテゴリ均等。既定10=各カテゴリ2） */
  propertyCount?: number;
  /** 挿入するイベント駅の数（既定3） */
  eventCount?: number;
};

export function generateMap(seed: string, opts: GenerateOptions = {}): GameMap {
  const propertyCount = opts.propertyCount ?? 10;
  const eventCount = opts.eventCount ?? 3;
  const rng = rngFromSeed(seed);

  // 2. カテゴリ均等に選抜
  const perCategory = Math.ceil(propertyCount / ALL_CATEGORIES.length);
  const selected = ALL_CATEGORIES.flatMap((cat) => {
    const inCat = PROPERTY_POOL.filter((p) => p.category === cat);
    return shuffle(inCat, rng).slice(0, perCategory);
  });
  // 端数調整して propertyCount に揃える
  const properties = shuffle(selected, rng).slice(0, propertyCount);

  // 3-4. property 駅を並べ、イベント駅を隣接禁止で挿入
  const ringLabels: { kind: "property" | "event"; propIndex?: number }[] =
    properties.map((_, i) => ({ kind: "property", propIndex: i }));

  // イベント挿入位置: property 列の隙間からランダムに、隣り合わないよう選ぶ
  const gapCount = ringLabels.length; // start 後〜各 property 間の隙間
  const gapOrder = shuffle(
    Array.from({ length: gapCount }, (_, i) => i),
    rng,
  );
  const usedGaps: number[] = [];
  for (const g of gapOrder) {
    if (usedGaps.length >= eventCount) break;
    // 隣接禁止: 直前/直後の gap が既に使われていないこと
    if (usedGaps.some((u) => Math.abs(u - g) <= 1)) continue;
    usedGaps.push(g);
  }
  usedGaps.sort((a, b) => b - a); // 後ろから挿入してインデックスずれを防ぐ
  for (const g of usedGaps) {
    ringLabels.splice(g + 1, 0, { kind: "event" });
  }

  // 5. start を先頭に、Station 配列を index 付きで構築
  const stations: Station[] = [];
  stations.push({
    id: "st-start",
    index: 0,
    kind: "start",
    label: r("スタート"),
    next: [], // 後で結線
    passCoin: 2,
  });

  let eventSeq = 0;
  ringLabels.forEach((slot, i) => {
    const index = i + 1;
    if (slot.kind === "property") {
      const prop = properties[slot.propIndex!];
      stations.push({
        id: `st-${prop.id}`,
        index,
        kind: "property",
        label: prop.name,
        next: [],
        property: prop,
        passCoin: 1,
      });
    } else {
      eventSeq += 1;
      stations.push({
        id: `st-event-${eventSeq}`,
        index,
        kind: "event",
        label: r("イベント"),
        next: [],
        passCoin: 2,
      });
    }
  });

  // 円環に結線（各駅 next = 次の1駅、最後 → start）
  const n = stations.length;
  for (let i = 0; i < n; i++) {
    stations[i].next = [stations[(i + 1) % n].id];
  }

  return { id: `map-${seed}`, seed, stations };
}

/** 日時+ランダムから新規シード文字列を作る（児童モード: 毎回新規） */
export function newSeed(): string {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}
