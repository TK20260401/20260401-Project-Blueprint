// MVP サンプルコンテンツ（DESIGN 16.9 MVP最小素材セット相当のデータ版）
// 鉄道テーマの円環マップ。駅マスに物件＋教科横断クイズを紐づける。
// 将来は Supabase の maps / properties / quizzes テーブルから取得する（手戻りなしの境界）。

import type { GameMap, Station } from "./types";

const r = (base: string, ruby?: string) => ({ base, ruby });

// 円環の駅定義（東海道をモチーフにした学習用ダミー）。
// property マスは「物件名・価格・カテゴリ・取得クイズ」を持つ。
const stations: Station[] = [
  {
    id: "st-0",
    index: 0,
    kind: "start",
    label: r("スタート"),
    passCoin: 2,
  },
  {
    id: "st-1",
    index: 1,
    kind: "property",
    label: r("東京", "とうきょう"),
    passCoin: 1,
    property: {
      id: "pr-tokyo",
      name: r("東京駅", "とうきょうえき"),
      price: 100,
      category: "station",
      quiz: {
        id: "qz-tokyo",
        subject: "geography",
        question: r("日本の首都はどこでしょう？", "にほんのしゅとはどこでしょう？"),
        choices: [
          { key: "A", text: r("大阪", "おおさか") },
          { key: "B", text: r("東京", "とうきょう") },
          { key: "C", text: r("京都", "きょうと") },
        ],
        answer: "B",
        hint: r("国会議事堂があるまちだよ", "こっかいぎじどうがあるまちだよ"),
      },
    },
  },
  {
    id: "st-2",
    index: 2,
    kind: "property",
    label: r("横浜", "よこはま"),
    passCoin: 1,
    property: {
      id: "pr-yokohama",
      name: r("中華街", "ちゅうかがい"),
      price: 80,
      category: "shop",
      quiz: {
        id: "qz-yokohama",
        subject: "geography",
        question: r("横浜があるのは何県？", "よこはまがあるのはなにけん？"),
        choices: [
          { key: "A", text: r("神奈川県", "かながわけん") },
          { key: "B", text: r("千葉県", "ちばけん") },
          { key: "C", text: r("埼玉県", "さいたまけん") },
        ],
        answer: "A",
        hint: r("「か」からはじまる県だよ", "「か」からはじまるけんだよ"),
      },
    },
  },
  {
    id: "st-3",
    index: 3,
    kind: "event",
    label: r("イベント"),
    passCoin: 1,
  },
  {
    id: "st-4",
    index: 4,
    kind: "property",
    label: r("名古屋", "なごや"),
    passCoin: 1,
    property: {
      id: "pr-nagoya",
      name: r("自動車工場", "じどうしゃこうじょう"),
      price: 120,
      category: "factory",
      quiz: {
        id: "qz-nagoya",
        subject: "economics",
        question: r("車を1台つくって2万円もうかります。3台でいくら？", "くるまを1だいつくって2まんえんもうかります。3だいでいくら？"),
        choices: [
          { key: "A", text: r("4万円", "4まんえん") },
          { key: "B", text: r("6万円", "6まんえん") },
          { key: "C", text: r("8万円", "8まんえん") },
        ],
        answer: "B",
        hint: r("2 × 3 をけいさんしよう", "2 × 3 をけいさんしよう"),
      },
    },
  },
  {
    id: "st-5",
    index: 5,
    kind: "property",
    label: r("京都", "きょうと"),
    passCoin: 1,
    property: {
      id: "pr-kyoto",
      name: r("金閣寺", "きんかくじ"),
      price: 90,
      category: "tourism",
      quiz: {
        id: "qz-kyoto",
        subject: "civics",
        question: r("みんなで決まりを話し合って決めることを何という？", "みんなできまりをはなしあってきめることをなんという？"),
        choices: [
          { key: "A", text: r("せんきょ") },
          { key: "B", text: r("話し合い", "はなしあい") },
          { key: "C", text: r("くじびき") },
        ],
        answer: "B",
        hint: r("みんなの意見をきくことだよ", "みんなのいけんをきくことだよ"),
      },
    },
  },
  {
    id: "st-6",
    index: 6,
    kind: "property",
    label: r("大阪", "おおさか"),
    passCoin: 1,
    property: {
      id: "pr-osaka",
      name: r("たこ焼き屋", "たこやきや"),
      price: 70,
      category: "shop",
      quiz: {
        id: "qz-osaka",
        subject: "math",
        question: r("たこ焼き1パック150円。2パックでいくら？", "たこやき1ぱっく150えん。2ぱっくでいくら？"),
        choices: [
          { key: "A", text: r("250円", "250えん") },
          { key: "B", text: r("300円", "300えん") },
          { key: "C", text: r("350円", "350えん") },
        ],
        answer: "B",
        hint: r("150 + 150 だよ", "150 + 150 だよ"),
      },
    },
  },
  {
    id: "st-7",
    index: 7,
    kind: "event",
    label: r("イベント"),
    passCoin: 2,
  },
];

export const SAMPLE_MAP: GameMap = {
  id: "map-tokaido",
  seed: "tokaido-mvp",
  stations,
};
