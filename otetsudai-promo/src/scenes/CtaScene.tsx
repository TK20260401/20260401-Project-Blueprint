import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { COLORS } from "../utils/colors";
import { COPY } from "../config/copy";
import { fadeIn, slideInY, scaleIn, bounceSpring, pulse } from "../utils/animations";
import { PixelCoin } from "../components/PixelCoin";

/**
 * Scene 6: CTA（6秒）
 * ボタン点滅＋QR＋URL
 */
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = fadeIn(frame, 0, 15);
  const headlineY = slideInY(frame, 0, -40, 22);
  const buttonScale = bounceSpring(frame, fps, 30) * pulse(frame - 50, 0.08, 36);
  const buttonOpacity = fadeIn(frame, 30, 15);
  const qrOpacity = fadeIn(frame, 60, 20);
  const qrScale = scaleIn(frame, 60, 20);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, ${COLORS.surface} 0%, ${COLORS.bgDark} 60%, ${COLORS.bgDarkAlt} 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 背景コイン装飾 */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2 + frame / 60;
        const r = 380;
        const y = Math.sin(angle) * r;
        const x = Math.cos(angle) * r;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px - 24px)`,
              top: `calc(50% + ${y}px - 24px)`,
              opacity: 0.3,
            }}
          >
            <PixelCoin size={48} />
          </div>
        );
      })}

      {/* ヘッドライン */}
      <div
        style={{
          position: "absolute",
          top: 140,
          textAlign: "center",
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <h2
          style={{
            fontFamily: '"Noto Sans JP", system-ui, sans-serif',
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.textStrong,
            textShadow: `0 0 30px ${COLORS.gold}`,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {COPY.scenes.cta.headline}
        </h2>
      </div>

      {/* CTA ボタン */}
      <div
        style={{
          transform: `scale(${buttonScale})`,
          opacity: buttonOpacity,
        }}
      >
        <div
          style={{
            background: `linear-gradient(180deg, ${COLORS.goldLight} 0%, ${COLORS.gold} 50%, ${COLORS.goldDark} 100%)`,
            border: `5px solid ${COLORS.goldBorder}`,
            borderRadius: 24,
            padding: "32px 80px",
            textAlign: "center",
            boxShadow: `0 0 60px ${COLORS.gold}cc, inset 0 -10px 0 ${COLORS.goldDark}66`,
          }}
        >
          <div
            style={{
              fontFamily: '"Noto Sans JP", system-ui, sans-serif',
              fontSize: 56,
              fontWeight: 900,
              color: COLORS.bgDark,
              textShadow: `0 2px 0 ${COLORS.goldLight}`,
            }}
          >
            {COPY.scenes.cta.button}
          </div>
        </div>
      </div>

      {/* QRコード（擬似） */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: qrOpacity,
          transform: `scale(${qrScale})`,
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            background: "#fff",
            padding: 10,
            borderRadius: 12,
            border: `3px solid ${COLORS.gold}`,
          }}
        >
          {/* QRコード風パターン */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundImage: `
                radial-gradient(circle at 15% 15%, #000 3%, transparent 3%),
                radial-gradient(circle at 85% 15%, #000 3%, transparent 3%),
                radial-gradient(circle at 15% 85%, #000 3%, transparent 3%),
                linear-gradient(90deg, #000 50%, transparent 50%),
                linear-gradient(0deg, #000 50%, transparent 50%)
              `,
              backgroundSize: "100% 100%, 100% 100%, 100% 100%, 8px 8px, 8px 8px",
              backgroundColor: "#fff",
              opacity: 0.9,
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontFamily: '"Noto Sans JP", system-ui, sans-serif',
              fontSize: 20,
              color: COLORS.textMuted,
              fontWeight: 700,
            }}
          >
            {COPY.scenes.cta.note}
          </div>
          <div
            style={{
              fontFamily: '"Noto Sans JP", system-ui, sans-serif',
              fontSize: 26,
              color: COLORS.gold,
              fontWeight: 900,
              marginTop: 4,
              textShadow: `0 0 12px ${COLORS.gold}66`,
            }}
          >
            {COPY.brand.url}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
