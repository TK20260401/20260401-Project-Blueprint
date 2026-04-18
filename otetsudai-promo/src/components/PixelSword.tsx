import React from "react";

export const PixelSword: React.FC<{ size?: number }> = ({ size = 64 }) => {
  const PX = size / 10;
  const pixels: [number, number, string][] = [
    [4, 0, "#C0C8D0"], [5, 0, "#E0E8F0"],
    [3, 1, "#E0E8F0"], [4, 1, "#FFFFFF"], [5, 1, "#C0C8D0"],
    [3, 2, "#A8B0B8"], [4, 2, "#E0E8F0"], [5, 2, "#C0C8D0"],
    [3, 3, "#A8B0B8"], [4, 3, "#C0C8D0"], [5, 3, "#A8B0B8"],
    [3, 4, "#A8B0B8"], [4, 4, "#C0C8D0"], [5, 4, "#A8B0B8"],
    [3, 5, "#A8B0B8"], [4, 5, "#C0C8D0"], [5, 5, "#A8B0B8"],
    // guard
    [2, 6, "#D4A030"], [3, 6, "#FFE066"], [4, 6, "#FFA623"], [5, 6, "#D4A030"], [6, 6, "#8A5200"],
    [1, 7, "#D4A030"], [2, 7, "#FFE066"], [3, 7, "#D4A030"], [4, 7, "#8A5200"], [5, 7, "#D4A030"], [6, 7, "#8A5200"], [7, 7, "#5C3A1E"],
    // handle
    [4, 8, "#5C3A1E"], [5, 8, "#8A5200"],
    [4, 9, "#5C3A1E"], [5, 9, "#5C3A1E"],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${10 * PX} ${10 * PX}`}>
      {pixels.map(([x, y, c], i) => (
        <rect key={i} x={x * PX} y={y * PX} width={PX} height={PX} fill={c} />
      ))}
    </svg>
  );
};
