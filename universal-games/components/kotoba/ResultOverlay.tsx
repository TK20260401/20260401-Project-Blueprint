import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { COLORS, SPACING } from '../../lib/theme';

type Props = {
  correct: boolean;
  correctWord: string;
  onNext: () => void;
};

function HanamaruSvg() {
  return (
    <Svg width={80} height={80} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="40" fill="none" stroke="#FF6B6B" strokeWidth="6" />
      <Circle cx="50" cy="50" r="30" fill="none" stroke="#FFD93D" strokeWidth="4" />
      <Path d="M30 55 L45 65 L72 35" stroke="#4CAF50" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ResultOverlay({ correct, correctWord, onNext }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {correct ? (
          <>
            <HanamaruSvg />
            <Text style={styles.correctText}>すごい!</Text>
          </>
        ) : (
          <>
            <Text style={styles.wrongText}>おしい!</Text>
            <Text style={styles.answerText}>
              こたえは「{correctWord}」だったね
            </Text>
          </>
        )}
        <Pressable onPress={onNext} style={styles.nextButton} accessibilityLabel="つぎへ">
          <Text style={styles.nextText}>つぎへ</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    minWidth: 260,
  },
  correctText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  wrongText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C42',
  },
  answerText: {
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    minWidth: 120,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  nextText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
