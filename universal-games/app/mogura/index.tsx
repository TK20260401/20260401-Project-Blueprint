import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Mole } from '../../components/mogura/Mole';
import { COLORS, SPACING, MIN_TAP_SIZE } from '../../lib/theme';
import { loadSettings } from '../../lib/settings';
import { loadJSON, saveJSON } from '../../lib/storage';
import { playHitSound } from '../../lib/sounds';

type Speed = 'slow' | 'normal' | 'fast';
type GridSize = 4 | 9 | 16;

const SPEED_MS: Record<Speed, number> = { slow: 2000, normal: 1200, fast: 800 };
const GRID_COLS: Record<GridSize, number> = { 4: 2, 9: 3, 16: 4 };

const RECORDS_KEY = '@universal_games/mogura_records';
type Records = { todayCount: number; todayDate: string; bestSession: number; streak: number; lastDate: string };
const DEFAULT_RECORDS: Records = { todayCount: 0, todayDate: '', bestSession: 0, streak: 0, lastDate: '' };

export default function MoguraGame() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [speed, setSpeed] = useState<Speed>('normal');
  const [maxMoles, setMaxMoles] = useState(1);
  const [gridSize, setGridSize] = useState<GridSize>(9);
  const [playing, setPlaying] = useState(false);
  const [count, setCount] = useState(0);
  const [moles, setMoles] = useState<boolean[]>([]);
  const [hits, setHits] = useState<boolean[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saveEnabled, setSaveEnabled] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadSettings().then((s) => {
      setSoundEnabled(s.soundEnabled);
      setSaveEnabled(s.saveEnabled);
    });
  }, []);

  const startGame = () => {
    setPlaying(true);
    setCount(0);
    setMoles(Array(gridSize).fill(false));
    setHits(Array(gridSize).fill(false));
  };

  const stopGame = useCallback(async () => {
    setPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (saveEnabled && count > 0) {
      const records = await loadJSON<Records>(RECORDS_KEY, DEFAULT_RECORDS);
      const today = new Date().toISOString().slice(0, 10);
      const isToday = records.todayDate === today;
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streakContinues = records.lastDate === yesterday || records.lastDate === today;
      const updated: Records = {
        todayCount: isToday ? records.todayCount + count : count,
        todayDate: today,
        bestSession: Math.max(records.bestSession, count),
        streak: streakContinues ? (records.lastDate === today ? records.streak : records.streak + 1) : 1,
        lastDate: today,
      };
      await saveJSON(RECORDS_KEY, updated);
    }
  }, [count, saveEnabled]);

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      setMoles((prev) => {
        const next = Array(gridSize).fill(false);
        const available = Array.from({ length: gridSize }, (_, i) => i);
        const numToShow = Math.min(maxMoles, gridSize);
        for (let i = 0; i < numToShow; i++) {
          const idx = Math.floor(Math.random() * available.length);
          next[available[idx]] = true;
          available.splice(idx, 1);
        }
        return next;
      });
      setHits(Array(gridSize).fill(false));
    };
    tick();
    timerRef.current = setInterval(tick, SPEED_MS[speed]);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, gridSize, maxMoles]);

  const handleTap = (index: number) => {
    if (!moles[index] || hits[index]) return;
    setHits((prev) => { const n = [...prev]; n[index] = true; return n; });
    setCount((c) => c + 1);
    if (soundEnabled) playHitSound();
  };

  const cols = GRID_COLS[gridSize];
  const cellSize = Math.min((width - SPACING.lg * 2) / cols, 160);

  if (!playing) {
    return (
      <View style={styles.container}>
        <View style={styles.setupHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="もどる">
            <Text style={styles.backText}>← もどる</Text>
          </Pressable>
        </View>

        <Text style={styles.setupTitle}>もぐらたたき</Text>

        <View style={styles.setupSection}>
          <Text style={styles.label}>はやさ</Text>
          <View style={styles.optionRow}>
            {(['slow', 'normal', 'fast'] as Speed[]).map((s) => (
              <Pressable key={s} onPress={() => setSpeed(s)} style={[styles.optionChip, speed === s && styles.optionActive]}>
                <Text style={[styles.optionText, speed === s && styles.optionTextActive]}>
                  {s === 'slow' ? 'ゆっくり' : s === 'normal' ? 'ふつう' : 'はやい'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.setupSection}>
          <Text style={styles.label}>いちどに でるかず</Text>
          <View style={styles.optionRow}>
            {[1, 2, 3].map((n) => (
              <Pressable key={n} onPress={() => setMaxMoles(n)} style={[styles.optionChip, maxMoles === n && styles.optionActive]}>
                <Text style={[styles.optionText, maxMoles === n && styles.optionTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.setupSection}>
          <Text style={styles.label}>あなの かず</Text>
          <View style={styles.optionRow}>
            {([4, 9, 16] as GridSize[]).map((n) => (
              <Pressable key={n} onPress={() => setGridSize(n)} style={[styles.optionChip, gridSize === n && styles.optionActive]}>
                <Text style={[styles.optionText, gridSize === n && styles.optionTextActive]}>{n}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable onPress={startGame} style={styles.startButton} accessibilityLabel="はじめる">
          <Text style={styles.startText}>はじめる</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <Pressable onPress={stopGame} style={styles.backBtn} accessibilityLabel="おわる">
          <Text style={styles.backText}>← おわる</Text>
        </Pressable>
        <Text style={styles.counter}>たたいた: {count}</Text>
      </View>

      <View style={[styles.grid, { maxWidth: cellSize * cols + SPACING.sm * cols }]}>
        {moles.map((visible, i) => (
          <View key={i} style={{ width: cellSize, height: cellSize, alignItems: 'center', justifyContent: 'center' }}>
            <Mole size={cellSize * 0.75} visible={visible} hit={hits[i]} onTap={() => handleTap(i)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  setupHeader: {
    paddingHorizontal: SPACING.md,
  },
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
    marginBottom: SPACING.md,
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
  counter: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
});
