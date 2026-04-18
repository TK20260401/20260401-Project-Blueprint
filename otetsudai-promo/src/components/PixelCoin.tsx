import React from "react";
import { COLORS } from "../utils/colors";

export const PixelCoin: React.FC<{ size?: number }> = ({ size = 64 }) => {
  const PX = size / 10;
  const gold = COLORS.gold;
  const goldLight = COLORS.goldLight;
  const goldDark = COLORS.goldDark;
  const glow = "#FFD700";
  const pixels: [number, number, string][] = [
    // Row 0: top edge
    [3, 0, goldDark], [4, 0, gold], [5, 0, gold], [6, 0, goldDark],
    // Row 1
    [2, 1, goldDark], [3, 1, gold], [4, 1, goldLight], [5, 1, goldLight], [6, 1, gold], [7, 1, goldDark],
    // Row 2
    [1, 2, goldDark], [2, 2, gold], [3, 2, goldLight], [4, 2, glow], [5, 2, glow], [6, 2, goldLight], [7, 2, gold], [8, 2, goldDark],
    // Row 3: currency mark
    [1, 3, goldDark], [2, 3, goldLight], [3, 3, goldDark], [4, 3, goldLight], [5, 3, goldLight], [6, 3, goldDark], [7, 3, goldLight], [8, 3, goldDark],
    // Row 4: center
    [0, 4, goldDark], [1, 4, gold], [2, 4, goldLight], [3, 4, goldDark], [4, 4, goldDark], [5, 4, goldDark], [6, 4, goldDark], [7, 4, goldLight], [8, 4, gold], [9, 4, goldDark],
    // Row 5
    [0, 5, goldDark], [1, 5, gold], [2, 5, goldLight], [3, 5, goldDark], [4, 5, gold], [5, 5, gold], [6, 5, goldDark], [7, 5, goldLight], [8, 5, gold], [9, 5, goldDark],
    // Row 6
    [1, 6, goldDark], [2, 6, gold], [3, 6, goldDark], [4, 6, goldLight], [5, 6, goldLight], [6, 6, goldDark], [7, 6, gold], [8, 6, goldDark],
    // Row 7
    [1, 7, goldDark], [2, 7, gold], [3, 7, gold], [4, 7, goldDark], [5, 7, goldDark], [6, 7, gold], [7, 7, gold], [8, 7, goldDark],
    // Row 8
    [2, 8, goldDark], [3, 8, gold], [4, 8, gold], [5, 8, gold], [6, 8, gold], [7, 8, goldDark],
    // Row 9: bottom edge
    [3, 9, goldDark], [4, 9, goldDark], [5, 9, goldDark], [6, 9, goldDark],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${10 * PX} ${10 * PX}`}>
      {pixels.map(([x, y, c], i) => (
        <rect key={i} x={x * PX} y={y * PX} width={PX} height={PX} fill={c} />
      ))}
    </svg>
  );
};
