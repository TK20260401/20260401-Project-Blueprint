// generateMap.ts（マップ自動生成 E-25 / 4.5 αβγ分岐）の回帰テスト。
// 同一シード=同一マップの決定性と、盤の構造的な不変条件を固定する。

import { describe, expect, it } from "vitest";
import { generateMap } from "./generateMap";

describe("generateMap", () => {
  it("同じシードからは完全に同一のマップを生成する（決定的）", () => {
    expect(generateMap("seed-x")).toEqual(generateMap("seed-x"));
  });

  it("シードが違えば分岐パターンや配置が変わる", () => {
    expect(generateMap("seed-a")).not.toEqual(generateMap("seed-b"));
  });

  it("分岐は3つ、各分岐は2択（近道/遠回り）を持つ", () => {
    const map = generateMap("seed-x");
    expect(map.branches).toHaveLength(3);
    for (const b of map.branches) {
      expect(b.options).toHaveLength(2);
      expect(b.options.map((o) => o.route).sort()).toEqual(["long", "short"]);
      // 分岐元 fork は実在し next が2方向に分かれている
      const fork = map.stations.find((s) => s.id === b.forkId);
      expect(fork?.next).toHaveLength(2);
    }
  });

  it("全エッジの行き先が実在する駅を指す（孤立参照なし）", () => {
    const map = generateMap("seed-x");
    const ids = new Set(map.stations.map((s) => s.id));
    for (const s of map.stations) {
      for (const nid of s.next) expect(ids.has(nid)).toBe(true);
    }
  });

  it("スタート駅がちょうど1つ存在する", () => {
    const map = generateMap("seed-x");
    expect(map.stations.filter((s) => s.kind === "start")).toHaveLength(1);
  });

  it("周回(loop)は start + 物件駅13＝目的地候補が常に13駅ある（DESIGN 4.6・日本一周ループ）", () => {
    const map = generateMap("seed-x");
    const loop = map.stations.filter((s) => s.loop);
    expect(loop).toHaveLength(14);
    expect(loop.filter((s) => s.kind === "start")).toHaveLength(1);
    expect(loop.filter((s) => s.kind === "property")).toHaveLength(13);
  });

  it("全駅に実在駅・都道府県の副表示(sub)がある（DESIGN 4.1・地理学習）", () => {
    const map = generateMap("seed-x");
    for (const s of map.stations) {
      expect(s.sub?.base, `station=${s.id}`).toBeTruthy();
    }
  });
});
