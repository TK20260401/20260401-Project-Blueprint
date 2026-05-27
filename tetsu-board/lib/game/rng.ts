// 決定的乱数（DESIGN 4.3.1 シード固定機能 / 同一シード=同一マップ）。
// 文字列シード → 32bit 整数 → mulberry32。サーバ移植時もそのまま使える純粋実装。

/** 文字列シードを 32bit 整数へ（xfnv1a） */
export function seedFromString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** mulberry32：seed から [0,1) を返す関数を生成 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** rng を使った Fisher-Yates シャッフル（非破壊） */
export function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** 文字列シードから乱数関数を作る入口 */
export function rngFromSeed(seed: string): () => number {
  return mulberry32(seedFromString(seed));
}
