// 日本地図レイアウト（DESIGN 4.4 円環+少数分岐 を「日本一周」に対応づけたもの）。
// 都市も海岸線も同一の緯度経度投影 project(lat,lon) で配置するので、駅は必ず陸地に乗り、
// 紀伊半島・能登・房総・知床・薩摩などの半島も実データでかたどれる。
// 北海道〜沖縄を1つの外周ループに乗せ、離島は実在フェリー航路で接続（engine は forward 専用のまま無改修）。

// --- 緯度経度 → 盤座標（等緯度経度。経度方向は cos(lat) ぶん詰めて縦横比を自然に） ---
const LON0 = 127.6; // 左端の経度（那覇あたり）
const LAT0 = 45.7; // 上端の緯度（宗谷岬の少し上）
const SX = 36; // 経度1°あたりpx
const SY = 46; // 緯度1°あたりpx
const OX = 20;
const OY = 22;
const px = (lat: number, lon: number) => ({
  x: Math.round((lon - LON0) * SX + OX),
  y: Math.round((LAT0 - lat) * SY + OY),
});
/** 緯度経度の点列から閉じた SVG path を作る */
const coast = (pts: [number, number][]) =>
  "M" + pts.map(([la, lo]) => { const q = px(la, lo); return `${q.x} ${q.y}`; }).join(" L") + " Z";

export const BOARD_W = 700;
export const BOARD_H = 980;

/** 地理ノード：盤上の実在都市。propId は stationPool の物件 id（実在駅・都道府県を持つ） */
export type GeoNode = { propId: string; x: number; y: number };
const node = (propId: string, lat: number, lon: number): GeoNode => ({ propId, ...px(lat, lon) });

export const START_POS = px(35.68, 139.77); // 東京
// 周回ループ（index 0 = スタート＝東京）。太平洋を北上→北海道→日本海を南下→九州→沖縄→大阪。
export const SPINE: GeoNode[] = [
  node("", 35.68, 139.77), // 0 東京（スタート）
  node("p-sendai", 38.27, 140.87), // 1 仙台
  node("p-biru", 43.06, 141.35), // 2 札幌（仙台↔苫小牧フェリー）
  node("p-ringo", 40.82, 140.74), // 3 青森（青函）
  node("p-akita", 39.72, 140.1), // 4 秋田
  node("p-kome", 37.92, 139.04), // 5 新潟
  node("p-kanazawa", 36.56, 136.66), // 6 金沢
  node("p-kani", 35.5, 134.24), // 7 鳥取
  node("p-itsukushima", 34.39, 132.46), // 8 広島
  node("p-seitetsu", 33.59, 130.4), // 9 福岡 ← 分岐K fork
  node("p-imo", 31.6, 130.56), // 10 鹿児島 ← 分岐K merge
  node("p-okinawa", 26.21, 127.68), // 11 那覇（鹿児島↔那覇フェリー）
  node("p-depart", 34.69, 135.5), // 12 大阪（那覇↔本土フェリー）← 分岐N fork
  node("p-jidosha", 35.18, 136.91), // 13 名古屋 ← 分岐N merge / 分岐C fork
];

/** 分岐（fork/merge は駅 id 参照＝SPINE の挿入で番号がズレても壊れない）。short=1中継, long=2中継。 */
export type GeoBranch = { forkId: string; mergeId: string; short: GeoNode[]; long: GeoNode[] };
export const BRANCHES: GeoBranch[] = [
  // K 九州（福岡 ⇄ 鹿児島）。近道=西の熊本、遠回り=東の大分→宮崎。
  {
    forkId: "st-p-seitetsu",
    mergeId: "st-p-imo",
    short: [node("p-kumamoto", 32.8, 130.71)],
    long: [node("p-onsen", 33.28, 131.5), node("p-miyazaki", 31.91, 131.42)],
  },
  // 四国/山陽（鳥取 ⇄ 広島）。近道=山陽の岡山、遠回り=四国の高松→松山。
  {
    forkId: "st-p-kani",
    mergeId: "st-p-itsukushima",
    short: [node("p-momo", 34.66, 133.92)], // 岡山
    long: [node("p-shiohama", 34.34, 134.05), node("p-mikan", 33.84, 132.77)], // 高松→松山
  },
  // N 近畿（大阪 ⇄ 名古屋）。近道=京都、遠回り=大津→奈良。
  {
    forkId: "st-p-depart",
    mergeId: "st-p-jidosha",
    short: [node("p-kinkaku", 35.01, 135.77)],
    long: [node("p-biwako", 35.0, 135.87), node("p-daibutsu", 34.69, 135.83)],
  },
  // C 中央 vs 東海道（名古屋 ⇄ 東京）。近道=東海道の静岡、遠回り=中央の長野→甲府。
  {
    forkId: "st-p-jidosha",
    mergeId: "st-start",
    short: [node("p-cha", 34.97, 138.38)],
    long: [node("p-soba", 36.65, 138.19), node("p-budo", 35.66, 138.57)],
  },
];

/** フェリー（離島・長距離航路）。点線で描くエッジ。駅 id（`st-${propId}` / start）のペア。 */
export const FERRY_EDGES: [string, string][] = [
  ["st-p-sendai", "st-p-biru"], // 仙台 → 札幌（苫小牧）
  ["st-p-biru", "st-p-ringo"], // 札幌 → 青森（青函）
  ["st-p-imo", "st-p-okinawa"], // 鹿児島 → 那覇
  ["st-p-okinawa", "st-p-depart"], // 那覇 → 大阪（本土へ）
];

// --- 海岸線（実緯度経度を多点でなぞる。半島も再現） ---
export const HONSHU_PATH = coast([
  [34.0, 131.0], [34.05, 131.8], [34.3, 132.5], [34.45, 133.6], [34.3, 135.0],
  [33.43, 135.76], [34.2, 136.5], [34.3, 136.85], [34.58, 137.05], [34.6, 138.2],
  [34.6, 138.85], [35.13, 139.6], [34.9, 139.85], [35.7, 140.87], [36.9, 140.95],
  [38.27, 141.5], [39.5, 142.05], [41.4, 141.45], [41.2, 140.35], [40.0, 139.7],
  [38.3, 139.0], [37.85, 138.8], [37.55, 137.1], [37.2, 136.7], [36.2, 136.0],
  [35.7, 135.2], [35.6, 134.0], [34.7, 131.7],
]);
export const HOKKAIDO_PATH = coast([
  [45.5, 141.9], [44.3, 143.7], [43.9, 144.8], [43.3, 145.6], [42.6, 143.5],
  [42.0, 143.2], [41.8, 141.6], [41.4, 140.1], [42.0, 139.8], [43.1, 140.5],
  [43.9, 141.6], [44.8, 141.6],
]);
export const KYUSHU_PATH = coast([
  [33.95, 130.95], [33.6, 131.7], [32.95, 131.9], [31.9, 131.6], [31.4, 131.35],
  [31.0, 130.66], [31.25, 130.25], [32.0, 130.2], [32.6, 130.0], [33.0, 129.9],
  [33.5, 129.9], [33.9, 130.3],
]);
export const SHIKOKU_PATH = coast([
  [34.35, 134.05], [34.05, 134.6], [33.5, 134.3], [33.25, 134.18], [32.72, 133.0],
  [33.25, 132.5], [33.95, 132.7],
]);
export const OKINAWA_PATH = coast([
  [26.85, 128.25], [26.5, 127.95], [26.2, 127.7], [26.07, 127.66], [26.4, 127.85],
]);
export const LAND_PATHS = [HONSHU_PATH, HOKKAIDO_PATH, KYUSHU_PATH, SHIKOKU_PATH];
export const SADO = px(38.05, 138.4); // 佐渡島（装飾）

/** 背景に描く地方ラベル（装飾） */
export const REGIONS: { label: string; x: number; y: number }[] = [
  { label: "北海道", x: px(44.0, 142.6).x, y: px(44.0, 142.6).y },
  { label: "本州", x: px(36.5, 137.6).x, y: px(36.5, 137.6).y },
  { label: "九州", x: px(32.6, 130.9).x, y: px(32.6, 130.9).y },
  { label: "四国", x: px(33.6, 133.4).x, y: px(33.6, 133.4).y },
  { label: "沖縄", x: px(26.6, 128.6).x, y: px(26.6, 128.6).y },
];
