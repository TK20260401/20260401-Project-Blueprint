// stationPool.ts（駅マスタープール）の整合テスト。データ拡充時の事故を防ぐ。

import { describe, expect, it } from "vitest";
import { ALL_CATEGORIES, PROPERTY_POOL } from "./stationPool";

describe("PROPERTY_POOL", () => {
  it("各カテゴリに少なくとも10駅ある（DESIGN 4.2 拡充）", () => {
    for (const cat of ALL_CATEGORIES) {
      const n = PROPERTY_POOL.filter((p) => p.category === cat).length;
      expect(n, `category=${cat}`).toBeGreaterThanOrEqual(10);
    }
  });

  it("物件 id・クイズ id は重複しない", () => {
    const pids = PROPERTY_POOL.map((p) => p.id);
    expect(new Set(pids).size).toBe(pids.length);
    const qids = PROPERTY_POOL.map((p) => p.quiz.id);
    expect(new Set(qids).size).toBe(qids.length);
  });

  it("全駅に実在駅・都道府県の副表示(sub)がある（DESIGN 4.1）", () => {
    for (const p of PROPERTY_POOL) {
      expect(p.sub?.base, `property=${p.id}`).toBeTruthy();
    }
  });

  it("各クイズは3択で answer が選択肢に存在する", () => {
    for (const p of PROPERTY_POOL) {
      const q = p.quiz;
      expect(q.choices, `quiz=${q.id}`).toHaveLength(3);
      expect(q.choices.map((c) => c.key)).toContain(q.answer);
    }
  });
});
