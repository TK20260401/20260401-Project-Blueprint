// 日本地図レイアウト（DESIGN 4.4 円環+少数分岐 を「日本列島の地理」に対応づけたもの）。
// 本州+九州をめぐる周回ループ＋実在の並行ルート3分岐（中央/東海道・近畿・四国/山陽）。
// 座標は portrait 盤（北東=右上, 南西=左下）。駅は実在都市に固定し、generateMap は
// シードで「災難（ピンチ）パターン」と「目的地」だけを変える。engine/store は無改修。

export const BOARD_W = 520;
export const BOARD_H = 640;

/** 地理ノード：盤上の実在都市。propId は stationPool の物件 id（実在駅・都道府県を持つ） */
export type GeoNode = { propId: string; x: number; y: number };

/** 周回ループ上の都市（index 0 = スタート＝東京）。loop=true 相当。時計回り。 */
export const START_POS = { x: 404, y: 356 }; // 東京
export const SPINE: GeoNode[] = [
  { propId: "", x: 404, y: 356 }, // 0 スタート（東京）
  { propId: "p-minato", x: 406, y: 388 }, // 1 横浜（神奈川）← 分岐C fork
  { propId: "p-jidosha", x: 326, y: 412 }, // 2 名古屋（愛知）← 分岐C merge / 分岐B fork
  { propId: "p-depart", x: 268, y: 422 }, // 3 大阪 ← 分岐B merge
  { propId: "p-momo", x: 212, y: 416 }, // 4 岡山 ← 分岐A fork
  { propId: "p-itsukushima", x: 150, y: 428 }, // 5 広島 ← 分岐A merge
  { propId: "p-seitetsu", x: 80, y: 458 }, // 6 福岡（九州）
  { propId: "p-kani", x: 182, y: 372 }, // 7 鳥取（山陰）
  { propId: "p-kome", x: 366, y: 300 }, // 8 新潟
  { propId: "p-ringo", x: 404, y: 198 }, // 9 青森
];

/** 分岐（fork→short/long→merge は SPINE の index 参照）。short=1中継, long=2中継。 */
export type GeoBranch = { fork: number; merge: number; short: GeoNode[]; long: GeoNode[] };
export const BRANCHES: GeoBranch[] = [
  // C 中央線 vs 東海道（横浜 ⇄ 名古屋）
  {
    fork: 1,
    merge: 2,
    short: [{ propId: "p-cha", x: 352, y: 406 }], // 静岡（東海道）
    long: [
      { propId: "p-budo", x: 356, y: 358 }, // 甲府（中央）
      { propId: "p-soba", x: 332, y: 328 }, // 長野（中央）
    ],
  },
  // B 近畿（名古屋 ⇄ 大阪）。京都は大阪のすぐ東・北、奈良は大阪の東南、滋賀は京都の東。
  {
    fork: 2,
    merge: 3,
    short: [{ propId: "p-kinkaku", x: 292, y: 406 }], // 京都（大阪の東・やや北）
    long: [
      { propId: "p-biwako", x: 306, y: 396 }, // 大津（滋賀・京都の東）
      { propId: "p-daibutsu", x: 296, y: 444 }, // 奈良（大阪の東南）
    ],
  },
  // A 四国 vs 山陽（岡山 ⇄ 広島）
  {
    fork: 4,
    merge: 5,
    short: [{ propId: "p-shiohama", x: 206, y: 458 }], // 高松/坂出（香川）
    long: [
      { propId: "p-mikan", x: 150, y: 478 }, // 松山（愛媛）
      { propId: "p-shinju", x: 122, y: 494 }, // 宇和島（愛媛）
    ],
  },
];

/** 背景に描く島・地方ラベル（装飾。ルート未接続＝近日対応の余白） */
export const REGIONS: { label: string; x: number; y: number }[] = [
  { label: "北海道", x: 452, y: 120 },
  { label: "本州", x: 300, y: 250 },
  { label: "四国", x: 150, y: 500 },
  { label: "九州", x: 70, y: 500 },
  { label: "沖縄", x: 56, y: 600 },
];
