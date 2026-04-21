import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../lib/theme';

type Props = {
  label: string;
  x: number;
  y: number;
  state: 'waiting' | 'next' | 'done';
  hinting: boolean;
  onPress: () => void;
};

const SIZE = 100;
const TAP_EXTRA = 20;

export function NumberCircle({ label, x, y, state, hinting, onPress }: Props) {
  const bg = state === 'done' ? COLORS.primary : state === 'next' && hinting ? '#FFE082' : '#FFFFFF';
  const textColor = state === 'done' ? '#FFFFFF' : COLORS.text;
  const borderColor = state === 'done' ? COLORS.primaryDark : state === 'next' ? COLORS.accent : '#CCCCCC';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.circle,
        {
          left: x - (SIZE + TAP_EXTRA) / 2,
          top: y - (SIZE + TAP_EXTRA) / 2,
          width: SIZE + TAP_EXTRA,
          height: SIZE + TAP_EXTRA,
          borderColor,
          backgroundColor: bg,
          opacity: hinting ? (state === 'next' ? 1 : 0.9) : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
