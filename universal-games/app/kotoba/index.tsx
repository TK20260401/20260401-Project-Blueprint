import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { WordCard } from '../../components/kotoba/WordCard';
import { ChoiceButton } from '../../components/kotoba/ChoiceButton';
import { ResultOverlay } from '../../components/kotoba/ResultOverlay';
import { COLORS, SPACING, MIN_TAP_SIZE } from '../../lib/theme';
import { Word } from '../../lib/kotoba/words';
import { pickRandomWord, generateQuestion, Question } from '../../lib/kotoba/game';
import { loadSettings } from '../../lib/settings';
import { loadJSON, saveJSON } from '../../lib/storage';
import { playHitSound } from '../../lib/sounds';

const SESSION_LENGTH = 10;
const RECORDS_KEY = '@universal_games/kotoba_records';
type Records = { todayCount: number; todayCorrect: number; todayDate: string; streak: number; lastDate: string };
const DEFAULT_RECORDS: Records = { todayCount: 0, todayCorrect: 0, todayDate: '', streak: 0, lastDate: '' };

export default function KotobaGame() {
  const router = useRouter();
  const [playing, setPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [questionNum, setQuestionNum] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastCorrectWord, setLastCorrectWord] = useState('');
  const [choiceStates, setChoiceStates] = useState<('normal' | 'correct' | 'wrong')[]>(['normal', 'normal', 'normal']);
  const [finished, setFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [saveEnabled, setSaveEnabled] = useState(true);

  const startGame = useCallback(() => {
    loadSettings().then((s) => {
      setSoundEnabled(s.soundEnabled);
      setSaveEnabled(s.saveEnabled);
    });
    const first = pickRandomWord();
    setCurrentWord(first);
    setUsedIds([first.id]);
    setQuestionNum(1);
    setCorrectCount(0);
    setFinished(false);
    setShowResult(false);
    const q = generateQuestion(first, [first.id]);
    if (q) {
      setQuestion(q);
      setChoiceStates(['normal', 'normal', 'normal']);
    }
    setPlaying(true);
  }, []);

  const handleChoice = useCallback((index: number) => {
    if (!question || showResult) return;

    const isCorrect = index === question.correctIndex;
    const states: ('normal' | 'correct' | 'wrong')[] = question.choices.map((_, i) =>
      i === question.correctIndex ? 'correct' : i === index ? 'wrong' : 'normal'
    );
    setChoiceStates(states);
    setLastCorrect(isCorrect);
    setLastCorrectWord(question.choices[question.correctIndex].hiragana);
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      if (soundEnabled) playHitSound();
    }
    setShowResult(true);
  }, [question, showResult, soundEnabled]);

  const handleNext = useCallback(async () => {
    if (!question) return;
    const nextWord = question.currentWord;
    const newUsed = [...usedIds, nextWord.id];
    setUsedIds(newUsed);
    setCurrentWord(nextWord);
    setShowResult(false);

    const nextNum = questionNum + 1;
    if (nextNum > SESSION_LENGTH) {
      setFinished(true);
      if (saveEnabled) {
        const records = await loadJSON<Records>(RECORDS_KEY, DEFAULT_RECORDS);
        const today = new Date().toISOString().slice(0, 10);
        const isToday = records.todayDate === today;
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const streakContinues = records.lastDate === yesterday || records.lastDate === today;
        await saveJSON(RECORDS_KEY, {
          todayCount: isToday ? records.todayCount + SESSION_LENGTH : SESSION_LENGTH,
          todayCorrect: isToday ? records.todayCorrect + correctCount + (lastCorrect ? 1 : 0) : correctCount + (lastCorrect ? 1 : 0),
          todayDate: today,
          streak: streakContinues ? (records.lastDate === today ? records.streak : records.streak + 1) : 1,
          lastDate: today,
        });
      }
      return;
    }

    setQuestionNum(nextNum);
    const q = generateQuestion(nextWord, newUsed);
    if (q) {
      setQuestion(q);
      setChoiceStates(['normal', 'normal', 'normal']);
    } else {
      const fresh = pickRandomWord(newUsed);
      setCurrentWord(fresh);
      const q2 = generateQuestion(fresh, [...newUsed, fresh.id]);
      if (q2) {
        setQuestion(q2);
        setChoiceStates(['normal', 'normal', 'normal']);
      }
    }
  }, [question, usedIds, questionNum, saveEnabled, correctCount, lastCorrect]);

  if (!playing) {
    return (
      <View style={styles.container}>
        <View style={styles.setupHeader}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="もどる">
            <Text style={styles.backText}>← もどる</Text>
          </Pressable>
        </View>
        <View style={styles.startArea}>
          <Text style={styles.title}>ことばあそび</Text>
          <Text style={styles.desc}>しりとりで あそぼう!</Text>
          <Text style={styles.desc}>えを みて こたえを えらんでね</Text>
          <Pressable onPress={startGame} style={styles.startButton} accessibilityLabel="はじめる">
            <Text style={styles.startText}>はじめる</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.container}>
        <View style={styles.startArea}>
          <Text style={styles.title}>よくできました!</Text>
          <Text style={styles.scoreText}>{SESSION_LENGTH}もんちゅう {correctCount}もん せいかい!</Text>
          <Pressable onPress={startGame} style={styles.startButton} accessibilityLabel="もういちど">
            <Text style={styles.startText}>もういちど</Text>
          </Pressable>
          <Pressable onPress={() => router.back()} style={styles.homeButton} accessibilityLabel="トップにもどる">
            <Text style={styles.homeText}>トップにもどる</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <Pressable onPress={() => setPlaying(false)} style={styles.backBtn} accessibilityLabel="もどる">
          <Text style={styles.backText}>← もどる</Text>
        </Pressable>
        <Text style={styles.progress}>{questionNum} / {SESSION_LENGTH}</Text>
      </View>

      {currentWord && (
        <View style={styles.currentArea}>
          <WordCard word={currentWord} size={90} fontSize={30} />
          <Text style={styles.hint}>
            つぎは「{currentWord.endsWith}」で はじまる ことば
          </Text>
        </View>
      )}

      {question && (
        <View style={styles.choicesArea}>
          {question.choices.map((word, i) => (
            <ChoiceButton
              key={word.id}
              word={word}
              onPress={() => handleChoice(i)}
              disabled={showResult}
              state={choiceStates[i]}
            />
          ))}
        </View>
      )}

      {showResult && (
        <ResultOverlay
          correct={lastCorrect}
          correctWord={lastCorrectWord}
          onNext={handleNext}
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
  setupHeader: {
    paddingHorizontal: SPACING.md,
  },
  startArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  desc: {
    fontSize: 22,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    minHeight: 80,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  startText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  homeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    minHeight: 60,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
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
  progress: {
    fontSize: 20,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  currentArea: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  hint: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  choicesArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
});
