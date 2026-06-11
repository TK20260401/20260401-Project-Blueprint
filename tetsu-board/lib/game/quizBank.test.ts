// quizBank.ts（教科別バンク + 出題選択 + 登録簿）の回帰テスト。

import { describe, expect, it } from "vitest";
import { QUIZ_BANK, pickQuiz, quizById } from "./quizBank";
import { PROPERTY_POOL } from "./stationPool";
import type { Quiz } from "./types";

const fallback: Quiz = {
  id: "fallback",
  subject: "geography",
  question: { base: "?" },
  choices: [
    { key: "A", text: { base: "a" } },
    { key: "B", text: { base: "b" } },
    { key: "C", text: { base: "c" } },
  ],
  answer: "A",
  hint: { base: "h" },
};

describe("pickQuiz", () => {
  it("該当する教科×難易度のバンク問題を決定的に返す", () => {
    const q1 = pickQuiz("seed-x", "math", "hard", fallback);
    const q2 = pickQuiz("seed-x", "math", "hard", fallback);
    expect(q1.id).toBe(q2.id);
    expect(q1.subject).toBe("math");
    expect(q1.difficulty).toBe("hard");
  });

  it("該当が無ければ fallback を返す（normal はバンクに置かない設計）", () => {
    expect(pickQuiz("s", "math", "normal", fallback).id).toBe("fallback");
  });

  it("excludeId は避ける（候補が複数あるとき）", () => {
    const first = pickQuiz("seed-y", "geography", "easy", fallback);
    const next = pickQuiz("seed-y", "geography", "easy", fallback, first.id);
    expect(next.id).not.toBe(first.id);
  });
});

describe("quizById（ふくしゅう再出題用の登録簿）", () => {
  it("バンクの問題を id で引ける", () => {
    expect(quizById(QUIZ_BANK[0].id)?.id).toBe(QUIZ_BANK[0].id);
  });

  it("各駅 themed クイズも id で引ける", () => {
    const themed = PROPERTY_POOL[0].quiz;
    expect(quizById(themed.id)?.id).toBe(themed.id);
  });

  it("存在しない id は undefined", () => {
    expect(quizById("no-such-id")).toBeUndefined();
  });
});
