// 日本地図レイアウト（DESIGN 4.4 円環+少数分岐 を「日本一周」に対応づけたもの）。
// 北海道〜沖縄までを1つの外周ループに乗せる：太平洋側を北上→北海道→日本海側を南下→
// 九州→沖縄→太平洋側で大阪へ戻る一筆書き。離島接続は実在フェリー航路（仙台↔苫小牧、
// 青函、鹿児島↔那覇、那覇↔本土）を使うので地理的に自然で、engine（forward 専用）は無改修。
// 座標は緯度経度から算出（北=上 / 東=右）。盤は縦長でスクロール表示。

export const BOARD_W = 660;
export const BOARD_H = 1040;

/** 地理ノード：盤上の実在都市。propId は stationPool の物件 id（実在駅・都道府県を持つ） */
export type GeoNode = { propId: string; x: number; y: number };

// 周回ループ上の都市（index 0 = スタート＝東京）。太平洋を北上→北海道→日本海を南下→九州→沖縄→大阪。
export const START_POS = { x: 543, y: 470 }; // 東京
export const SPINE: GeoNode[] = [
  { propId: "", x: 543, y: 470 }, // 0 東京（スタート）
  { propId: "p-sendai", x: 592, y: 331 }, // 1 仙台
  { propId: "p-biru", x: 612, y: 78 }, // 2 札幌（仙台↔苫小牧フェリー）
  { propId: "p-ringo", x: 587, y: 193 }, // 3 青森（青函）
  { propId: "p-akita", x: 560, y: 253 }, // 4 秋田
  { propId: "p-kome", x: 516, y: 350 }, // 5 新潟
  { propId: "p-kanazawa", x: 415, y: 423 }, // 6 金沢
  { propId: "p-kani", x: 314, y: 480 }, // 7 鳥取
  { propId: "p-itsukushima", x: 239, y: 540 }, // 8 広島
  { propId: "p-seitetsu", x: 153, y: 584 }, // 9 福岡 ← 分岐K fork
  { propId: "p-imo", x: 160, y: 691 }, // 10 鹿児島 ← 分岐K merge
  { propId: "p-okinawa", x: 44, y: 968 }, // 11 那覇（鹿児島↔那覇フェリー）
  { propId: "p-depart", x: 367, y: 524 }, // 12 大阪（那覇↔本土フェリー）← 分岐N fork
  { propId: "p-jidosha", x: 426, y: 498 }, // 13 名古屋 ← 分岐N merge / 分岐C fork
];

/** 分岐（fork→short/long→merge は SPINE の index 参照）。short=1中継, long=2中継。 */
export type GeoBranch = { fork: number; merge: number; short: GeoNode[]; long: GeoNode[] };
export const BRANCHES: GeoBranch[] = [
  // K 九州（福岡 ⇄ 鹿児島）。近道=西の熊本、遠回り=東の大分→宮崎。
  {
    fork: 9,
    merge: 10,
    short: [{ propId: "p-kumamoto", x: 166, y: 626 }], // 熊本
    long: [
      { propId: "p-onsen", x: 210, y: 602 }, // 大分（別府）
      { propId: "p-miyazaki", x: 198, y: 672 }, // 宮崎
    ],
  },
  // N 近畿（大阪 ⇄ 名古屋）。近道=京都、遠回り=大津→奈良。
  {
    fork: 12,
    merge: 13,
    short: [{ propId: "p-kinkaku", x: 380, y: 506 }], // 京都
    long: [
      { propId: "p-biwako", x: 396, y: 492 }, // 大津（滋賀）
      { propId: "p-daibutsu", x: 392, y: 530 }, // 奈良
    ],
  },
  // C 中央 vs 東海道（名古屋 ⇄ 東京）。近道=東海道の静岡、遠回り=中央の長野→甲府。
  {
    fork: 13,
    merge: 0,
    short: [{ propId: "p-cha", x: 488, y: 508 }], // 静岡（東海道）
    long: [
      { propId: "p-soba", x: 480, y: 420 }, // 長野（中央）
      { propId: "p-budo", x: 498, y: 472 }, // 甲府（中央）
    ],
  },
];

/** フェリー（離島・長距離航路）。点線で描くエッジ。駅 id（`st-${propId}` / start）のペア。 */
export const FERRY_EDGES: [string, string][] = [
  ["st-p-sendai", "st-p-biru"], // 仙台 → 札幌（苫小牧）
  ["st-p-biru", "st-p-ringo"], // 札幌 → 青森（青函）
  ["st-p-imo", "st-p-okinawa"], // 鹿児島 → 那覇
  ["st-p-okinawa", "st-p-depart"], // 那覇 → 大阪（本土へ）
];

/** 背景に描く地方ラベル（装飾） */
export const REGIONS: { label: string; x: number; y: number }[] = [
  { label: "北海道", x: 612, y: 150 },
  { label: "本州", x: 470, y: 360 },
  { label: "九州", x: 110, y: 640 },
  { label: "四国", x: 300, y: 600 },
  { label: "沖縄", x: 90, y: 980 },
];
