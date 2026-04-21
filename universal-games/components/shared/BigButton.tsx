import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, MIN_TAP_SIZE, SPACING } from '../../lib/theme';

type Props = {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  fontSize?: number;
  style?: ViewStyle;
};

export function BigButton({ label, onPress, color = COLORS.primary, disabled, fontSize = 24, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: disabled ? COLORS.disabled : color, opacity: pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <Text style={[styles.text, { fontSize, color: disabled ? COLORS.disabledText : '#FFFFFF' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TAP_SIZE,
    minWidth: MIN_TAP_SIZE,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
