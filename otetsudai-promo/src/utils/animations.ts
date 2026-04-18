import { interpolate, spring, Easing } from "remotion";

/**
 * フェードイン: 指定フレーム範囲で 0→1
 */
export function fadeIn(frame: number, start: number, duration = 15) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * フェードアウト: 指定フレーム範囲で 1→0
 */
export function fadeOut(frame: number, start: number, duration = 15) {
  return interpolate(frame, [start, start + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/**
 * フレーム範囲内の時だけ表示（in/out付き）
 */
export function visibleBetween(
  frame: number,
  inAt: number,
  outAt: number,
  fadeFrames = 12
) {
  if (frame < inAt || frame > outAt) return 0;
  const fi = fadeIn(frame, inAt, fadeFrames);
  const fo = 1 - fadeIn(frame, outAt - fadeFrames, fadeFrames);
  return Math.min(fi, fo);
}

/**
 * バウンススプリング（登場演出向け）
 */
export function bounceSpring(frame: number, fps: number, delay = 0) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 180, mass: 0.6 },
  });
}

/**
 * 上からスライドイン（translateY）
 */
export function slideInY(frame: number, start: number, fromY: number, duration = 20) {
  return interpolate(frame, [start, start + duration], [fromY, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

/**
 * スケール登場（0.8→1）
 */
export function scaleIn(frame: number, start: number, duration = 18) {
  return interpolate(frame, [start, start + duration], [0.75, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

/**
 * パルス（呼吸する）
 */
export function pulse(frame: number, amplitude = 0.05, period = 30) {
  return 1 + Math.sin((frame / period) * Math.PI * 2) * amplitude;
}
