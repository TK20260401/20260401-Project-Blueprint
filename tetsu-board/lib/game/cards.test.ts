// cards.ts（カード・災難デッキ）の回帰テスト。決定性とデッキ整合を固定する。

import { describe, expect, it } from "vitest";
import { DISASTER_CARDS, LUCKY_CARDS, applyCard, drawCard } from "./cards";

describe("drawCard", () => {
  it("同じシード・同じ種別なら同じカードを引く（決定的）", () => {
    expect(drawCard("seed-x", "lucky")).toBe(drawCard("seed-x", "lucky"));
    expect(drawCard("seed-x", "disaster")).toBe(drawCard("seed-x", "disaster"));
  });

  it("lucky は必ずラッキーデッキ、disaster は必ず災難デッキから引く", () => {
    for (let i = 0; i < 30; i++) {
      expect(LUCKY_CARDS).toContain(drawCard(`s-${i}`, "lucky"));
      expect(DISASTER_CARDS).toContain(drawCard(`s-${i}`, "disaster"));
    }
  });
});

describe("デッキ整合", () => {
  it("ラッキーは coin>=0、災難は coin<0", () => {
    for (const c of LUCKY_CARDS) {
      expect(c.kind).toBe("lucky");
      expect(c.coin).toBeGreaterThanOrEqual(0);
    }
    for (const c of DISASTER_CARDS) {
      expect(c.kind).toBe("disaster");
      expect(c.coin).toBeLessThan(0);
    }
  });

  it("災難キャラ(bonby)は災難デッキにだけ存在する", () => {
    expect(LUCKY_CARDS.some((c) => c.bonby)).toBe(false);
    expect(DISASTER_CARDS.some((c) => c.bonby)).toBe(true);
  });
});

describe("applyCard", () => {
  it("カードの coin と bonby をそのまま返す", () => {
    const lucky = LUCKY_CARDS[0];
    expect(applyCard(lucky)).toEqual({ coin: lucky.coin, bonby: false });
    const bonby = DISASTER_CARDS.find((c) => c.bonby)!;
    expect(applyCard(bonby)).toEqual({ coin: bonby.coin, bonby: true });
  });
});
