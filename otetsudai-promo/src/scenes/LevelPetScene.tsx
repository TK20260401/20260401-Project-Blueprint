import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig, Easing } from "remotion";
import { COLORS } from "../utils/colors";
import { COPY } from "../config/copy";
import { fadeIn, slideInY, bounceSpring } from "../utils/animations";

/**
 * Scene 5: レベル＆ペット（5秒）
 * レベルアップ演出＋卵→ひよこ→成鳥
 */
export const LevelPetScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = fadeIn(frame, 0, 15);
  const headlineY = slideInY(frame, 0, -30, 20);

  // レベルアップバナー
  const levelScale = bounceSpring(frame, fps, 30);
  const levelOpacity = fadeIn(frame, 30, 15);

  // ペット成長: 卵(0-50) → ひび(50-70) → ベビー(70-100) → 成鳥(100-150)
  const eggStage = frame < 50 ? 1 : frame < 70 ? 1 - (frame - 50) / 20 : 0;
  const crackStage = frame >= 50 && frame < 75 ? 1 : 0;
  const babyStage = frame >= 70 && frame < 105 ? interpolate(frame, [70, 90], [0, 1]) : frame >= 105 ? 1 - (frame - 105) / 20 : 0;
  const adultStage = frame >= 100 ? interpolate(frame, [100, 120], [0, 1], { extrapolateRight: "clamp" }) : 0;

  const eggBounce = Math.sin(frame / 4) * 4;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at center, ${COLORS.surface} 0%, ${COLORS.bgDark} 100%)`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
            fontSize: 60,
            fontWeight: 900,
            color: COLORS.gold,
            textShadow: `0 0 20px ${COLORS.gold}66`,
            margin: 0,
          }}
        >
          {COPY.scenes.levelPet.headline}
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
          {COPY.scenes.levelPet.sub}
        </p>
      </div>

      {/* 左：レベルアップ */}
      <div
        style={{
          position: "absolute",
          left: "15%",
          top: "50%",
          transform: `translateY(-50%) scale(${levelScale})`,
          opacity: levelOpacity,
        }}
      >
        <div
          style={{
            background: `linear-gradient(180deg, ${COLORS.goldLight} 0%, ${COLORS.gold} 50%, ${COLORS.goldDark} 100%)`,
            border: `4px solid ${COLORS.goldBorder}`,
            borderRadius: 16,
            padding: "28px 36px",
            textAlign: "center",
            boxShadow: `0 0 40px ${COLORS.gold}99`,
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 900, color: COLORS.bgDark, fontFamily: '"Noto Sans JP", system-ui, sans-serif' }}>LEVEL UP !</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: COLORS.bgDark, lineHeight: 1 }}>Lv.5</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.bgDark, marginTop: 8, fontFamily: '"Noto Sans JP", system-ui, sans-serif' }}>勇者見習い</div>
        </div>
      </div>

      {/* 右：ペット成長 */}
      <div
        style={{
          position: "absolute",
          right: "15%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 240,
          height: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 卵 */}
        {eggStage > 0 && (
          <svg width={180} height={180} viewBox="0 0 60 60" style={{ position: "absolute", opacity: eggStage, transform: `translateY(${eggBounce}px)` }}>
            <ellipse cx="30" cy="35" rx="18" ry="22" fill="#FFE4A3" stroke="#8A5200" strokeWidth={2} />
            <ellipse cx="26" cy="28" rx="4" ry="5" fill="#FFF6DD" />
            {[{x:20,y:25},{x:35,y:32},{x:22,y:45},{x:40,y:40}].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={2} fill="#C87010" />
            ))}
          </svg>
        )}

        {/* ヒビ演出 */}
        {crackStage > 0 && (
          <svg width={180} height={180} viewBox="0 0 60 60" style={{ position: "absolute" }}>
            <path d={`M 30 15 L ${30 + Math.sin(frame/3)*2} 25 L ${28} 30 L 32 35`} stroke="#000" strokeWidth={1.5} fill="none" opacity={0.8}/>
          </svg>
        )}

        {/* ベビー（ひよこ的） */}
        {babyStage > 0 && (
          <svg width={200} height={200} viewBox="0 0 60 60" style={{ position: "absolute", opacity: babyStage, transform: `scale(${babyStage}) translateY(${eggBounce * 0.5}px)` }}>
            <circle cx="30" cy="32" r="18" fill="#FFE066" stroke="#D4A030" strokeWidth={2} />
            <circle cx="24" cy="28" r="2.5" fill="#000" />
            <circle cx="36" cy="28" r="2.5" fill="#000" />
            <polygon points="28,34 32,34 30,38" fill="#FFA623" />
            <circle cx="24" cy="40" r="2" fill="#FFA623" opacity={0.5} />
            <circle cx="36" cy="40" r="2" fill="#FFA623" opacity={0.5} />
          </svg>
        )}

        {/* 成鳥（ドラゴン風） */}
        {adultStage > 0 && (
          <svg width={240} height={240} viewBox="0 0 60 60" style={{ position: "absolute", opacity: adultStage, transform: `scale(${adultStage})` }}>
            {/* 翼 */}
            <path d="M 10 30 L 22 20 L 25 35 Z" fill="#8E44AD" stroke="#5B2C6F" strokeWidth={1.5}/>
            <path d="M 50 30 L 38 20 L 35 35 Z" fill="#8E44AD" stroke="#5B2C6F" strokeWidth={1.5}/>
            {/* 体 */}
            <ellipse cx="30" cy="35" rx="12" ry="14" fill="#C39BD3" stroke="#8E44AD" strokeWidth={2}/>
            {/* 頭 */}
            <circle cx="30" cy="22" r="9" fill="#BB8FCE" stroke="#8E44AD" strokeWidth={2}/>
            {/* 目 */}
            <circle cx="27" cy="21" r="1.5" fill="#000"/>
            <circle cx="33" cy="21" r="1.5" fill="#000"/>
            {/* 角 */}
            <polygon points="26,14 28,10 29,14" fill="#F9C33B"/>
            <polygon points="31,14 32,10 34,14" fill="#F9C33B"/>
            {/* 尻尾 */}
            <path d="M 30 48 Q 40 52 42 40" stroke="#8E44AD" strokeWidth={3} fill="none"/>
          </svg>
        )}

        {/* きらきらエフェクト */}
        {frame > 100 && (
          <>
            {[0, 1, 2, 3, 4].map((i) => {
              const sparkleDelay = 100 + i * 4;
              const sparkleOpacity = fadeIn(frame, sparkleDelay, 8);
              const angle = (i / 5) * Math.PI * 2;
              const r = 110 + Math.sin((frame + i * 10) / 8) * 8;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `calc(50% + ${Math.cos(angle) * r}px - 8px)`,
                    top: `calc(50% + ${Math.sin(angle) * r}px - 8px)`,
                    opacity: sparkleOpacity,
                    fontSize: 32,
                    color: COLORS.gold,
                    textShadow: `0 0 12px ${COLORS.gold}`,
                  }}
                >
                  ★
                </div>
              );
            })}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
