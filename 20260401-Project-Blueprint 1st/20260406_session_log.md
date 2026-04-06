# セッションログ — 2026-04-06

## 本日の作業サマリー

### 1. 備品管理台帳（Asset Management Ledger）— 新規構築

| 項目 | 内容 |
| --- | --- |
| 本番URL | <https://asset-management-ledger.vercel.app> |
| GitHub | <https://github.com/TK20260401/asset-management-ledger> |

**実装内容:**
- Next.js 16 + TypeScript + Tailwind CSS プロジェクト初期化
- Supabase DB構築（assets / inventory_checks / activity_logs / assets_with_renewal ビュー）
- 認証（メール/パスワード）・proxy.ts・認証コールバック
- RLS権限設定（`t_kikuchi@snafty.io` のみ編集可、他は閲覧のみ）
- 備品一覧サンプル画面（ダッシュボード + テーブル/カード表示）
- レスポンシブ対応（PC: テーブル / モバイル: カード）
- Vercelデプロイ・GitHub push
- 統合リポジトリ（20260401-Project-Blueprint）にディレクトリ追加
- README更新（操作ガイド・ファイル構成・デプロイ手順）

---

### 2. Report Hub（日報・週報・月報）— 新規構築

| 項目 | 内容 |
| --- | --- |
| 本番URL | <https://report-hub-one.vercel.app> |
| GitHub | <https://github.com/TK20260401/report-hub> |

**実装内容:**
- Next.js 16 + TypeScript + Tailwind CSS プロジェクト初期化
- Supabase DB構築（daily_reports / daily_tasks / daily_issues / efficiency_actions / knowledge_notes）
- RLS（各ユーザーは自分のデータのみ操作、共有ナレッジは全員閲覧可）
- 認証・proxy.ts・認証コールバック
- 日報登録フォーム（タスク・工数削減・課題・気づきを動的追加）
- 日報編集機能（既存データ読み込み→保存）
- フォーム共通コンポーネント化（report-form.tsx）
- トップページDB連携（サンプルデータ→Supabase取得）
- ダッシュボード集計（日報数・総工数・工数削減・ナレッジ件数）
- レスポンシブ対応
- Vercelデプロイ・GitHub push

**トラブルシュート:**
- 環境変数に`\n`（改行）が混入 → `printf`で再設定・両プロジェクト修正

---

### 3. AI Strategy Agent — 新規構築

| 項目 | 内容 |
| --- | --- |
| 本番URL | <https://ai-strategy-agent.vercel.app> |
| GitHub | <https://github.com/TK20260401/ai-strategy-agent> |

**実装内容:**
- Next.js 16 + TypeScript + Tailwind CSS プロジェクト初期化
- Supabase DB構築（proposals テーブル）
- 認証・proxy.ts
- サイドバーナビ（Planning MAN風、紫テーマ）
- ダッシュボード（統計カード + 最近の提案書）
- 新規提案書作成（5フェーズフロー表示 + 企業情報入力）
- 提案書履歴（テーブル表示）
- 分析ページ（業界別・フェーズ別・ステータス別）
- レスポンシブ対応（モバイルハンバーガーメニュー）
- Vercelデプロイ・GitHub push

**設計ドキュメント:**
- 要件定義書（AIStrategyAgent-Requirements.md）
- ワイヤーフレーム（wireframe-simulation.html）
- タスクリスト（AIStrategyAgent-TaskList.md）

**要件ヒアリング（2回実施）:**
- 第1回: シミュレーション方式・KGI/KPI・ユーザー種別・出力・統合方針
- 第2回: 投資額入力方式・実績トラッキングフェーズ分け・保存/共有・ユーザー管理・グラフ表示

---

### 4. ROI Simulator — 新規構築

| 項目 | 内容 |
| --- | --- |
| 本番URL | <https://roi-simulator-delta.vercel.app> |
| GitHub | <https://github.com/TK20260401/roi-simulator> |

**実装内容:**
- 要件定義書作成（ヒアリング2回）→ ワイヤーフレーム → タスクリスト
- Next.js 16 + TypeScript + Tailwind CSS + Recharts + Supabase
- シミュレーション画面: 12入力項目→即時ROI計算（useMemo）→折れ線+棒グラフ
- シミュレーション保存・一覧・詳細表示
- KGI/KPI管理（階層CRUD）
- ダッシュボード（統計+最近のシミュレーション）
- ベーシック認証（ID: admin / PW: 20260406）
- セキュリティ強化: RLS完全遮断 + SECURITY DEFINER + 全DB操作API経由
- RLS検証: anonでSELECT→0件確認済み
- Step 1: ヘルプページ + 全入力項目にツールチップ
- Step 2: AIチャットアシスタント（Claude API連携、フローティングUI）
- Step 3: 印刷/PDF出力（A4横、コスト内訳テーブル+前提条件+Confidential）
- Step 4: 業界別プリセット7テンプレート（コールセンター/製造/小売/金融/自治体）
- Step 5: シミュレーション比較機能（最大4プラン横並び、テーブル+グラフ）
- Claude APIキー設定完了、AIチャット稼働中

---

### 5. 統合リポジトリ（20260401-Project-Blueprint）更新

- README.md に Asset-Management / Report-Hub / AI Strategy Agent を追加
- プロジェクト一覧・機能・技術スタック・DB・リポジトリ構成・開発履歴・インフラ・Getting Started
- Blueprint フォルダーにプロジェクト実装ログ追加:
  - AssetManagement.md
  - ReportHub.md
  - AIStrategyAgent.md
  - AIStrategyAgent-Requirements.md
  - AIStrategyAgent-TaskList.md
  - wireframe-simulation.html
  - 20260406_session_log.md（本ファイル）

---

## 本日作成したリポジトリ

| リポジトリ | URL | ステータス |
| --- | --- | --- |
| asset-management-ledger | <https://github.com/TK20260401/asset-management-ledger> | v1 デプロイ済み |
| report-hub | <https://github.com/TK20260401/report-hub> | v1 デプロイ済み |
| ai-strategy-agent | <https://github.com/TK20260401/ai-strategy-agent> | v1 デプロイ済み |
| roi-simulator | <https://github.com/TK20260401/roi-simulator> | v1 デプロイ済み（Step 1-5完了） |

## 本日の本番URL一覧

| アプリ | URL |
| --- | --- |
| 備品管理台帳 | <https://asset-management-ledger.vercel.app> |
| Report Hub | <https://report-hub-one.vercel.app> |
| AI Strategy Agent | <https://ai-strategy-agent.vercel.app> |
| ROI Simulator | <https://roi-simulator-delta.vercel.app> |
| IPAS-Master | <https://ipas-master.vercel.app> |
| Logic-Riichi | <https://logic-riichi.vercel.app> |
| Zensho-Algo | <https://zensho-algo.vercel.app> |

## 教訓・注意点

1. **Vercel環境変数は`printf`で設定する**（`echo`だと末尾に`\n`が混入し、Supabase接続が失敗する）
2. **Next.js 16では`middleware.ts`が`proxy.ts`にリネームされている**（関数名も`proxy`に変更）
3. **統合リポジトリに追加する際、独立した.gitを持つディレクトリは.gitを削除してからgit add**
4. **Supabase RLSの`auth.jwt() ->> 'email'`でメールベースの権限制御が可能**
5. **SECURITY DEFINER関数を使えば、anon keyでもサーバーAPIルート経由で安全にDB操作可能**
6. **APIキーはチャット履歴に残さない** — 環境変数設定後はキーを無効化→再発行が推奨
