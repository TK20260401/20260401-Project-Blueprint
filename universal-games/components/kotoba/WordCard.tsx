import { View, Text, StyleSheet } from 'react-native';
import { Word } from '../../lib/kotoba/words';
import { COLORS, SPACING } from '../../lib/theme';

type Props = {
  word: Word;
  size?: number;
  fontSize?: number;
};

export function WordCard({ word, size = 100, fontSize = 28 }: Props) {
  const SvgComponent = word.svg;
  return (
    <View style={styles.container}>
      <SvgComponent size={size} />
      <Text style={[styles.label, { fontSize }]}>{word.hiragana}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
