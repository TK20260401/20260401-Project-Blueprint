import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, TIER_GRADIENTS } from "../utils/colors";
import { COPY } from "../config/copy";
import { fadeIn, slideInY, scaleIn } from "../utils/animations";
import { PhoneMockup } from "../components/PhoneMockup";
import { PixelSword } from "../components/PixelSword";
import { PixelCoin } from "../components/PixelCoin";

/**
 * Scene 3: クエスト機能（6秒）
 * スマホモックアップ内にクエスト一覧UIがスライドイン
 */
export const QuestScene: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();

  const headlineOpacity = fadeIn(frame, 5, 15);
  const headlineY = slideInY(frame, 5, -30, 15);
  const phoneScale = scaleIn(frame, 15, 22);
  const phoneOpacity = fadeIn(frame, 15, 18);

  const quests = [
    { title: "お皿あらい", reward: 100, tier: "bronze" as const },
    { title: "おふろそうじ", reward: 200, tier: "silver" as const },
    { title: "犬のさんぽ", reward: 300, tier: "gold" as const },
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.surface} 0%, ${COLORS.bgDark} 100%)`,
      }}
    >
      {/* ヘッドライン */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
        }}
      >
        <h2
          style={{
            fontFamily: '"Noto Sans JP", system-ui, sans-serif',
            fontSize: 60,
            fontWeight: 900,
            color: COLORS.gold,
            textShadow: `0 0 20px ${COLORS.gold}66, 0 4px 0 ${COLORS.goldDark}`,
            margin: 0,
          }}
        >
          {COPY.scenes.quest.headline}
        </h2>
      </div>

      {/* スマホモックアップ */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 120 }}>
        <div
          style={{
            transform: `scale(${phoneScale})`,
            opacity: phoneOpacity,
          }}
        >
          <PhoneMockup width={Math.min(460, width * 0.65)} height={Math.min(920, height * 0.65)}>
            <div style={{ padding: 24, color: COLORS.textStrong }}>
              <div
                style={{
                  textAlign: "center",
                  fontFamily: '"Noto Sans JP", system-ui, sans-serif',
                  fontSize: 18,
                  color: COLORS.gold,
                  fontWeight: 700,
                  marginBottom: 16,
                  marginTop: 8,
                }}
              >
                🗡 クエスト一覧
              </div>

              {quests.map((q, i) => {
                const delay = 40 + i * 12;
                const rowX = interpolate(frame, [delay, delay + 18], [400, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                });
                const rowOpacity = fadeIn(frame, delay, 15);
                const [light, mid, dark] = TIER_GRADIENTS[q.tier];
                return (
                  <div
                    key={i}
                    style={{
                      transform: `translateX(${rowX}px)`,
                      opacity: rowOpacity,
                      marginBottom: 14,
                      borderRadius: 12,
                      overflow: "hidden",
                      border: `2px solid ${mid}`,
                      background: COLORS.surface,
                    }}
                  >
                    {/* 上部装飾バー */}
                    <div
                      style={{
                        height: 6,
                        background: `linear-gradient(90deg, ${dark}, ${mid}, ${light}, ${mid}, ${dark})`,
                      }}
                    />
                    <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: COLORS.surfaceMuted, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <PixelSword size={28} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textStrong, fontFamily: '"Noto Sans JP", system-ui, sans-serif' }}>{q.title}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <PixelCoin size={14} />
                          <span style={{ fontSize: 13, color: COLORS.gold, fontWeight: 700 }}>{q.reward}円</span>
                        </div>
                      </div>
                      <button
                        style={{
                          background: COLORS.gold,
                          color: COLORS.bgDark,
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 12,
                          fontWeight: 900,
                          fontFamily: '"Noto Sans JP", system-ui, sans-serif',
                        }}
                      >
                        クリア
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </PhoneMockup>
        </div>
      </AbsoluteFill>

      {/* サブキャッチ */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: fadeIn(frame, 110, 18),
        }}
      >
        <p
          style={{
            fontFamily: '"Noto Sans JP", system-ui, sans-serif',
            fontSize: 34,
            color: COLORS.textBase,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {COPY.scenes.quest.bullet1}
          <span style={{ color: COLORS.gold }}>{COPY.scenes.quest.bullet2}</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
