import Svg, { Line } from 'react-native-svg';
import { StyleSheet } from 'react-native';
import { Position } from '../../lib/trail/layout';
import { COLORS } from '../../lib/theme';

type Props = {
  positions: Position[];
  completedCount: number;
  width: number;
  height: number;
};

export function TrailPath({ positions, completedCount, width, height }: Props) {
  if (completedCount < 2) return null;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      {Array.from({ length: completedCount - 1 }, (_, i) => (
        <Line
          key={i}
          x1={positions[i].x}
          y1={positions[i].y}
          x2={positions[i + 1].x}
          y2={positions[i + 1].y}
          stroke={COLORS.primary}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.6}
        />
      ))}
    </Svg>
  );
}
