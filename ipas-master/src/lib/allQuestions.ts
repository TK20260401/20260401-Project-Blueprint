// 500問の統合インデックス
import type { Question, QuestionCategory } from "./questions-batch1";
import { batch1 } from "./questions-batch1";
import { batch2 } from "./questions-batch2";
import { batch3 } from "./questions-batch3";
import { batch4 } from "./questions-batch4";
import { batch5 } from "./questions-batch5";

export type { Question, QuestionCategory };

export const allQuestions: Question[] = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
];

// 100問単位のバッチ
export const batches100: { label: string; questions: Question[] }[] = [
  { label: "第1回（1〜100）", questions: batch1 },
  { label: "第2回（101〜200）", questions: batch2 },
  { label: "第3回（201〜300）", questions: batch3 },
  { label: "第4回（301〜400）", questions: batch4 },
  { label: "第5回（401〜500）", questions: batch5 },
];

// 後方互換
export const batches = batches100;

// N問単位のバッチを動的生成
export function generateBatches(size: number): { label: string; questions: Question[] }[] {
  const result: { label: string; questions: Question[] }[] = [];
  for (let i = 0; i < allQuestions.length; i += size) {
    const start = i + 1;
    const end = Math.min(i + size, allQuestions.length);
    result.push({
      label: `${start}〜${end}`,
      questions: allQuestions.slice(i, i + size),
    });
  }
  return result;
}

// カテゴリでフィルタ
export function getQuestionsByCategory(category: QuestionCategory): Question[] {
  return allQuestions.filter((q) => q.category === category);
}

// カテゴリ一覧（出現順）
export const allCategories: QuestionCategory[] = [
  "企業活動", "経営戦略", "システム戦略", "法務", "DX・AI活用",
  "プロジェクトマネジメント", "サービスマネジメント", "システム監査",
  "基礎理論", "コンピュータシステム", "ネットワーク", "データベース", "セキュリティ", "AI・データサイエンス",
];
