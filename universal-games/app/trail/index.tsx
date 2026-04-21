import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { NumberCircle } from '../../components/trail/NumberCircle';
import { TrailPath } from '../../components/trail/TrailPath';
import { CompleteOverlay } from '../../components/trail/CompleteOverlay';
import { COLORS, SPACING, MIN_TAP_SIZE } from '../../lib/theme';
import { generatePositions, Position } from '../../lib/trail/layout';
import { Difficulty, getLabels } from '../../lib/trail/game';
import { loadSettings } from '../../lib/settings';
import { loadJSON, saveJSON } from '../../lib/storage';
import { playHitSound } from '../../lib/sounds';

const HEADER_HEIGHT = 120;
const BOTTOM_MARGIN = 120;
const RECORDS_KEY = '@universal_games/trail_records';
type Records = { clears: number; bestTime: number | null; todayDate: string; streak: number; lastDate: string };
const DEFAULT_RECORDS: Records = { clears: 0, bestTime: null, todayDate: '', streak: 0, lastDate: '' };

export default function TrailGame() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [playing, setPlaying] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [hintIdx, setHintIdx] = useState(-1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saveEnabled, setSaveEnabled] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    loadSettings().then((s) => {
      setSoundEnabled(s.soundEnabled);
      setSaveEnabled(s.saveEnabled);
    });
  }, []);

  const areaW = width;
  const areaH = height - HEADER_HEIGHT - BOTTOM_MARGIN;

  const startGame = useCallback(() => {
    const l = getLabels(difficulty);
    const pos = generatePositions(l.length, areaW, areaH);
    setLabels(l);
    setPositions(pos);
    setCurrentIdx(0);
    setCompleted(false);
    setIsNewBest(false);
    setHintIdx(-1);
    setElapsed(0);
    startTimeRef.current = Date.now();
    setPlaying(true);
    if (showTimer) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 100);
    }
    resetHintTimer(0);
  }, [difficulty, areaW, areaH, showTimer]);

  const resetHintTimer = (nextIdx: number) => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setHintIdx(-1);
    hintTimerRef.current = setTimeout(() => {
      setHintIdx(nextIdx);
    }, 3000);
  };

  const handleTap = useCallback((index: number) => {
    if (completed) return;
    if (index === currentIdx) {
      if (soundEnabled) playHitSound();
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setHintIdx(-1);
      if (nextIdx >= labels.length) {
        // completed
        const finalElapsed = Date.now() - startTimeRef.current;
        setElapsed(finalElapsed);
        setCompleted(true);
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        if (hintTimerRef.current) { clearTimeout(hintTimerRef.current); hintTimerRef.current = null; }
        // save
        if (saveEnabled) {
          loadJSON<Records>(RECORDS_KEY, DEFAULT_RECORDS).then(async (records) => {
            const today = new Date().toISOString().slice(0, 10);
            const isToday = records.todayDate === today;
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            const streakContinues = records.lastDate === yesterday || records.lastDate === today;
            const newBest = showTimer && (records.bestTime === null || finalElapsed < records.bestTime);
            if (newBest) setIsNewBest(true);
            await saveJSON(RECORDS_KEY, {
              clears: isToday ? records.clears + 1 : 1,
              bestTime: newBest ? finalElapsed : records.bestTime,
              todayDate: today,
              streak: streakContinues ? (records.lastDate === today ? records.streak : records.streak + 1) : 1,
              lastDate: today,
            });
          });
        }
      } else {
        resetHintTimer(nextIdx);
      }
    } else {
      // wrong tap - hint
      resetHintTimer(currentIdx);
    }
  }, [currentIdx, completed, labels, soundEnabled, saveEnabled, showTimer]);

  const stopGame = () => {
    setPlaying(false);
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (hintTimerRef.current) { clearTimeout(hintTimerRef.current); hintTimerRef.current = null; }
  };

  if (!playing) {
    return (
      <View style={styles.container}>
        <View style={styles.setupHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="もどる">
            <Text style={styles.backText}>← もどる</Text>
          </Pressable>
        </View>
        <Text style={styles.setupTitle}>すうじトレイル</Text>

        <View style={styles.setupSection}>
          <Text style={styles.label}>むずかしさ</Text>
          <View style={styles.optionRow}>
            {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
              <Pressable key={d} onPress={() => setDifficulty(d)} style={[styles.optionChip, difficulty === d && styles.optionActive]}>
                <Text style={[styles.optionText, difficulty === d && styles.optionTextActive]}>
                  {d === 'easy' ? 'やさしい' : d === 'normal' ? 'ふつう' : 'むずかしい'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.setupSection}>
          <Text style={styles.label}>タイマー</Text>
          <View style={styles.optionRow}>
            <Pressable onPress={() => setShowTimer(false)} style={[styles.optionChip, !showTimer && styles.optionActive]}>
              <Text style={[styles.optionText, !showTimer && styles.optionTextActive]}>OFF</Text>
            </Pressable>
            <Pressable onPress={() => setShowTimer(true)} style={[styles.optionChip, showTimer && styles.optionActive]}>
              <Text style={[styles.optionText, showTimer && styles.optionTextActive]}>ON</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={startGame} style={styles.startButton} accessibilityLabel="はじめる">
          <Text style={styles.startText}>はじめる</Text>
        </Pressable>
      </View>
    );
  }

  const nextLabel = currentIdx < labels.length ? labels[currentIdx] : '';

  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <Pressable onPress={stopGame} style={styles.backBtn} accessibilityLabel="おわる">
          <Text style={styles.backText}>← おわる</Text>
        </Pressable>
        <Text style={styles.nextGuide}>つぎ: {nextLabel}</Text>
        {showTimer && <Text style={styles.timer}>{Math.floor(elapsed / 1000)}s</Text>}
      </View>

      <View style={[styles.gameArea, { width: areaW, height: areaH }]}>
        <TrailPath positions={positions} completedCount={currentIdx} width={areaW} height={areaH} />
        {labels.map((label, i) => {
          const state = i < currentIdx ? 'done' : i === currentIdx ? 'next' : 'waiting';
          return (
            <NumberCircle
              key={i}
              label={label}
              x={positions[i]?.x ?? 0}
              y={positions[i]?.y ?? 0}
              state={state}
              hinting={hintIdx === i}
              onPress={() => handleTap(i)}
            />
          );
        })}
      </View>

      {completed && (
        <CompleteOverlay
          onReplay={startGame}
          onHome={() => router.back()}
          elapsed={showTimer ? elapsed : null}
          bestTime={null}
          isNewBest={isNewBest}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  setupHeader: { paddingHorizontal: SPACING.md },
  setupTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },
  setupSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  optionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    flexWrap: 'wrap',
  },
  optionChip: {
    minWidth: MIN_TAP_SIZE,
    minHeight: MIN_TAP_SIZE,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.disabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
  },
  optionText: {
    fontSize: 20,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  optionTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  startButton: {
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    height: 60,
  },
  backBtn: {
    minWidth: MIN_TAP_SIZE,
    minHeight: MIN_TAP_SIZE,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  backText: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  nextGuide: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  timer: {
    fontSize: 20,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  gameArea: {
    position: 'relative',
  },
});
