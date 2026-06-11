// 動的難易度エンジン（DESIGN 7.3 E-24 確定アルゴリズム）。純関数。
// ・直近5問の正解率で判定（4以上↑ / 2以下↓ / 3は維持）
// ・3段階（やさしい/ふつう/むずかしい）、教科別に独立管理
// ・教師の上限・下限「枠」でレベル変動を制限（7.3.3）
// ・ユーザ手動調整は即1段階＋自動判定を5問休止→5問後に再開（7.3.4）
// 将来のサーバ移植（player_subject_difficulty テーブル相当）でもそのまま使える。

import type { Difficulty } from "./types";

export const DIFFICULTIES = ["easy", "normal", "hard"] as const;

/** 教師の枠（DESIGN 7.3.3）。デフォルトは全範囲。 */
export type DiffCaps = { min: Difficulty; max: Difficulty };
export const DEFAULT_CAPS: DiffCaps = { min: "easy", max: "hard" };

/** 教科ごとの難易度状態。recent=直近の正誤（最大5）、cooldown=自動判定の休止残り。 */
export type DiffState = { level: Difficulty; recent: boolean[]; cooldown: number };

export const initDiff = (level: Difficulty = "normal"): DiffState => ({
  level,
  recent: [],
  cooldown: 0,
});

const idx = (d: Difficulty): number => DIFFICULTIES.indexOf(d);
const trim5 = (a: boolean[]): boolean[] => (a.length > 5 ? a.slice(a.length - 5) : a);

/** caps の範囲に収める */
export function clampLevel(level: Difficulty, caps: DiffCaps = DEFAULT_CAPS): Difficulty {
  const i = Math.max(idx(caps.min), Math.min(idx(caps.max), idx(level)));
  return DIFFICULTIES[i];
}

/** dir(+1/-1)ぶん段階を動かし、caps に収める */
export function step(level: Difficulty, dir: 1 | -1, caps: DiffCaps = DEFAULT_CAPS): Difficulty {
  const moved = DIFFICULTIES[Math.max(0, Math.min(2, idx(level) + dir))];
  return clampLevel(moved, caps);
}

/**
 * 1問回答を反映（DESIGN 7.3.2 移動平均型）。
 * cooldown 中（手動調整直後）は履歴をためつつ自動判定しない＝5問後に再開（7.3.4）。
 * 5問たまったら 4以上↑ / 2以下↓ / 3は維持。段階が変わったら窓をリセット。
 */
export function recordAnswer(
  state: DiffState,
  correct: boolean,
  caps: DiffCaps = DEFAULT_CAPS,
): DiffState {
  const recent = trim5([...state.recent, correct]);
  if (state.cooldown > 0) {
    return { ...state, recent, cooldown: state.cooldown - 1 };
  }
  if (recent.length < 5) return { ...state, recent };
  const score = recent.filter(Boolean).length;
  if (score >= 4) return { level: step(state.level, 1, caps), recent: [], cooldown: 0 };
  if (score <= 2) return { level: step(state.level, -1, caps), recent: [], cooldown: 0 };
  return { ...state, recent }; // 3問正解＝現状維持（窓は保持して移動平均を続ける）
}

/**
 * ユーザの手動調整（DESIGN 7.3.4）。即1段階変動し、自動判定を5問休止する。
 * dir=+1「もっとがんばりたい」/ dir=-1「ゆっくりやりたい」。
 */
export function manualAdjust(
  state: DiffState,
  dir: 1 | -1,
  caps: DiffCaps = DEFAULT_CAPS,
): DiffState {
  return { level: step(state.level, dir, caps), recent: [], cooldown: 5 };
}
