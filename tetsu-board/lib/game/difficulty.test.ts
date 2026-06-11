// difficulty.ts（動的難易度 E-24）の回帰テスト。DESIGN 7.3.2/7.3.3/7.3.4 を固定する。

import { describe, expect, it } from "vitest";
import { initDiff, manualAdjust, recordAnswer, step } from "./difficulty";
import type { DiffState } from "./difficulty";

const answers = (state: DiffState, seq: boolean[]) =>
  seq.reduce((s, c) => recordAnswer(s, c), state);

describe("recordAnswer（直近5問移動平均）", () => {
  it("5問中4問以上正解で1段階上がる", () => {
    const s = answers(initDiff("normal"), [true, true, true, true, false]);
    expect(s.level).toBe("hard");
    expect(s.recent).toEqual([]); // 変動後は窓リセット
  });

  it("5問中2問以下正解で1段階下がる", () => {
    const s = answers(initDiff("normal"), [true, false, false, false, true]);
    expect(s.level).toBe("easy");
  });

  it("5問中3問正解は現状維持（窓は保持して移動平均を続ける）", () => {
    const s = answers(initDiff("normal"), [true, true, true, false, false]);
    expect(s.level).toBe("normal");
    expect(s.recent).toHaveLength(5);
  });

  it("5問たまるまでは段階を動かさない", () => {
    const s = answers(initDiff("normal"), [true, true, true, true]);
    expect(s.level).toBe("normal");
  });

  it("上限（hard）を超えて上がらない", () => {
    const s = answers(initDiff("hard"), [true, true, true, true, true]);
    expect(s.level).toBe("hard");
  });

  it("下限（easy）を超えて下がらない", () => {
    const s = answers(initDiff("easy"), [false, false, false, false, false]);
    expect(s.level).toBe("easy");
  });
});

describe("教師の枠（caps）", () => {
  it("caps で上限を ふつう に制限すると hard へ上がらない", () => {
    let s = initDiff("normal");
    s = [true, true, true, true, true].reduce((x, c) => recordAnswer(x, c, { min: "easy", max: "normal" }), s);
    expect(s.level).toBe("normal");
  });
});

describe("manualAdjust（手動調整＝即1段階＋5問休止）", () => {
  it("+1 で1段階上がり、cooldown=5・窓リセット", () => {
    const s = manualAdjust(initDiff("normal"), 1);
    expect(s.level).toBe("hard");
    expect(s.cooldown).toBe(5);
    expect(s.recent).toEqual([]);
  });

  it("cooldown 中は自動判定が休止し、5問後に再開する", () => {
    let s = manualAdjust(initDiff("normal"), -1); // easy, cooldown5
    // 5問は休止：全問正解でも上がらない
    s = [true, true, true, true, true].reduce((x, c) => recordAnswer(x, c), s);
    expect(s.level).toBe("easy");
    expect(s.cooldown).toBe(0);
    // 再開後の5問で4問以上正解 → 上がる
    s = [true, true, true, true, false].reduce((x, c) => recordAnswer(x, c), s);
    expect(s.level).toBe("normal");
  });
});

describe("step", () => {
  it("範囲外には動かない", () => {
    expect(step("hard", 1)).toBe("hard");
    expect(step("easy", -1)).toBe("easy");
    expect(step("normal", 1)).toBe("hard");
  });
});
