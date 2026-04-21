import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACING } from '../../lib/theme';

type Props = {
  onReplay: () => void;
  onHome: () => void;
  elapsed?: number | null;
  bestTime?: number | null;
  isNewBest: boolean;
};

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function CompleteOverlay({ onReplay, onHome, elapsed, bestTime, isNewBest }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>できました!</Text>
        {elapsed != null && (
          <Text style={styles.time}>タイム: {formatTime(elapsed)}</Text>
        )}
        {isNewBest && <Text style={styles.best}>ベストこうしん!</Text>}
        <Pressable onPress={onReplay} style={styles.replayBtn} accessibilityLabel="もういちど">
          <Text style={styles.btnText}>もういちど</Text>
        </Pressable>
        <Pressable onPress={onHome} style={styles.homeBtn} accessibilityLabel="トップにもどる">
          <Text style={styles.homeBtnText}>トップにもどる</Text>
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  time: {
    fontSize: 22,
    color: COLORS.text,
  },
  best: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C42',
  },
  replayBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    minWidth: 160,
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  homeBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    minWidth: 160,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
