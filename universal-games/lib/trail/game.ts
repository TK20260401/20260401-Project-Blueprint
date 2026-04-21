export type Difficulty = 'easy' | 'normal' | 'hard';

const HIRAGANA = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'];

export function getLabels(difficulty: Difficulty): string[] {
  if (difficulty === 'easy') {
    return ['1', '2', '3', '4', '5'];
  }
  if (difficulty === 'normal') {
    return Array.from({ length: 10 }, (_, i) => String(i + 1));
  }
  // hard: 1→あ→2→い→3→う→...→10→こ
  const labels: string[] = [];
  for (let i = 0; i < 10; i++) {
    labels.push(String(i + 1));
    labels.push(HIRAGANA[i]);
  }
  return labels;
}

export function getCount(difficulty: Difficulty): number {
  return getLabels(difficulty).length;
}
