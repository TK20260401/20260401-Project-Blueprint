# Logic-Riichi（ロジリーチ）Education Edition

**麻雀を解くことで情報学的素養を身につける、教育版麻雀プラットフォーム**

本番URL: <https://logic-riichi.vercel.app>

## 目的

麻雀の対局を「問題解決のシミュレーション」と定義し、初心者が挫折する複雑なルールをAIが「論理的ステップ」に分解して提示する。ゲーミフィケーション（スコア・連続正解・難易度段階）により学習動機を維持しながら、SDL（Self-Directed Learning: 自己主導型学習）のサイクルで「情報I」の計算モデルや「FE/AP」のアルゴリズムを自律的に体得することを目指す。

## コンセプト

「教育版桃鉄」や「マイクラ」に並ぶ教育版麻雀として、システムコンポーネントの役割を「教育的メカニズム」に全振りした設計。単なる「麻雀ができるアプリ」ではなく、「麻雀を解くことで情報学的素養を身につける学習OS」として位置づける。

- **ゲーミフィケーション**: 正解率・連続正解・最高記録のリアルタイム表示、難易度段階（Easy/Standard/Hard）による達成感の設計
- **SDL（自己主導型学習）**: 答えではなくヒント・ガイドを提供し、学習者が自ら思考・試行するプロセスを重視。再認法→再生法の段階的な足場外しで自走力を育成

## システムコンポーネント

| コンポーネント | 役割 | 習得スキル |
| --- | --- | --- |
| Algorithm Visualizer | 牌の整列プロセスをアニメーション表示し、ソートロジックを可視化 | ソートアルゴリズム（情報I） |
| Logic Analyzer | 14枚を「4面子+1雀頭」に分解する全探索を実行し、最短のアガリを論理演算 | 再帰処理・多次元配列（FE科目B） |
| Probabilistic Simulator | 放銃確率やツモ期待値をリアルタイムで数値化・グラフ化 | モデル化とシミュレーション（情報I） |
| AI Learning Scaffold | 答えではなく「論理的なヒント」を生成し、自走学習を支援 | 自走自律学習（SDL） |
| Learning Trace DB | 思考時間・エラー傾向をSupabaseに蓄積し、弱点分析レポートを自動生成 | データサイエンス・統計分析 |

## Changelog

| Version | Date | Changes |
| --- | --- | --- |
| v29 | 2026-04-03 | Supabase Auth認証UI追加（ログイン/新規登録/マイページ）、AuthProvider/AuthButtonコンポーネント、Supabase接続先をTK20260401's Projectに変更、SSGビルド時のSupabaseガード追加 |
| v28 | 2026-04-02 | ルビ・テキストの色コントラスト全面改善（rt inherit方式） |
| v27 | 2026-04-02 | レスポンシブ対応（モバイル/タブレット/PC）、QRコード生成 |
| v23-v26 | 2026-04-02 | アルゴリズム問題を再認法/再生法に基づき再構築、難易度UIボタン、自動ルビ |
| v19-v22 | 2026-04-02 | Supabase連携（スコアDB保存）、正解率計算改善 |
| v13-v18 | 2026-04-01 | アルゴリズム実装問題追加、ルビ修正、手牌ハイライト、難易度再設計 |
| v9-v12 | 2026-04-01 | 難易度別制限時間・ヒント、解説表示、アクセシビリティ・UD全面改修 |
| v1-v8 | 2026-04-01 | 初期構築、牌ビジュアル改善、用語注釈、aboutページ |

## 現在の実装状況（v29）

### 認証システム

| 機能 | 説明 |
| --- | --- |
| ログイン | メール/パスワード認証（Supabase Auth） |
| 新規登録 | メール確認付きアカウント作成 |
| マイページ | 学習統計表示・ログアウト |
| ゲストモード | ログインなしでも全機能利用可能 |
| AuthProvider | React Contextで認証状態を全コンポーネントに提供 |

### 待ち牌クイズ

13枚の手牌から待ち牌を当てるクイズ。回答後にアガリ形の解説を表示。

| 難易度 | 制限時間 | ヒント | 手牌ハイライト |
| --- | --- | --- | --- |
| Easy | 3分 | ガイド充実 | あり（色分け） |
| Standard | 2分 | 少しヒント | なし |
| Hard | 1分 | なし | なし |

### アルゴリズム実装問題

待ち牌計算のコードを読み解く問題。心理学の記憶想起の測定法に基づく難易度設計。

| 難易度 | 形式 | ガイド | 学習法 |
| --- | --- | --- | --- |
| Easy | 選択肢 | あり | 再認法 |
| Standard | 虫食い入力 | あり | 再認法 |
| Hard | 自由記述 | なし | 再生法 |

> 再認法: 選択肢から正解を見つける手法。再生法: ヒントなしで自ら記述・言語化する手法。一般的に再認法は再生法よりも容易で、記憶の検索効率が高いとされている。

### アクセシビリティ・UD対応

- 全漢字にルビ（ふりがな）付き
- 牌画像に詳細なalt属性（WCAG AA以上）
- 視覚障害者・高齢者向けの大きめUI
- キーボード操作・スクリーンリーダー対応
- レスポンシブ対応（モバイル・タブレット）
- 「アガリとは？」の丁寧なビジュアル説明

### スコア管理

- 個別正答数のsumで正解率を計算（四捨五入）
- 連続正解・最高記録をリアルタイム更新
- Supabaseに全回答結果を永続化

## 技術スタック

| Category | Technology | Version | Purpose |
| --- | --- | --- | --- |
| Framework | Next.js (App Router) | 16.2.2 | SSG/SSR対応のReactフレームワーク |
| UI Library | React | 19.2.4 | コンポーネントベースのUI構築 |
| Styling | Tailwind CSS | 4.x | ユーティリティファーストCSS |
| Auth/DB | Supabase (PostgreSQL, RLS, Auth) | 2.x | 認証・スコア永続化・RLSセキュリティ |
| QR Code | qrcode.react | 4.x | SVGベースQRコード生成 |
| Language | TypeScript | 5.x | 型安全な開発 |
| Font | Geist (Sans/Mono) | — | Vercel公式フォント |
| Linter | ESLint | 9.x | コード品質の維持 |
| Build | Turbopack | (built-in) | 高速ビルド・HMR |
| Deploy | Vercel | — | ホスティング・CI/CD |
| AI Engine | Claude Code | — | 教育的コーチングの実装と開発支援 |
| Tile Images | FluffyStuff/riichi-mahjong-tiles | — | CC0（パブリックドメイン） |

## 再現手順

```bash
git clone https://github.com/TK20260401/logic-riichi.git
cd logic-riichi
npm install
```

`.env.local` を作成し、Supabaseの認証情報を設定:

```text
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

Supabase SQL Editorで `scores` テーブルを作成:

```sql
create table scores (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  difficulty text not null,
  quiz_type text not null,
  is_correct boolean not null,
  time_left integer,
  session_id text not null
);
alter table scores enable row level security;
create policy "Insert" on scores for insert with check (true);
create policy "Select" on scores for select using (true);
```

起動:

```bash
npm run dev    # http://localhost:3000
npm run build  # 本番ビルド
```

Vercelへのデプロイ:

```bash
vercel --prod
```

## 拡張ロードマップ

- Algorithm Visualizer: 牌のソートアニメーション
- Probabilistic Simulator: 放銃確率・ツモ期待値のリアルタイム表示
- AI対局アノテーション: 打牌ログのAI分析
- 資格試験クイズ連携: 情報I・AP過去問との統合
- アクセシビリティ・レイヤー: 視線・スイッチ操作対応
- ユーザー別学習履歴: 認証ユーザーの端末横断スコア管理

## ライセンス

牌画像: CC0 (Public Domain) - FluffyStuff/riichi-mahjong-tiles
