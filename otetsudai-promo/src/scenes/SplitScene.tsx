import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "../utils/colors";
import { COPY } from "../config/copy";
import { fadeIn, slideInY, scaleIn, bounceSpring } from "../utils/animations";
import { PixelCoin } from "../components/PixelCoin";
import { useVideoConfig } from "remotion";

/**
 * Scene 4: 3分割（5秒）
 * 報酬が 使う/貯める/増やす に分岐するアニメ
 */
export const SplitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = fadeIn(frame, 0, 15);
  const headlineY = slideInY(frame, 0, -30, 20);

  // コインが上から降ってきて、3つに分岐する
  const coinY = interpolate(frame, [20, 60], [-100, 280], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 分岐ポイントから左右へ
  const splitProgress = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const buckets = [
    { label: COPY.scenes.split.labels.spend, color: COLORS.walletSpend, x: -320 },
    { label: COPY.scenes.split.labels.save, color: COLORS.walletSave, x: 0 },
    { label: COPY.scenes.split.labels.invest, color: COLORS.walletInvest, x: 320 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.bgDark} 0%, ${COLORS.surface} 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ヘッドライン */}
      <div
        style={{
          position: "absolute",
          top: 120,
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: '"Noto Sans JP", system-ui, sans-serif',
            fontSize: 60,
            fontWeight: 900,
            color: COLORS.textStrong,
            margin: 0,
          }}
        >
          {COPY.scenes.split.headline}
        </h2>
        <p
          style={{
            fontFamily: '"Noto Sans JP", system-ui, sans-serif',
            fontSize: 28,
            color: COLORS.textMuted,
            marginTop: 12,
            fontWeight: 500,
          }}
        >
          {COPY.scenes.split.sub}
        </p>
      </div>

      {/* 降ってくるコイン（分岐前） */}
      {frame < 90 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, calc(-50% + ${coinY}px))`,
          }}
        >
          <PixelCoin size={100} />
        </div>
      )}

      {/* 3つのバケット */}
      <div style={{ display: "flex", gap: 80, position: "absolute", top: "55%" }}>
        {buckets.map((b, i) => {
          const appear = bounceSpring(frame, fps, 55 + i * 5);
          const coinDropY = interpolate(frame, [90 + i * 5, 115 + i * 5], [-200, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bounce,
          });
          const coinOpacity = fadeIn(frame, 90 + i * 5, 10);
          return (
            <div key={i} style={{ transform: `scale(${appear})`, textAlign: "center" }}>
              <div style={{ position: "relative", width: 180, height: 220 }}>
                {/* 降ってくる小コイン */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: `calc(50% + ${coinDropY}px)`,
                    transform: "translate(-50%, -50%)",
                    opacity: coinOpacity,
                  }}
                >
                  <PixelCoin size={56} />
                </div>
                {/* バケット本体 */}
                <div
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 24,
                    background: `linear-gradient(180deg, ${b.color}44 0%, ${b.color}22 100%)`,
                    border: `4px solid ${b.color}`,
                    boxShadow: `0 0 30px ${b.color}55, inset 0 -8px 0 ${b.color}66`,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: 24,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Noto Sans JP", system-ui, sans-serif',
                      fontSize: 32,
                      fontWeight: 900,
                      color: b.color,
                      textShadow: `0 2px 0 ${COLORS.bgDark}`,
                    }}
                  >
                    {b.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 分岐ライン（装飾） */}
      <svg
        width="800"
        height="400"
        style={{
          position: "absolute",
          top: "40%",
          opacity: interpolate(splitProgress, [0, 1], [0, 0.4]),
          pointerEvents: "none",
        }}
        viewBox="0 0 800 400"
      >
        <path d={`M 400 0 Q 400 150 80 ${300 * splitProgress}`} stroke={COLORS.walletSpend} strokeWidth={3} fill="none" strokeDasharray="8 8" />
        <path d={`M 400 0 L 400 ${300 * splitProgress}`} stroke={COLORS.walletSave} strokeWidth={3} fill="none" strokeDasharray="8 8" />
        <path d={`M 400 0 Q 400 150 720 ${300 * splitProgress}`} stroke={COLORS.walletInvest} strokeWidth={3} fill="none" strokeDasharray="8 8" />
      </svg>
    </AbsoluteFill>
  );
};
