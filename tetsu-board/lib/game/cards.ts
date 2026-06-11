// カード・災難デッキ（DESIGN 4.2 イベント駅 カードの駅🃏 / ピンチの駅⚠️ 災難キャラ）。
// 純データ + 純関数。シードを与えれば決定的に1枚引ける（サーバ移植しても同結果）。

import { rngFromSeed } from "./rng";
import type { Card, RubyText } from "./types";

const r = (base: string, ruby?: string): RubyText => ({ base, ruby });

/** ラッキーカード（スタート＝1周のごほうび等で引く） */
export const LUCKY_CARDS: Card[] = [
  { id: "c-bonus", kind: "lucky", emoji: "💰", title: r("ボーナス！"), desc: r("ぐうぜん おこづかいを もらった！"), coin: 30 },
  { id: "c-pickup", kind: "lucky", emoji: "🪙", title: r("ひろった！"), desc: r("みちで おかねを ひろった！"), coin: 20 },
  { id: "c-festival", kind: "lucky", emoji: "🎪", title: r("おまつり！"), desc: r("おまつりで たくさん うれた！"), coin: 25 },
  { id: "c-ticket", kind: "lucky", emoji: "🎟️", title: r("ただ切符", "ただきっぷ"), desc: r("ただで のれる 切符を ゲット！", "ただで のれる きっぷを ゲット！"), coin: 15 },
  { id: "c-daikichi", kind: "lucky", emoji: "🎍", title: r("大吉！", "だいきち！"), desc: r("おみくじで 大吉が でた！", "おみくじで だいきちが でた！"), coin: 40 },
];

/** 災難カード（ピンチの駅で引く。一部は災難キャラ憑き） */
export const DISASTER_CARDS: Card[] = [
  { id: "c-typhoon", kind: "disaster", emoji: "🌀", title: r("たいふう！"), desc: r("たいふうで 電車が とまった…", "たいふうで でんしゃが とまった…"), coin: -20 },
  { id: "c-quake", kind: "disaster", emoji: "🌊", title: r("じしん！"), desc: r("じしんで ちょっと そんを した…"), coin: -15 },
  { id: "c-oversleep", kind: "disaster", emoji: "😴", title: r("ねすごし！"), desc: r("ねすごして のりすごした…"), coin: -10 },
  { id: "c-lost", kind: "disaster", emoji: "👛", title: r("おとしもの！"), desc: r("さいふを おとした…"), coin: -15 },
  { id: "c-bonby", kind: "disaster", emoji: "👹", title: r("びんぼうがみ！"), desc: r("びんぼうがみが ついてきた！つぎの ターンに いたずらするぞ…"), coin: -10, bonby: true },
];

/** シードから1枚引く（決定的）。kind でデッキを選ぶ。 */
export function drawCard(seed: string, kind: Card["kind"]): Card {
  const deck = kind === "lucky" ? LUCKY_CARDS : DISASTER_CARDS;
  const rng = rngFromSeed(seed);
  return deck[Math.floor(rng() * deck.length)];
}

/** カードの効果（所持コイン増減・災難キャラ憑き）。純関数。 */
export function applyCard(card: Card): { coin: number; bonby: boolean } {
  return { coin: card.coin, bonby: card.bonby ?? false };
}
