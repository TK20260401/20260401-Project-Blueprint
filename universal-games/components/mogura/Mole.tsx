import { Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Rect } from 'react-native-svg';
import { COLORS } from '../../lib/theme';

type Props = {
  size: number;
  visible: boolean;
  hit: boolean;
  onTap: () => void;
};

export function Mole({ size, visible, hit, onTap }: Props) {
  const tapArea = size + 40;
  return (
    <Pressable
      onPress={onTap}
      accessibilityRole="button"
      accessibilityLabel={visible ? 'もぐら' : 'あな'}
      style={[styles.container, { width: tapArea, height: tapArea }]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Hole */}
        <Ellipse cx="50" cy="85" rx="40" ry="12" fill={COLORS.hole} />
        <Ellipse cx="50" cy="85" rx="42" ry="14" fill="none" stroke={COLORS.holeRim} strokeWidth="2" />

        {visible && !hit && (
          <>
            {/* Body */}
            <Ellipse cx="50" cy="60" rx="28" ry="30" fill={COLORS.mole} />
            {/* Face */}
            <Circle cx="50" cy="52" r="22" fill={COLORS.mole} />
            {/* Eyes */}
            <Circle cx="42" cy="48" r="4" fill="#FFFFFF" />
            <Circle cx="58" cy="48" r="4" fill="#FFFFFF" />
            <Circle cx="42" cy="48" r="2" fill="#1A1A1A" />
            <Circle cx="58" cy="48" r="2" fill="#1A1A1A" />
            {/* Nose */}
            <Ellipse cx="50" cy="56" rx="5" ry="4" fill={COLORS.moleDark} />
            {/* Cheeks */}
            <Circle cx="36" cy="55" r="4" fill="#FFAB91" opacity={0.6} />
            <Circle cx="64" cy="55" r="4" fill="#FFAB91" opacity={0.6} />
          </>
        )}

        {hit && (
          <>
            {/* Hit mole - squished */}
            <Ellipse cx="50" cy="72" rx="30" ry="14" fill={COLORS.mole} />
            {/* X eyes */}
            <Rect x="38" y="67" width="8" height="2" fill="#1A1A1A" transform="rotate(45 42 68)" />
            <Rect x="38" y="67" width="8" height="2" fill="#1A1A1A" transform="rotate(-45 42 68)" />
            <Rect x="54" y="67" width="8" height="2" fill="#1A1A1A" transform="rotate(45 58 68)" />
            <Rect x="54" y="67" width="8" height="2" fill="#1A1A1A" transform="rotate(-45 58 68)" />
            {/* Stars */}
            <Circle cx="30" cy="50" r="3" fill="#FFD700" />
            <Circle cx="70" cy="45" r="3" fill="#FFD700" />
            <Circle cx="50" cy="38" r="2.5" fill="#FFD700" />
          </>
        )}
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
