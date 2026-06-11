// tetsu-board ドメイン型（DESIGN.md 12.3 ER / 15.3 Server Action と整合）
// クライアント版。将来 Supabase テーブル(game_sessions / maps / properties / quizzes …)へ
// そのまま対応させられるよう、命名・構造を設計に合わせている。

/** ルビ付きテキスト。base=漢字を含む表記、ruby=読み（全漢字ルビ方針 7.x） */
export type RubyText = {
  base: string;
  ruby?: string;
};

/** マス（駅）の種別。DESIGN 4.4 円環 + 少数分岐 / arrivedEvent と整合 */
export type StationKind = "start" | "property" | "event" | "goal";

/** 物件カテゴリ（DESIGN 4.2 マスター駅プール / 16.6.2 物件カテゴリ5色） */
export type StationCategory = "farm" | "sea" | "factory" | "city" | "tourism";

/**
 * マップ上の1マス。グラフ構造（next エッジ）で表現する。
 * 円環は「各駅の next が1つ」の特殊形。分岐(DESIGN 4.5)は next が複数になる拡張で表せる
 * ため、円環専用構造を作り込まず最初からグラフにしておく（手戻り防止）。
 */
export type Station = {
  id: string;
  index: number; // 配列上の通し番号（安定キー用）
  kind: StationKind;
  label: RubyText;
  /** 次に進める駅 id（1つ=直進 / 複数=分岐）。DESIGN 4.5 αβγ分岐 */
  next: string[];
  /** 盤面上の座標（px）。generateMap が算出（円環＋分岐の見た目を確定） */
  pos: { x: number; y: number };
  /** kind==='property' のとき：取得対象の物件 */
  property?: Property;
  /** 通過時のコイン増減（正=もらえる / 負=ピンチで失う。DESIGN 4.5 危険ルート） */
  passCoin: number;
  /** 危険マスか（DESIGN 4.5 安全/危険）。ピンチ演出・色分け用 */
  danger?: boolean;
  /** 周回（spine）上の駅か。分岐の経路に依らず毎周必ず通るため目的地候補になる（DESIGN 4.6） */
  loop?: boolean;
};

/** 物件（DESIGN 12.3 properties / property_stations） */
export type Property = {
  id: string;
  name: RubyText;
  price: number;
  category: StationCategory; // 16.6.2 物件カテゴリ5色 / 4.2 駅プール5カテゴリ
  /** 実在駅・都道府県の副表示（DESIGN 4.1 ハイブリッド表示。例: 「愛媛・松山駅」） */
  sub?: RubyText;
  /** この物件を取得するために解くクイズ（DESIGN 15.3.3） */
  quiz: Quiz;
};

/** 教科（DESIGN 7.2 教科×駅）。将来 情報・家庭 等を足しても他に波及しないよう型を分離 */
export type Subject = "geography" | "economics" | "civics" | "math";

/** クイズ（DESIGN 12.3 quizzes）。3択固定（WF2 / ChoiceButton A/B/C） */
export type Quiz = {
  id: string;
  subject: Subject; // 教科横断
  /** 難易度（DESIGN 7.3 E-24 動的難易度。未指定は "normal"＝ふつう） */
  difficulty?: Difficulty;
  question: RubyText;
  choices: { key: "A" | "B" | "C"; text: RubyText }[];
  answer: "A" | "B" | "C";
  /** 不正解時のヒント（DESIGN 15.3.3 視覚+関連語） */
  hint: RubyText;
};

/** 動的難易度の3段階（DESIGN 7.3.2）。児童には段階名を見せず感情ベースで表現する（7.3.1） */
export type Difficulty = "easy" | "normal" | "hard";

/** 経路の種別（DESIGN 4.5） */
export type RouteKind = "short" | "long"; // 近道 / 遠回り

/** 分岐の片側の選択肢（「どっちにいく?」の1つ） */
export type BranchOption = {
  firstNextId: string; // この方向に進む最初の駅 id（fork.next に含まれる）
  routeLabel: RubyText; // 行先名（合流先の駅名）
  route: RouteKind; // 近道 / 遠回り
  steps: number; // 合流まで何マスか（DESIGN 4.5 距離表示）
  danger: boolean; // 危険ルートか（安全/危険）
};

/** 分岐情報（DESIGN 4.5 / maps.branches_json 相当） */
export type BranchInfo = {
  forkId: string; // 分岐元の駅 id（next.length>1）
  pattern: 1 | 2 | 3 | 4; // 4パターン（近道&危険 / 近道&安全 / 両方危険 / 両方安全）
  options: BranchOption[]; // 2択
};

/** マップ（DESIGN 12.3 maps） */
export type GameMap = {
  id: string;
  seed: string;
  stations: Station[];
  branches: BranchInfo[]; // 分岐の一覧（DESIGN 4.5）
};

/** プレイヤー（DESIGN session_participants） */
export type Player = {
  userId: string;
  nickname: string;
  coin: number;
  score: number;
  stationId: string; // 現在地の駅 id（グラフ対応）
  ownedPropertyIds: string[];
};

/** ゲーム進行フェーズ（クライアント状態機械） */
export type GamePhase =
  | "idle" // サイコロ待ち
  | "rolling" // サイコロ演出中
  | "moving" // 駒移動中
  | "branch" // 分岐の選択待ち（DESIGN 4.5）
  | "card" // カード・災難イベント表示中（DESIGN 4.2 カードの駅/ピンチの駅）
  | "quiz" // クイズ回答中
  | "result" // 1ターンの結果表示
  | "finished"; // セッション終了

/** カード・災難イベント（DESIGN 4.2 イベント駅 カードの駅🃏 / ピンチの駅⚠️） */
export type Card = {
  id: string;
  kind: "lucky" | "disaster"; // ラッキー（良）/ さいなん（悪）
  emoji: string;
  title: RubyText;
  desc: RubyText;
  coin: number; // 所持コインの増減（正=もらえる / 負=失う）
  /** 災難キャラ（独自・ボンビー相当）が憑くか。次の自分のターン開始時にいたずらして去る */
  bonby?: boolean;
};

/** ゲームセッション全体（DESIGN game_sessions / session_participants の集約） */
export type GameSession = {
  id: string;
  map: GameMap;
  players: Player[];
  currentPlayerIndex: number;
  turn: number;
  phase: GamePhase;
};
