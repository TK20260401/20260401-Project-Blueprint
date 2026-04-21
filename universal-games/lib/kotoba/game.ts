import { Word, WORDS } from './words';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandomWord(exclude: string[] = []): Word {
  const candidates = WORDS.filter((w) => !exclude.includes(w.id));
  if (candidates.length === 0) return WORDS[Math.floor(Math.random() * WORDS.length)];
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export type Question = {
  currentWord: Word;
  choices: Word[];
  correctIndex: number;
};

export function generateQuestion(currentWord: Word, usedIds: string[]): Question | null {
  const endChar = currentWord.endsWith;
  const candidates = WORDS.filter(
    (w) => w.startsWith === endChar && w.id !== currentWord.id && !usedIds.includes(w.id)
  );

  if (candidates.length === 0) return null;

  const correct = candidates[Math.floor(Math.random() * candidates.length)];

  const dummies = shuffle(
    WORDS.filter(
      (w) => w.startsWith !== endChar && w.id !== currentWord.id && w.id !== correct.id
    )
  ).slice(0, 2);

  if (dummies.length < 2) {
    const extra = WORDS.filter((w) => w.id !== currentWord.id && w.id !== correct.id && !dummies.some((d) => d.id === w.id));
    while (dummies.length < 2 && extra.length > 0) {
      dummies.push(extra.pop()!);
    }
  }

  const choices = shuffle([correct, ...dummies]);
  const correctIndex = choices.findIndex((c) => c.id === correct.id);

  return { currentWord: correct, choices, correctIndex };
}
