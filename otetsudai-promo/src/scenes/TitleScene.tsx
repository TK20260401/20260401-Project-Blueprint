import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../utils/colors";
import { COPY } from "../config/copy";
import { scaleIn, fadeIn, bounceSpring, pulse } from "../utils/animations";
import { CoinParticles } from "../components/CoinParticle";
import { PixelSword } from "../components/PixelSword";

type Props = {
  durationInFrames: number;
  width: number;
  height: number;
};

/**
 * Scene 1: タイトル（0-90フレーム / 3秒）
 * ロゴ「おこづかいクエスト」フェードイン＋コインが舞うパーティクル
 */
export const TitleScene: React.FC<Props> = ({ durationInFrames, width, height }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = scaleIn(frame, 10, 25);
  const logoOpacity = fadeIn(frame, 10, 20);
  const taglineOpacity = fadeIn(frame, 35, 20);
  const swordBounce = bounceSpring(frame, fps, 20);
  const logoPulse = pulse(frame - 60, 0.04, 40);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.surface} 0%, ${COLORS.bgDark} 70%, ${COLORS.bgDarkAlt} 100%)`,
      }}
    >
      {/* 背景グリッド */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.border}22 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.5,
        }}
      />

      {/* コインパーティクル */}
      <CoinParticles count={10} totalFrames={durationInFrames} width={width} height={height} />

      {/* 中央の剣アイコン */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${swordBounce}) translateY(-140px)`,
            filter: `drop-shadow(0 0 24px ${COLORS.gold})`,
          }}
        >
          <PixelSword size={140} />
        </div>
      </AbsoluteFill>

      {/* タイトル */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale * logoPulse}) translateY(40px)`,
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: '"Noto Sans JP", system-ui, sans-serif',
              fontSize: 84,
              fontWeight: 900,
              color: COLORS.gold,
              textShadow: `0 0 30px ${COLORS.gold}, 0 4px 0 ${COLORS.goldDark}`,
              letterSpacing: "-0.02em",
              margin: 0,
              padding: 0,
              lineHeight: 1.1,
            }}
          >
            {COPY.brand.title}
          </h1>
          <p
            style={{
              opacity: taglineOpacity,
              fontFamily: '"Noto Sans JP", system-ui, sans-serif',
              fontSize: 36,
              color: COLORS.textStrong,
              marginTop: 16,
              fontWeight: 700,
            }}
          >
            {COPY.brand.tagline}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
