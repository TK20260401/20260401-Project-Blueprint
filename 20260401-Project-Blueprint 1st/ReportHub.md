# Report Hub — 日報・週報・月報 統合レポートシステム

## 概要

「日報を積み上げれば週報になり、週報をまとめれば月報になる」粒度設計で、ITエンジニア（PM/PL候補）と教員の視点を融合した構造化報告基盤。工数削減アクションと教育知見（暗黙知）を定量化・形式知化して蓄積し、AI振り返り自動生成にも対応する。

## リンク

- 本番: <https://report-hub-one.vercel.app>
- GitHub: <https://github.com/TK20260401/report-hub>
- Supabase: <https://ycqgkgtgkhxfvgfhlmqe.supabase.co>

## 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Vercel (ホスティング・デプロイ)

## 実装ログ

### 2026-04-06

1. **リポジトリ作成・プロジェクト初期化**
   - `create-next-app` でNext.js 16 + TypeScript + Tailwind CSS構築
   - `@supabase/supabase-js`, `@supabase/ssr` 導入
   - ファイル: `package.json`, `tsconfig.json`, `next.config.ts`

2. **Supabase DB構築（5テーブル）**
   - `daily_reports` — 日報本体（日付・プロジェクト・明日の予定）
   - `daily_tasks` — タスク明細（カテゴリ・工数・進捗・KPI寄与）
   - `daily_issues` — 課題と対策（原因分析・解決フラグ）
   - `efficiency_actions` — 工数削減アクション（削減時間記録）
   - `knowledge_notes` — 定性的気づき・暗黙知（タグ・共有フラグ）
   - RLS: 各ユーザーは自分のデータのみ操作可能、共有ナレッジは全員閲覧可
   - ファイル: `docs/database-design.md`

3. **Supabase接続・認証**
   - ブラウザ用・サーバー用Supabaseクライアント
   - Next.js 16対応の `proxy.ts` で未認証リダイレクト
   - 認証コールバック (`/auth/callback`)
   - ログイン・新規登録・ログアウト
   - ファイル: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/proxy.ts`, `src/app/login/page.tsx`, `src/app/auth/callback/route.ts`, `src/app/logout-button.tsx`

4. **ダッシュボード・サンプル画面**
   - 集計カード（日報数・総工数・工数削減・ナレッジ件数）
   - 日報カード（タスク一覧・カテゴリバッジ・工数削減・知見・明日の予定）
   - サンプルデータ3件（後日DBに切り替え予定）
   - レスポンシブ対応
   - ファイル: `src/app/page.tsx`

5. **Vercelデプロイ・環境変数設定**
   - 本番・開発環境に `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` 設定

6. **日報登録フォーム実装**
   - タスク・工数削減・課題・気づきを動的に複数追加可能
   - カテゴリ選択（プルダウン）、工数・進捗・KPI寄与の入力
   - Supabase DBへの登録処理
   - ファイル: `src/app/reports/new/page.tsx`, `src/app/reports/report-form.tsx`

7. **トップページDB連携**
   - サンプルデータ → Supabase DBからの取得に切り替え
   - ダッシュボード集計（日報数・総工数・工数削減・ナレッジ件数）もDB連動
   - ファイル: `src/app/page.tsx`

8. **日報編集機能**
   - 一覧の各日報カードに「編集」ボタン追加
   - `/reports/[id]/edit` で既存データを読み込み→保存
   - フォームを共通コンポーネント（report-form.tsx）に切り出し、新規/編集で共用
   - 編集時は子テーブルを削除→再登録で更新
   - 保存完了時に「保存しました」メッセージ表示
   - ファイル: `src/app/reports/[id]/edit/page.tsx`, `src/app/reports/report-form.tsx`

9. **環境変数修正**
   - `echo` コマンドで設定した際に末尾改行（`\n`）が混入していた問題を修正
   - `printf` で改行なしに再設定、両プロジェクト（Report Hub・備品管理台帳）を修正

## レポート構造設計

### 日報 → 週報 → 月報の粒度

| レベル | 集約方法 |
| --- | --- |
| 日報 | 実施タスク・工数・成果・課題/対策・工数削減アクション・定性的気づき・明日の予定 |
| 週報 | 日報x5の自動集約（カテゴリ別工数・KPI達成・未解決課題・削減累計・ナレッジ抽出） |
| 月報 | 週報x4の自動集約（月間実績・KGI/KPI振り返り・削減トレンド・ナレッジベース更新） |

## 今後の予定

- [x] サンプルデータ → Supabase実データに切り替え
- [x] 日報入力フォーム（タスク・課題・工数削減・気づきの動的追加）
- [x] 日報編集機能（既存データ読み込み→保存）
- [ ] 週報・月報の自動集約ビュー
- [ ] 工数推移グラフ（Recharts）
- [ ] AI振り返り生成機能
- [ ] ナレッジベース検索（タグフィルター）
- [ ] チーム共有・エクスポート機能
