import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../utils/colors";
import { COPY } from "../config/copy";
import { fadeIn, slideInY } from "../utils/animations";

/**
 * Scene 2: 課題提示（5秒）
 * 親の悩み「お手伝い、どう教える？」
 */
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineY = slideInY(frame, 5, -40, 22);
  const headlineOpacity = fadeIn(frame, 5, 20);
  const subOpacity = fadeIn(frame, 30, 18);
  const thinkBubbleOpacity = fadeIn(frame, 15, 25);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.bgDark} 0%, ${COLORS.surface} 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 考える吹き出しアイコン群 */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 180 }}>
        <div style={{ opacity: thinkBubbleOpacity, display: "flex", gap: 40 }}>
          {["どうやって?", "いくら?", "教育的?"].map((text, i) => (
            <div
              key={i}
              style={{
                background: COLORS.surfaceMuted,
                border: `3px solid ${COLORS.border}`,
                borderRadius: 20,
                padding: "18px 28px",
                color: COLORS.textBase,
                fontSize: 22,
                fontWeight: 700,
                fontFamily: '"Noto Sans JP", system-ui, sans-serif',
                transform: `translateY(${Math.sin((frame + i * 10) / 20) * 10}px)`,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* メインキャッチ */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          textAlign: "center",
          padding: "0 60px",
        }}
      >
        <h2
          style={{
            fontFamily: '"Noto Sans JP", system-ui, sans-serif',
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.textStrong,
            textShadow: `0 4px 20px rgba(0,0,0,0.6)`,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {COPY.scenes.problem.headline}
        </h2>
        <p
          style={{
            opacity: subOpacity,
            fontFamily: '"Noto Sans JP", system-ui, sans-serif',
            fontSize: 32,
            color: COLORS.textMuted,
            marginTop: 20,
            fontWeight: 500,
          }}
        >
          {COPY.scenes.problem.sub}
        </p>
      </div>
    </AbsoluteFill>
  );
};
