/**
 * おこづかいクエスト PR動画カラーパレット
 * ダンジョンパープル（v0.18 Habitica風）+ 従来のエメラルド/アンバー
 */
export const COLORS = {
  // ダンジョンテーマ（メイン背景）
  bgDark: "#1f0f31",
  bgDarkAlt: "#150a24",
  surface: "#2a1a4d",
  surfaceMuted: "#36205d",
  border: "#4f2a93",
  borderStrong: "#6b4cdb",

  // ブランドカラー
  gold: "#ffa623",
  goldLight: "#ffe066",
  goldDark: "#8a5200",
  goldBorder: "#f9c33b",

  // テキスト
  textStrong: "#f5f5f5",
  textBase: "#e0d8f0",
  textMuted: "#a090c0",

  // ウォレット3分割
  walletSpend: "#e74c3c",
  walletSpendLight: "#ff6b6b",
  walletSave: "#3498db",
  walletSaveLight: "#5dade2",
  walletInvest: "#2ecc71",
  walletInvestLight: "#58d68d",

  // 従来のエメラルド（モバイル旧テーマから）
  emerald: "#059669",
  emeraldLight: "#10b981",

  // アクセント
  red: "#e74c3c",
  blue: "#3498db",
  green: "#2ecc71",
  pink: "#e88da0",
  purple: "#6b4cdb",
} as const;

/**
 * レアリティ/tier 用カラー
 */
export const TIER_GRADIENTS = {
  gold: ["#ffe066", "#ffa623", "#8a5200"],
  silver: ["#e0e8f0", "#a8b0bc", "#5e6672"],
  bronze: ["#e0b98a", "#a87044", "#5e3a20"],
  violet: ["#b79bff", "#6b4cdb", "#321c7a"],
} as const;
