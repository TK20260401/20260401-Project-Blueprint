/**
 * PR動画テキスト集約（ユーザーが差し替えやすいよう一元化）
 */
export const COPY = {
  brand: {
    title: "おこづかいクエスト",
    tagline: "お手伝いをクエストに",
    url: "otetsudai-bank-beta.vercel.app",
  },
  scenes: {
    problem: {
      headline: "お手伝い、どう教える？",
      sub: "報酬も、しつけも、むずかしい",
    },
    quest: {
      headline: "お手伝い = クエスト",
      bullet1: "毎日のタスクを",
      bullet2: "冒険に変える",
    },
    split: {
      headline: "稼ぐだけじゃない",
      labels: {
        spend: "つかう",
        save: "ためる",
        invest: "ふやす",
      },
      sub: "3分割で金融リテラシー",
    },
    levelPet: {
      headline: "育てて、まもる",
      sub: "レベル・ペット・仲間",
    },
    cta: {
      headline: "いますぐ はじめよう",
      button: "無料ではじめる",
      note: "QRコードから登録",
    },
  },
} as const;
