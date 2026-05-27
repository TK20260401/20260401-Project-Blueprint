// 駅マスタープール（DESIGN 4.2 マスター駅プール / 4.3.1 駅選定の元データ）。
// MVP は5カテゴリ×各4駅の計20駅。本番は65〜70駅まで拡張予定（データ追加のみ）。
// generateMap がここからカテゴリ均等に選抜する。

import type { Property, RubyText, StationCategory } from "./types";

const r = (base: string, ruby?: string): RubyText => ({ base, ruby });

// 物件（=駅に紐づく取得対象）の候補。category ごとにまとまっている。
export const PROPERTY_POOL: Property[] = [
  // === farm 田畑 ===
  {
    id: "p-ichigo",
    name: r("いちご農園", "いちごのうえん"),
    price: 70,
    category: "farm",
    quiz: {
      id: "q-ichigo",
      subject: "geography",
      question: r("いちごは何のなかま？", "いちごはなんのなかま？"),
      choices: [
        { key: "A", text: r("くだもの・やさい") },
        { key: "B", text: r("さかな") },
        { key: "C", text: r("きんぞく") },
      ],
      answer: "A",
      hint: r("はたけでそだつあまいものだよ"),
    },
  },
  {
    id: "p-kome",
    name: r("田んぼ", "たんぼ"),
    price: 80,
    category: "farm",
    quiz: {
      id: "q-kome",
      subject: "geography",
      question: r("田んぼでつくるものは？", "たんぼでつくるものは？"),
      choices: [
        { key: "A", text: r("こめ") },
        { key: "B", text: r("くるま") },
        { key: "C", text: r("ふく") },
      ],
      answer: "A",
      hint: r("ごはんになるよ"),
    },
  },
  {
    id: "p-bokujo",
    name: r("牧場", "ぼくじょう"),
    price: 90,
    category: "farm",
    quiz: {
      id: "q-bokujo",
      subject: "geography",
      question: r("牛からとれるのみものは？", "うしからとれるのみものは？"),
      choices: [
        { key: "A", text: r("ジュース") },
        { key: "B", text: r("ぎゅうにゅう") },
        { key: "C", text: r("おちゃ") },
      ],
      answer: "B",
      hint: r("しろいのみものだよ"),
    },
  },
  {
    id: "p-ringo",
    name: r("りんご畑", "りんごばたけ"),
    price: 75,
    category: "farm",
    quiz: {
      id: "q-ringo",
      subject: "math",
      question: r("りんごが3こずつ2はこ。ぜんぶでいくつ？"),
      choices: [
        { key: "A", text: r("5こ") },
        { key: "B", text: r("6こ") },
        { key: "C", text: r("8こ") },
      ],
      answer: "B",
      hint: r("3 + 3 をけいさんしよう"),
    },
  },

  // === sea 海 ===
  {
    id: "p-gyoko",
    name: r("漁港", "ぎょこう"),
    price: 85,
    category: "sea",
    quiz: {
      id: "q-gyoko",
      subject: "geography",
      question: r("漁港でとれるものは？", "ぎょこうでとれるものは？"),
      choices: [
        { key: "A", text: r("さかな") },
        { key: "B", text: r("いし") },
        { key: "C", text: r("くるま") },
      ],
      answer: "A",
      hint: r("うみのいきものだよ"),
    },
  },
  {
    id: "p-suizoku",
    name: r("水族館", "すいぞくかん"),
    price: 110,
    category: "sea",
    quiz: {
      id: "q-suizoku",
      subject: "geography",
      question: r("水族館で見られるのは？", "すいぞくかんでみられるのは？"),
      choices: [
        { key: "A", text: r("ひこうき") },
        { key: "B", text: r("イルカ") },
        { key: "C", text: r("でんしゃ") },
      ],
      answer: "B",
      hint: r("うみのなかをおよぐよ"),
    },
  },
  {
    id: "p-shiohama",
    name: r("塩田", "えんでん"),
    price: 70,
    category: "sea",
    quiz: {
      id: "q-shiohama",
      subject: "geography",
      question: r("海の水からとれる、しょっぱいものは？", "うみのみずからとれる、しょっぱいものは？"),
      choices: [
        { key: "A", text: r("さとう") },
        { key: "B", text: r("しお") },
        { key: "C", text: r("こな") },
      ],
      answer: "B",
      hint: r("りょうりにつかうよ"),
    },
  },
  {
    id: "p-minato",
    name: r("みなと", "みなと"),
    price: 95,
    category: "sea",
    quiz: {
      id: "q-minato",
      subject: "economics",
      question: r("みなとから外国へにもつをはこぶのりものは？", "みなとからがいこくへにもつをはこぶのりものは？"),
      choices: [
        { key: "A", text: r("ふね") },
        { key: "B", text: r("じてんしゃ") },
        { key: "C", text: r("バス") },
      ],
      answer: "A",
      hint: r("うみをわたるよ"),
    },
  },

  // === factory 工業 ===
  {
    id: "p-jidosha",
    name: r("自動車工場", "じどうしゃこうじょう"),
    price: 120,
    category: "factory",
    quiz: {
      id: "q-jidosha",
      subject: "economics",
      question: r("車を1台つくって2万円もうかる。3台でいくら？", "くるまを1だいつくって2まんえんもうかる。3だいでいくら？"),
      choices: [
        { key: "A", text: r("4万円", "4まんえん") },
        { key: "B", text: r("6万円", "6まんえん") },
        { key: "C", text: r("8万円", "8まんえん") },
      ],
      answer: "B",
      hint: r("2 × 3 をけいさんしよう"),
    },
  },
  {
    id: "p-seitetsu",
    name: r("製鉄所", "せいてつじょ"),
    price: 130,
    category: "factory",
    quiz: {
      id: "q-seitetsu",
      subject: "geography",
      question: r("製鉄所でつくる、かたいざいりょうは？", "せいてつじょでつくる、かたいざいりょうは？"),
      choices: [
        { key: "A", text: r("てつ") },
        { key: "B", text: r("かみ") },
        { key: "C", text: r("みず") },
      ],
      answer: "A",
      hint: r("くるまやビルにつかうよ"),
    },
  },
  {
    id: "p-denki",
    name: r("電気工場", "でんきこうじょう"),
    price: 115,
    category: "factory",
    quiz: {
      id: "q-denki",
      subject: "math",
      question: r("でんち2こで100円。4こでいくら？", "でんち2こで100えん。4こでいくら？"),
      choices: [
        { key: "A", text: r("150円", "150えん") },
        { key: "B", text: r("200円", "200えん") },
        { key: "C", text: r("400円", "400えん") },
      ],
      answer: "B",
      hint: r("2このばいだから ねだんもばい"),
    },
  },
  {
    id: "p-pan",
    name: r("パン工場", "ぱんこうじょう"),
    price: 90,
    category: "factory",
    quiz: {
      id: "q-pan",
      subject: "economics",
      question: r("パンをつくるのにいるこなは？"),
      choices: [
        { key: "A", text: r("こむぎこ") },
        { key: "B", text: r("すな") },
        { key: "C", text: r("せっけん") },
      ],
      answer: "A",
      hint: r("むぎからできるこなだよ"),
    },
  },

  // === city 都市 ===
  {
    id: "p-tokyo",
    name: r("東京駅", "とうきょうえき"),
    price: 100,
    category: "city",
    quiz: {
      id: "q-tokyo",
      subject: "geography",
      question: r("日本の首都はどこ？", "にほんのしゅとはどこ？"),
      choices: [
        { key: "A", text: r("大阪", "おおさか") },
        { key: "B", text: r("東京", "とうきょう") },
        { key: "C", text: r("京都", "きょうと") },
      ],
      answer: "B",
      hint: r("国会議事堂があるまちだよ", "こっかいぎじどうがあるまちだよ"),
    },
  },
  {
    id: "p-yokohama",
    name: r("中華街", "ちゅうかがい"),
    price: 90,
    category: "city",
    quiz: {
      id: "q-yokohama",
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
  {
    id: "p-depart",
    name: r("デパート", "でぱーと"),
    price: 105,
    category: "city",
    quiz: {
      id: "q-depart",
      subject: "math",
      question: r("300円のものを500円ではらった。おつりは？", "300えんのものを500えんではらった。おつりは？"),
      choices: [
        { key: "A", text: r("100円", "100えん") },
        { key: "B", text: r("200円", "200えん") },
        { key: "C", text: r("300円", "300えん") },
      ],
      answer: "B",
      hint: r("500 - 300 をけいさんしよう"),
    },
  },
  {
    id: "p-shiyakusho",
    name: r("市役所", "しやくしょ"),
    price: 95,
    category: "city",
    quiz: {
      id: "q-shiyakusho",
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

  // === tourism 観光 ===
  {
    id: "p-kinkaku",
    name: r("金閣寺", "きんかくじ"),
    price: 100,
    category: "tourism",
    quiz: {
      id: "q-kinkaku",
      subject: "geography",
      question: r("金閣寺があるのは何市？", "きんかくじがあるのはなにし？"),
      choices: [
        { key: "A", text: r("京都市", "きょうとし") },
        { key: "B", text: r("札幌市", "さっぽろし") },
        { key: "C", text: r("福岡市", "ふくおかし") },
      ],
      answer: "A",
      hint: r("むかしのみやこだよ"),
    },
  },
  {
    id: "p-onsen",
    name: r("温泉", "おんせん"),
    price: 80,
    category: "tourism",
    quiz: {
      id: "q-onsen",
      subject: "geography",
      question: r("温泉のお湯はどんな温度？", "おんせんのおゆはどんなおんど？"),
      choices: [
        { key: "A", text: r("つめたい") },
        { key: "B", text: r("あたたかい") },
        { key: "C", text: r("こおっている") },
      ],
      answer: "B",
      hint: r("はいるとあたたまるよ"),
    },
  },
  {
    id: "p-yuen",
    name: r("遊園地", "ゆうえんち"),
    price: 115,
    category: "tourism",
    quiz: {
      id: "q-yuen",
      subject: "math",
      question: r("のりもの1かい200円。2かいでいくら？", "のりもの1かい200えん。2かいでいくら？"),
      choices: [
        { key: "A", text: r("300円", "300えん") },
        { key: "B", text: r("400円", "400えん") },
        { key: "C", text: r("500円", "500えん") },
      ],
      answer: "B",
      hint: r("200 + 200 だよ"),
    },
  },
  {
    id: "p-shiro",
    name: r("お城", "おしろ"),
    price: 110,
    category: "tourism",
    quiz: {
      id: "q-shiro",
      subject: "geography",
      question: r("むかし、おとのさまがすんでいたたてものは？"),
      choices: [
        { key: "A", text: r("おしろ") },
        { key: "B", text: r("えき") },
        { key: "C", text: r("こうじょう") },
      ],
      answer: "A",
      hint: r("いしがきの上にあるよ", "いしがきのうえにあるよ"),
    },
  },
];

export const ALL_CATEGORIES: StationCategory[] = [
  "farm",
  "sea",
  "factory",
  "city",
  "tourism",
];
