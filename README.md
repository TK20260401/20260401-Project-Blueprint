# IT-Skills Learning OS (ISLOS)

## はじめに

**「情報I・ITパスポート・基本情報・全商検定」を最短で攻略する、実践型学習基盤**

16年間の教育現場の知見をソフトウェア化。単なる暗記ではなく、シミュレーション・トレース・ゲーミフィケーションを通じて「ITリテラシー」と「計算機科学」の核心を体得するプラットフォーム。

## プロジェクト一覧

| Project | Description | URL | Status |
| --- | --- | --- | --- |
| [IPAS-Master](./ipas-master/) | ITパスポート試験対策アプリ（500問ドリル・シミュレーター・用語フラッシュ・認証・学習履歴） | https://ipas-master.vercel.app | v9 |
| [Logic-Riichi](./logic-riichi/) | 麻雀アルゴリズム学習アプリ（待ち牌クイズ・コード実装問題・認証・統計） | https://logic-riichi.vercel.app | v30 |
| [Zensho-Algo](https://github.com/TK20260401/zensho-algo) | 全商情報処理検定 プログラミング部門 アルゴリズム・トレーナー | https://zensho-algo.vercel.app | MVP |
| [Asset-Management](./asset-management-ledger/) | 備品管理台帳（備品CRUD・QRコード・棚卸し・更新推奨アラート） | https://asset-management-ledger.vercel.app | v1 |
| [Report-Hub](./report-hub/) | 日報・週報・月報 統合レポート（工数削減トラッカー・ナレッジベース） | https://report-hub-one.vercel.app | v1 |
| [ROI-Simulator](./roi-simulator/) | 収益計画シミュレーション・KGI/KPI管理（即時ROI計算・グラフ） | https://roi-simulator-delta.vercel.app | v1 |
| [Otetsudai-Bank](./otetsudai-bank/) | お手伝い×マネー教育アプリ（家族認証・タスク管理・ウォレット・貯蓄目標） | — | v0.1 |
| [todo-app](./todo-app/) | シンプルTODO Webアプリ（HTML/CSS/JS） | — | v1 |
| [Blueprint](./20260401-Project-Blueprint%201st/) | プロジェクト設計書・構想ドキュメント | — | — |

## 目的

### ベンダー視点（開発者として）

16年間の教育現場で蓄積した「生徒がどこでつまずくか」「どの順番で教えれば定着するか」という暗黙知は、教室の中だけに閉じている。この知見をソフトウェアとして形にし、**教育×テクノロジーの実装力を証明する**。

- **技術スタックの実証**: Next.js / React / TypeScript / Supabase / Vercel / AI（Claude Code）を用いたフルスタック開発を、設計から本番運用まで一人で完遂する
- **教育ドメインの言語化**: 「なぜこの機能が必要か」を検定シラバスと教育メソッドから逆算し、要件定義→実装→検証のサイクルを回す
- **ポートフォリオ**: 企画・設計・実装・デプロイ・運用の全工程を、コミット履歴とドキュメントで再現可能な状態で公開する

### ユーザー視点（学習者として）

市販の問題集は「解く→答え合わせ」の繰り返し。間違えた理由も、自分の弱点の全体像も見えない。本プラットフォームは**「なぜ間違えたか」を可視化し、自分で弱点を潰せる環境**を提供する。

- **即時フィードバック**: 回答した瞬間に正誤・解説が表示され、理解が曖昧なまま先に進まない
- **弱点の構造化**: レーダーチャートで分野別の理解度を一目で把握。どこを重点的にやるべきか自分で判断できる
- **段階的な足場外し**: 選択式→穴埋め→自由記述と難易度を上げ、最終的に自力で解ける状態へ導く


## 到達目標

| 指標 | 目標 |
| --- | --- |
| 対応検定・試験 | ITパスポート、全商情報処理検定（1級・2級）、基本情報技術者、情報I（共通テスト） |
| アプリ数 | 各試験に特化した学習アプリを個別に構築・デプロイ |
| 学習者の自走 | ログインすれば学習履歴が蓄積され、レーダーチャートで弱点を自己診断→重点学習→再診断のサイクルを一人で回せる |
| 技術の実証 | 設計書→実装→テスト→本番デプロイ→運用改善の全工程をGit履歴で追跡可能な状態にする |

## ロードマップ

```
Phase 1: 環境構築（2026-04-01）
  Node.js / Git / Vercel CLI / Claude Code の導入
  統合リポジトリ・設計書の整備
    │
Phase 2: MVP開発（2026-04-02〜）
  IPAS-Master v1-v8  ← ITパスポート対策の核心機能を実装・本番稼働中
  Logic-Riichi v1-v30 ← 麻雀×アルゴリズムで論理思考を訓練・本番稼働中
    │
Phase 3: 横展開（現在）
  Zensho-Algo         ← 全商検定のアルゴリズム特化トレーナーを構築中
    │
Phase 4: 深化（予定）
  認証・学習履歴の横断統合（SSO / 共通ダッシュボード）
  AIデバッグアシスト（つまずきポイントの自動検出・ヒント生成）
  基本情報技術者（FE）・情報I対応アプリの追加
```

## IPAS-Master — ITパスポート試験対策

| 機能 | 内容 |
| --- | --- |
| 問題ドリル | 500問、30/50/100問単位モード、14分野別フィルタ、シャッフル、スキップ問題一覧・復帰 |
| カウントアップタイマー | 学習時間の可視化 |
| GitHub認証 | NextAuth.js v5、ログイン時に学習履歴をDB保存 |
| 学習履歴ダッシュボード | レーダーチャート（3系統/14分野切替）、ログインユーザーは全体平均と比較可能 |
| 訪問者カウンター | 本日/累計のゲスト数をヘッダーに表示 |
| 用語フラッシュ | 45用語、3分野+サブカテゴリ、たとえ話（メタファー）付き解説 |
| 損益分岐点シミュレーター | スライダーで固定費・変動費率・売上高を操作、リアルタイムグラフ描画 |
| 2進数変換ツール | 8ビットトグル、2進/10進/16進/ASCII/グレースケール同時表示 |
| UD対応 | BIZ UDPGothicフォント、スキップリンク、フォーカスインジケータ、safe-area対応 |
| QRコード | フッターにSVGベースQRコードを配置 |

### 技術スタック

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js (App Router) | 16.2.2 | フレームワーク |
| React | 19.2.4 | UI構築 |
| Tailwind CSS | 4.x | スタイリング |
| Recharts | 3.8.1 | グラフ・レーダーチャート |
| NextAuth.js | 5.x (beta) | GitHub OAuth認証 |
| Supabase | 2.x | 学習履歴・訪問者DB |
| qrcode.react | 4.x | QRコード生成 |
| TypeScript | 5.x | 型安全 |
| Vercel | — | ホスティング |

## Logic-Riichi — 麻雀アルゴリズム学習

| 機能 | 内容 |
| --- | --- |
| 待ち牌クイズ | 13枚の手牌から待ち牌を当てる（Easy/Standard/Hard、制限時間・ヒント付き） |
| アルゴリズム実装問題 | 待ち牌計算コードの読解（選択式→虫食い→自由記述の段階的難易度） |
| 認証システム | Supabase Auth（メール/パスワード）、ゲストモード対応 |
| 訪問者カウンター | 本日/通算のゲスト数をヘッダーに表示 |
| マイページ | 学習履歴（日別棒グラフ）、理解度レーダーチャート（6軸）、ユーザー間ランキング（上位N%） |
| スコア管理 | Supabase（PostgreSQL + RLS）に全回答結果を永続化、user_id紐付け |
| UD/アクセシビリティ | 全漢字ルビ、牌画像alt属性（WCAG AA+）、レスポンシブ、キーボード操作対応 |

### 技術スタック

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js (App Router) | 16.2.2 | フレームワーク |
| React | 19.2.4 | UI構築 |
| Tailwind CSS | 4.x | スタイリング |
| Supabase | 2.x | 認証・DB（PostgreSQL + RLS） |
| Recharts | 3.x | レーダーチャート・棒グラフ |
| qrcode.react | 4.x | QRコード生成 |
| TypeScript | 5.x | 型安全 |
| Vercel | — | ホスティング |

## Zensho-Algo — 全商検定アルゴリズム・トレーナー（構築中）

| 機能 | 内容 |
| --- | --- |
| 全商疑似言語エディタ | 検定特有の表記（←, ＝等）でコードを記述・即実行 |
| リアルタイムトレース表 | ループごとに全変数の値を表形式で自動更新 |
| スモールステップ課題 | 合計・最大最小・ソート・探索・コントロールブレイクなど頻出パターン網羅 |
| コード⇔フローチャート変換 | 書いたコードを流れ図に自動変換、論理構造を視覚化 |

### 技術スタック

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js (App Router) | 16.x | フレームワーク |
| React | 19.x | UI構築 |
| Tailwind CSS | 4.x | スタイリング |
| TypeScript | 5.x | 型安全 |
| Vercel | — | ホスティング |

## Asset-Management-Ledger — 備品管理台帳

| 機能 | 内容 |
| --- | --- |
| 備品一覧 | ダッシュボード（全備品数・使用中・修理中・更新推奨の集計カード）＋テーブル/カード表示 |
| 認証 | Supabase Auth（メール/パスワード）、未認証→ログインリダイレクト |
| 権限管理 | RLSで管理者（`t_kikuchi@snafty.io`）のみ編集可、他ユーザーは閲覧のみ |
| 更新推奨アラート | 購入日＋耐用年数から自動算出、バッジ表示 |
| 操作ログ | `activity_logs` テーブルで全操作を記録・蓄積 |
| レスポンシブ | PC: テーブル表示 / モバイル・タブレット: カードリスト表示 |

### 技術スタック

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js (App Router) | 16.2.2 | フレームワーク |
| React | 19.x | UI構築 |
| Tailwind CSS | 4.x | スタイリング |
| Supabase | 2.x | 認証・DB（PostgreSQL + RLS + Auth） |
| TypeScript | 5.x | 型安全 |
| Vercel | — | ホスティング |

### DBテーブル

| テーブル | 用途 |
| --- | --- |
| `assets` | 備品マスター（備品ID、品名、カテゴリ、ステータス等） |
| `inventory_checks` | 棚卸し記録 |
| `activity_logs` | 操作ログ（誰がいつ何をしたか） |
| `assets_with_renewal` | 更新推奨フラグ付きビュー（自動算出） |

## Report-Hub — 日報・週報・月報 統合レポート

| 機能 | 内容 |
| --- | --- |
| 日報登録 | タスク・工数・成果・課題/対策・工数削減アクション・定性的気づき・明日の予定を入力（動的追加可） |
| 日報編集 | 既存日報の読み込み→編集→保存 |
| ダッシュボード | 日報数・総工数・工数削減累計・ナレッジ件数の集計カード |
| 工数削減トラッカー | 「何をしたら何時間削減できたか」を記録・累計 |
| 暗黙知ナレッジベース | 定性的な教育知見・気づきをタグ付きで蓄積 |
| 認証 | Supabase Auth（メール/パスワード）、RLSで自分のデータのみ操作可能 |
| レスポンシブ | モバイル・タブレット・PC対応 |

### 技術スタック

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js (App Router) | 16.2.2 | フレームワーク |
| React | 19.x | UI構築 |
| Tailwind CSS | 4.x | スタイリング |
| Supabase | 2.x | 認証・DB（PostgreSQL + RLS + Auth） |
| TypeScript | 5.x | 型安全 |
| Vercel | — | ホスティング |

### DBテーブル

| テーブル | 用途 |
| --- | --- |
| `daily_reports` | 日報本体（日付・プロジェクト・明日の予定） |
| `daily_tasks` | タスク明細（カテゴリ・工数・進捗・KPI寄与） |
| `daily_issues` | 課題と対策（原因分析・解決フラグ） |
| `efficiency_actions` | 工数削減アクション（削減時間記録） |
| `knowledge_notes` | 定性的気づき・暗黙知（タグ・共有フラグ） |

## Otetsudai-Bank — お手伝い×マネー教育

| 機能 | 内容 |
| --- | --- |
| ログイン | 家族選択→メンバー選択→PIN認証（PINなしも可）、ロール別ルーティング |
| 親ダッシュボード | 承認待ちタスク一覧（承認/却下）、子ども別残高・貯蓄率、週間統計 |
| タスク管理 | CRUD（タスク名・説明・報酬額・繰り返し設定・担当子ども指定）、有効/無効切替 |
| 子どもダッシュボード | 貯金箱UI（つかえるお金/ちょきん分離）、貯蓄目標プログレスバー |
| おてつだい実行 | アクティブタスク一覧→「できた！」で完了申請 |
| ウォレット | 報酬を分配比率で「つかえるお金」「ちょきん」に自動振り分け |
| 取引履歴 | 獲得・使用の履歴をタブ切替で確認 |

### 技術スタック

| Technology | Version | Purpose |
| --- | --- | --- |
| Next.js (App Router) | 16.2.2 | フレームワーク |
| React | 19.2.4 | UI構築 |
| Tailwind CSS | 4.x | スタイリング |
| shadcn/ui | 4.1.2 | UIコンポーネント |
| Supabase | 2.x | DB（PostgreSQL）・認証 |
| TypeScript | 5.x | 型安全 |
| Vercel | — | ホスティング |

### DBテーブル

| テーブル | 用途 |
| --- | --- |
| `otetsudai_families` | 家族マスター |
| `otetsudai_users` | ユーザー（parent/child、PIN認証） |
| `otetsudai_tasks` | お手伝いタスク定義 |
| `otetsudai_task_logs` | タスク完了ログ（pending→approved/rejected） |
| `otetsudai_wallets` | 子ども別ウォレット（spending/saving残高・分配比率） |
| `otetsudai_transactions` | 取引履歴（earn/spend/save） |

## 共通設計方針

### 教育メソッド

| メソッド | 適用 |
| --- | --- |
| ゲーミフィケーション | 正解率・連続正解・最高記録のリアルタイム表示、難易度段階による達成感設計 |
| SDL（自己主導型学習） | 答えではなくヒント・ガイドを提供し、学習者が自ら思考するプロセスを重視 |
| 再認法→再生法 | 選択肢→虫食い→自由記述の段階的な足場外しで自走力を育成 |
| シミュレーション | 数値を操作して結果を視覚的に確認、体験的理解を促進 |

### ユニバーサルデザイン

| Feature | Detail |
| --- | --- |
| フォント | BIZ UDPGothic優先（ユニバーサルデザイン書体） |
| ルビ | 全漢字にふりがな付き（rt inherit方式でコントラスト自動調整） |
| タッチ操作 | 最小タッチターゲット44px以上 |
| キーボード | スキップリンク、フォーカスインジケータ（青枠3px） |
| 色覚多様性 | 色+アイコン併用（✓/✗、▲/▼） |
| モーション配慮 | `prefers-reduced-motion` 対応 |
| レスポンシブ | モバイル/タブレット/PC 3段階ブレイクポイント |

## リポジトリ構成

```
20260401/
├── README.md                          ← このファイル
├── .gitignore
├── 20260401-Project-Blueprint 1st/    ← 設計書・構想ドキュメント
│   ├── IPASMaster.md
│   ├── Logic-Riichi.md
│   ├── FE_LogicRunner.md
│   └── ...
├── ipas-master/                       ← ITパスポート試験対策アプリ（v8）
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   └── package.json
├── logic-riichi/                      ← 麻雀アルゴリズム学習アプリ（v30）
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   └── package.json
├── zensho-algo/                       ← 全商検定アルゴリズム・トレーナー（構築中）
│   ├── src/app/
│   ├── src/components/
│   └── package.json
├── asset-management-ledger/           ← 備品管理台帳（v1）
│   ├── src/app/
│   ├── src/lib/
│   ├── docs/
│   └── package.json
├── report-hub/                        ← 日報・週報・月報 統合レポート（v1）
│   ├── src/app/
│   ├── src/lib/
│   ├── docs/
│   └── package.json
├── otetsudai-bank/                    ← お手伝い×マネー教育アプリ（v0.1）
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── docs/
│   └── package.json
└── todo-app/                          ← シンプルTODOアプリ
    ├── index.html
    ├── styles.css
    └── script.js
```

## 開発履歴

| Date | Project | Version | Milestone |
| --- | --- | --- | --- |
| 2026-04-01 | — | — | 開発環境構築（Node.js, Git, VS Code, Cursor, Claude Code, Vercel CLI, GitHub CLI） |
| 2026-04-01 | — | — | 設計書作成、統合リポジトリ・個別リポジトリの初期化 |
| 2026-04-02 | IPAS-Master | v1-v4 | 初期構築、損益分岐点シミュレーター、2進数変換ツール、用語フラッシュ（45語）、計算問題ドリル（30問） |
| 2026-04-02 | Logic-Riichi | v1-v28 | 初期構築、牌ビジュアル、クイズ機能、UD全面改修、アルゴリズム問題、Supabase連携、レスポンシブ |
| 2026-04-03 | IPAS-Master | v5-v9 | 500問拡充、UD/QRコード、GitHub OAuth認証、Supabase学習履歴、レーダーチャート（3系統/14分野）、訪問者カウンター、30/50/100問モード、タイマー、スキップ復帰、シャッフルデフォルトON |
| 2026-04-03 | Logic-Riichi | v29-v30 | Supabase Auth認証UI、訪問者カウンター、学習履歴、レーダーチャート、ユーザーランキング |
| 2026-04-03 | Zensho-Algo | MVP | 疑似言語エディタ+トレース表+ステップ実行、サンプル4本（合計・最大値・偶数合計・バブルソート）、Vercelデプロイ |
| 2026-04-06 | Asset-Management | v1 | 備品管理台帳 初期構築、Supabase DB（assets/inventory_checks/activity_logs）、認証（メール/パスワード）、RLS権限設定、ダッシュボード、サンプルデータ表示、レスポンシブ対応、Vercelデプロイ |
| 2026-04-06 | Report-Hub | v1 | 日報・週報・月報 統合レポート初期構築、Supabase DB（5テーブル）、認証、日報登録フォーム（動的追加）、日報編集機能、ダッシュボード集計、レスポンシブ対応、Vercelデプロイ |
| 2026-04-06 | ROI-Simulator | v1 | 収益計画シミュレーション（即時ROI計算+Rechartsグラフ）、KGI/KPI管理、ベーシック認証、RLS完全遮断+SECURITY DEFINER、全DB操作API経由、ヘルプ+ツールチップ、AIチャット、印刷/PDF出力、業界別プリセット7種、比較機能（最大4プラン）、レスポンシブ対応 |
| 2026-04-07 | Otetsudai-Bank | v0.1 | お手伝い×マネー教育アプリ初期構築、Supabase DB（families/users/tasks/task_logs/wallets/transactions 6テーブル）、家族→メンバー→PIN認証、親ダッシュボード（承認/却下・子ども残高・週間統計）、タスク管理CRUD（報酬額・繰り返し・担当設定）、子どもダッシュボード（貯金箱UI・貯蓄目標プログレス・おてつだい実行・取引履歴）、ウォレット自動分配（spending/saving）、shadcn/ui、レスポンシブ対応 |

## インフラ

| Service | Project | Purpose |
| --- | --- | --- |
| Vercel | ipas-master | IPAS-Masterのホスティング・CI/CD |
| Vercel | logic-riichi | Logic-Riichiのホスティング・CI/CD |
| Vercel | asset-management-ledger | 備品管理台帳のホスティング・CI/CD |
| Vercel | report-hub | Report Hubのホスティング・CI/CD |
| Vercel | roi-simulator | ROI Simulatorのホスティング・CI/CD |
| Supabase | TK20260401's Project | 認証・スコアDB・訪問者DB（PostgreSQL + RLS + Auth） |
| GitHub | TK20260401/20260401-Project-Blueprint | 統合リポジトリ |
| GitHub | TK20260401/ipas-master | IPAS-Master単体リポジトリ |
| GitHub | TK20260401/zensho-algo | Zensho-Algo単体リポジトリ |
| GitHub | TK20260401/asset-management-ledger | 備品管理台帳単体リポジトリ |
| GitHub | TK20260401/report-hub | Report Hub単体リポジトリ |
| GitHub | TK20260401/roi-simulator | ROI Simulator単体リポジトリ |
| Supabase | otetsudai_* テーブル群 | お手伝いバンク DB（families/users/tasks/wallets/transactions） |

## 環境構築（2026-04-01実施）

### 1. 基盤ツールのインストール

```bash
# Homebrew（macOS パッケージマネージャー）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js（JavaScript実行環境）
brew install node

# Git（バージョン管理）
brew install git
git config --global user.name "YourName"
git config --global user.email "your@email.com"
```

### 2. GitHub CLI・Vercel CLI

```bash
# GitHub CLI — リポジトリ作成・PR操作をターミナルから実行
brew install gh
gh auth login

# Vercel CLI — デプロイ・環境変数管理
npm install -g vercel
vercel login
```

### 3. エディタ・AI開発ツール

| Tool | Purpose | Install |
| --- | --- | --- |
| VS Code | コードエディタ | https://code.visualstudio.com |
| Cursor | AI統合エディタ | https://cursor.com |
| Claude Code | AIペアプログラミングCLI | `npm install -g @anthropic-ai/claude-code` |

### 4. プロジェクト作成テンプレート

```bash
# Next.js + TypeScript + Tailwind CSS でプロジェクトを作成
npx create-next-app@latest project-name --typescript --tailwind --eslint --app --src-dir

# Vercelにリンク
cd project-name && vercel link

# GitHubリポジトリ作成 & 初回プッシュ
gh repo create TK20260401/project-name --public
git remote add origin https://github.com/TK20260401/project-name.git
git push -u origin main
```

### 5. 外部サービス

| Service | Purpose | URL |
| --- | --- | --- |
| GitHub | ソースコード管理 | https://github.com |
| Vercel | ホスティング・CI/CD | https://vercel.com |
| Supabase | PostgreSQL DB・認証 | https://supabase.com |

## Getting Started

```bash
# IPAS-Master（.env.localにNextAuth・Supabase認証情報が必要）
cd ipas-master && npm install && npm run dev

# Logic-Riichi（.env.localにSupabase認証情報が必要）
cd logic-riichi && npm install && npm run dev

# Zensho-Algo
cd zensho-algo && npm install && npm run dev

# Asset-Management-Ledger（.env.localにSupabase認証情報が必要）
cd asset-management-ledger && npm install && npm run dev

# Report-Hub（.env.localにSupabase認証情報が必要）
cd report-hub && npm install && npm run dev

# ROI-Simulator（.env.localにSupabase認証情報+BASIC_AUTH設定が必要）
cd roi-simulator && npm install && npm run dev

# Otetsudai-Bank（.env.localにSupabase認証情報が必要）
cd otetsudai-bank && npm install && npm run dev
```

## ライセンス

- 牌画像: CC0 (Public Domain) - FluffyStuff/riichi-mahjong-tiles
