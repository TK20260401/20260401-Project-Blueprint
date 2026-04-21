import { Pressable, Text, StyleSheet } from 'react-native';
import { Word } from '../../lib/kotoba/words';
import { COLORS, SPACING } from '../../lib/theme';

type Props = {
  word: Word;
  onPress: () => void;
  disabled?: boolean;
  state?: 'normal' | 'correct' | 'wrong';
};

export function ChoiceButton({ word, onPress, disabled, state = 'normal' }: Props) {
  const SvgComponent = word.svg;
  const bgColor = state === 'correct' ? '#C8E6C9' : state === 'wrong' ? '#FFCDD2' : COLORS.surface;
  const borderColor = state === 'correct' ? '#4CAF50' : state === 'wrong' ? '#E57373' : '#DDD';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={word.hiragana}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bgColor, borderColor, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <SvgComponent size={60} />
      <Text style={styles.label}>{word.hiragana}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 3,
    padding: SPACING.sm,
    gap: SPACING.xs,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
