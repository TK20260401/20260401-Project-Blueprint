import React from "react";
import { COLORS } from "../utils/colors";

type Props = {
  width?: number;
  height?: number;
  children?: React.ReactNode;
};

/**
 * iPhone風の端末フレーム（内部に任意の子要素を配置可能）
 */
export const PhoneMockup: React.FC<Props> = ({ width = 360, height = 720, children }) => {
  const radius = width * 0.12;
  const bezel = width * 0.025;
  const notchW = width * 0.35;
  const notchH = width * 0.055;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radius,
        background: "#0a0a0a",
        boxShadow: `0 0 0 ${bezel}px #1a1a1a, 0 20px 60px rgba(0,0,0,0.6)`,
        padding: bezel * 2,
        overflow: "hidden",
      }}
    >
      {/* 画面エリア */}
      <div
        style={{
          position: "absolute",
          left: bezel,
          top: bezel,
          right: bezel,
          bottom: bezel,
          borderRadius: radius * 0.85,
          background: COLORS.bgDark,
          overflow: "hidden",
        }}
      >
        {children}
      </div>

      {/* ノッチ */}
      <div
        style={{
          position: "absolute",
          top: bezel * 1.5,
          left: "50%",
          transform: "translateX(-50%)",
          width: notchW,
          height: notchH,
          background: "#000",
          borderRadius: notchH,
          zIndex: 10,
        }}
      />
    </div>
  );
};
