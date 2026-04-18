import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { PixelCoin } from "./PixelCoin";

type Props = {
  index: number;
  totalFrames: number;
  containerW: number;
  containerH: number;
};

/**
 * 画面内を舞うコインパーティクル（決定論的ランダム）
 */
export const CoinParticle: React.FC<Props> = ({ index, totalFrames, containerW, containerH }) => {
  const frame = useCurrentFrame();
  const seed = `coin-${index}`;
  const startX = random(seed + "x") * containerW;
  const startY = containerH + 50;
  const rotateSpeed = 2 + random(seed + "r") * 4;
  const delay = random(seed + "d") * (totalFrames * 0.5);
  const drift = (random(seed + "drift") - 0.5) * 200;
  const size = 32 + random(seed + "s") * 40;

  const progress = Math.max(0, Math.min(1, (frame - delay) / (totalFrames - delay)));
  if (progress <= 0) return null;

  const y = interpolate(progress, [0, 1], [startY, -100]);
  const x = startX + Math.sin(progress * Math.PI * 2) * drift;
  const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const rotate = frame * rotateSpeed + random(seed + "rot") * 360;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotate}deg)`,
        opacity,
      }}
    >
      <PixelCoin size={size} />
    </div>
  );
};

/**
 * パーティクル群
 */
export const CoinParticles: React.FC<{ count?: number; totalFrames?: number; width: number; height: number }> = ({
  count = 14,
  totalFrames = 90,
  width,
  height,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CoinParticle key={i} index={i} totalFrames={totalFrames} containerW={width} containerH={height} />
      ))}
    </>
  );
};
