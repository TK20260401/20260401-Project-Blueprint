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

/** マップ上の1マス。property の場合は物件＋クイズが紐づく */
export type Station = {
  id: string;
  index: number; // 円環上の位置（0 始まり）
  kind: StationKind;
  label: RubyText;
  /** kind==='property' のとき：取得対象の物件 */
  property?: Property;
  /** 通過時に得られるコイン（DESIGN 15.3.2 通過駅 +1〜2） */
  passCoin: number;
};

/** 物件（DESIGN 12.3 properties / property_stations） */
export type Property = {
  id: string;
  name: RubyText;
  price: number;
  category: "station" | "shop" | "factory" | "tourism" | "farm"; // 16.6.2 物件カテゴリ5色
  /** この物件を取得するために解くクイズ（DESIGN 15.3.3） */
  quiz: Quiz;
};

/** クイズ（DESIGN 12.3 quizzes）。3択固定（WF2 / ChoiceButton A/B/C） */
export type Quiz = {
  id: string;
  subject: "geography" | "economics" | "civics" | "math"; // 教科横断
  question: RubyText;
  choices: { key: "A" | "B" | "C"; text: RubyText }[];
  answer: "A" | "B" | "C";
  /** 不正解時のヒント（DESIGN 15.3.3 視覚+関連語） */
  hint: RubyText;
};

/** マップ（DESIGN 12.3 maps） */
export type GameMap = {
  id: string;
  seed: string;
  stations: Station[]; // index 順の円環
};

/** プレイヤー（DESIGN session_participants） */
export type Player = {
  userId: string;
  nickname: string;
  coin: number;
  score: number;
  stationIndex: number; // 現在地（円環 index）
  ownedPropertyIds: string[];
};

/** ゲーム進行フェーズ（クライアント状態機械） */
export type GamePhase =
  | "idle" // サイコロ待ち
  | "rolling" // サイコロ演出中
  | "moving" // 駒移動中
  | "quiz" // クイズ回答中
  | "result" // 1ターンの結果表示
  | "finished"; // セッション終了

/** ゲームセッション全体（DESIGN game_sessions / session_participants の集約） */
export type GameSession = {
  id: string;
  map: GameMap;
  players: Player[];
  currentPlayerIndex: number;
  turn: number;
  phase: GamePhase;
};
