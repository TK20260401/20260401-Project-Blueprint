// 教科別クイズバンク（DESIGN 7.2 教科×駅 / 7.3 動的難易度の難易度別出題）。
// 「ふつう」は各駅の themed クイズ（stationPool）を使い、ここには やさしい/むずかしい の
// 変種だけを置く。バンクに該当が無ければ themed クイズへフォールバックするので、
// コンテンツ追加だけで難易度カバレッジを広げられる（コード改修不要＝手戻りなし）。

import { rngFromSeed } from "./rng";
import { PROPERTY_POOL } from "./stationPool";
import type { Difficulty, Quiz, RubyText, Subject } from "./types";

const r = (base: string, ruby?: string): RubyText => ({ base, ruby });

// difficulty を必ず持つクイズ（バンク専用）。
type BankQuiz = Quiz & { difficulty: Difficulty };

export const QUIZ_BANK: BankQuiz[] = [
  // === geography ===
  {
    id: "qb-geo-e1",
    subject: "geography",
    difficulty: "easy",
    question: r("日本でいちばん大きい島は？", "にほんでいちばんおおきいしまは？"),
    choices: [
      { key: "A", text: r("本州", "ほんしゅう") },
      { key: "B", text: r("四国", "しこく") },
      { key: "C", text: r("九州", "きゅうしゅう") },
    ],
    answer: "A",
    hint: r("いちばん大きくて、東京もある島だよ", "いちばんおおきくて、とうきょうもあるしまだよ"),
  },
  {
    id: "qb-geo-e2",
    subject: "geography",
    difficulty: "easy",
    question: r("北海道は あつい？ さむい？", "ほっかいどうは あつい？ さむい？"),
    choices: [
      { key: "A", text: r("さむいことが多い", "さむいことがおおい") },
      { key: "B", text: r("一年中あつい", "いちねんじゅうあつい") },
      { key: "C", text: r("さばくだ") },
    ],
    answer: "A",
    hint: r("いちばん北にある、雪のふる島だよ", "いちばんきたにある、ゆきのふるしまだよ"),
  },
  {
    id: "qb-geo-h1",
    subject: "geography",
    difficulty: "hard",
    question: r("日本の4つの大きな島で、いちばん北は？", "にほんの4つのおおきなしまで、いちばんきたは？"),
    choices: [
      { key: "A", text: r("北海道", "ほっかいどう") },
      { key: "B", text: r("本州", "ほんしゅう") },
      { key: "C", text: r("九州", "きゅうしゅう") },
    ],
    answer: "A",
    hint: r("いちばん上（北）にある、すずしい島だよ", "いちばんうえ（きた）にある、すずしいしまだよ"),
  },
  {
    id: "qb-geo-h2",
    subject: "geography",
    difficulty: "hard",
    question: r("「中部地方」にある、日本一高い山は？", "「ちゅうぶちほう」にある、にほんいちたかいやまは？"),
    choices: [
      { key: "A", text: r("富士山", "ふじさん") },
      { key: "B", text: r("立山", "たてやま") },
      { key: "C", text: r("白山", "はくさん") },
    ],
    answer: "A",
    hint: r("しずおかと山なしのさかいにある山だよ", "しずおかとやまなしのさかいにあるやまだよ"),
  },

  // === economics ===
  {
    id: "qb-eco-e1",
    subject: "economics",
    difficulty: "easy",
    question: r("ものを買うときに わたすものは？", "ものをかうときに わたすものは？"),
    choices: [
      { key: "A", text: r("おかね") },
      { key: "B", text: r("いし") },
      { key: "C", text: r("かみくず") },
    ],
    answer: "A",
    hint: r("おさいふに入っているものだよ", "おさいふにはいっているものだよ"),
  },
  {
    id: "qb-eco-e2",
    subject: "economics",
    difficulty: "easy",
    question: r("100円で50円のあめを買った。おつりは？", "100えんで50えんのあめをかった。おつりは？"),
    choices: [
      { key: "A", text: r("50円", "50えん") },
      { key: "B", text: r("100円", "100えん") },
      { key: "C", text: r("150円", "150えん") },
    ],
    answer: "A",
    hint: r("100 - 50 をけいさんしよう"),
  },
  {
    id: "qb-eco-h1",
    subject: "economics",
    difficulty: "hard",
    question: r("1こ80円のパンを3こ。ぜんぶでいくら？", "1こ80えんのパンを3こ。ぜんぶでいくら？"),
    choices: [
      { key: "A", text: r("240円", "240えん") },
      { key: "B", text: r("160円", "160えん") },
      { key: "C", text: r("200円", "200えん") },
    ],
    answer: "A",
    hint: r("80 × 3 をけいさんしよう"),
  },
  {
    id: "qb-eco-h2",
    subject: "economics",
    difficulty: "hard",
    question: r("ものを たくさん作ると、ねだんは どうなりやすい？", "ものを たくさんつくると、ねだんは どうなりやすい？"),
    choices: [
      { key: "A", text: r("やすくなりやすい") },
      { key: "B", text: r("かならず高くなる", "かならずたかくなる") },
      { key: "C", text: r("かわらない") },
    ],
    answer: "A",
    hint: r("たくさんあると、安く売れるよ", "たくさんあると、やすくうれるよ"),
  },

  // === civics ===
  {
    id: "qb-civ-e1",
    subject: "civics",
    difficulty: "easy",
    question: r("こまっている人がいたら どうする？", "こまっているひとがいたら どうする？"),
    choices: [
      { key: "A", text: r("たすける") },
      { key: "B", text: r("むしする") },
      { key: "C", text: r("わらう") },
    ],
    answer: "A",
    hint: r("やさしい気もちで どうするといいかな", "やさしいきもちで どうするといいかな"),
  },
  {
    id: "qb-civ-e2",
    subject: "civics",
    difficulty: "easy",
    question: r("学校の やくそく（ルール）は なんのため？", "がっこうの やくそく（ルール）は なんのため？"),
    choices: [
      { key: "A", text: r("みんなが気もちよくすごすため", "みんながきもちよくすごすため") },
      { key: "B", text: r("こまらせるため") },
      { key: "C", text: r("いみはない") },
    ],
    answer: "A",
    hint: r("みんなのためのやくそくだよ"),
  },
  {
    id: "qb-civ-h1",
    subject: "civics",
    difficulty: "hard",
    question: r("市や町の代表を みんなでえらぶことを何という？", "しやまちのだいひょうを みんなでえらぶことをなんという？"),
    choices: [
      { key: "A", text: r("せんきょ") },
      { key: "B", text: r("くじびき") },
      { key: "C", text: r("じゃんけん") },
    ],
    answer: "A",
    hint: r("とうひょうをして代表をきめることだよ", "とうひょうをしてだいひょうをきめることだよ"),
  },
  {
    id: "qb-civ-h2",
    subject: "civics",
    difficulty: "hard",
    question: r("国の大事なことを 話し合ってきめる場所は？", "くにのだいじなことを はなしあってきめるばしょは？"),
    choices: [
      { key: "A", text: r("国会", "こっかい") },
      { key: "B", text: r("工場", "こうじょう") },
      { key: "C", text: r("公園", "こうえん") },
    ],
    answer: "A",
    hint: r("「国」の字が入る場所だよ", "「くに」のじがはいるばしょだよ"),
  },

  // === math ===
  {
    id: "qb-math-e1",
    subject: "math",
    difficulty: "easy",
    question: r("2 + 3 は？"),
    choices: [
      { key: "A", text: r("5") },
      { key: "B", text: r("4") },
      { key: "C", text: r("6") },
    ],
    answer: "A",
    hint: r("ゆびで かぞえてみよう"),
  },
  {
    id: "qb-math-e2",
    subject: "math",
    difficulty: "easy",
    question: r("10 - 4 は？"),
    choices: [
      { key: "A", text: r("6") },
      { key: "B", text: r("5") },
      { key: "C", text: r("7") },
    ],
    answer: "A",
    hint: r("10から4つ へらしてみよう"),
  },
  {
    id: "qb-math-h1",
    subject: "math",
    difficulty: "hard",
    question: r("6 × 4 は？"),
    choices: [
      { key: "A", text: r("24") },
      { key: "B", text: r("20") },
      { key: "C", text: r("18") },
    ],
    answer: "A",
    hint: r("6を4回たすよ（6+6+6+6）", "6を4かいたすよ（6+6+6+6）"),
  },
  {
    id: "qb-math-h2",
    subject: "math",
    difficulty: "hard",
    question: r("100を 4人で 同じ数ずつ分けると 1人いくつ？", "100を 4にんで おなじかずずつわけると 1にんいくつ？"),
    choices: [
      { key: "A", text: r("25") },
      { key: "B", text: r("40") },
      { key: "C", text: r("20") },
    ],
    answer: "A",
    hint: r("100 ÷ 4 をけいさんしよう"),
  },
];

/**
 * 教科×難易度でクイズを1問えらぶ（決定的）。
 * 1) (subject, difficulty) に一致するバンク問題からシードで選ぶ
 * 2) 無ければ fallback（駅の themed クイズ）を返す
 * excludeId は直前と同じ問題の連続を避けるため。
 */
export function pickQuiz(
  seed: string,
  subject: Subject,
  difficulty: Difficulty,
  fallback: Quiz,
  excludeId?: string,
): Quiz {
  let pool = QUIZ_BANK.filter((q) => q.subject === subject && q.difficulty === difficulty);
  if (excludeId) {
    const filtered = pool.filter((q) => q.id !== excludeId);
    if (filtered.length > 0) pool = filtered;
  }
  if (pool.length === 0) return fallback;
  const rng = rngFromSeed(seed);
  return pool[Math.floor(rng() * pool.length)];
}

// 全クイズの登録簿（themed=各駅 + バンク）。ふくしゅう(DESIGN 7.6)で quizId から問題を引く用。
// 将来 Supabase の quizzes テーブル＋learning_records(quiz_id FK) と同型。
const ALL_QUIZZES: Quiz[] = [...QUIZ_BANK, ...PROPERTY_POOL.map((p) => p.quiz)];
const QUIZ_BY_ID = new Map(ALL_QUIZZES.map((q) => [q.id, q]));

/** quizId から問題を引く（ふくしゅう再出題用）。無ければ undefined。 */
export function quizById(id: string): Quiz | undefined {
  return QUIZ_BY_ID.get(id);
}
