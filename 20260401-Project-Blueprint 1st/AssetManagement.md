# 備品管理台帳（Asset Management Ledger）

## 概要

学校・オフィスの備品管理をデジタル化するWebアプリケーション。
QRコード管理・棚卸し・更新推奨の自動化により、管理漏れをゼロにする。

## リンク

- 本番: <https://asset-management-ledger.vercel.app>
- GitHub: <https://github.com/TK20260401/asset-management-ledger>
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

2. **Supabase DB構築**
   - `assets` テーブル（備品マスター）
   - `inventory_checks` テーブル（棚卸し記録）
   - `assets_with_renewal` ビュー（更新推奨フラグ自動算出）
   - `activity_logs` テーブル（操作ログ蓄積用）
   - RLS有効化・ポリシー設定
   - ファイル: `docs/database-design.md`

3. **Supabase接続**
   - ブラウザ用・サーバー用クライアント作成
   - Next.js 16対応の `proxy.ts` でセッション管理
   - Vercel環境変数に `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` 設定
   - ファイル: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/proxy.ts`

4. **認証機能（ログイン・新規登録）**
   - メール/パスワードによるログイン・新規登録画面
   - 確認メールからの認証コールバック (`/auth/callback`)
   - 未認証ユーザー → `/login` リダイレクト
   - 認証済みユーザー → `/` リダイレクト
   - ログアウト機能
   - ファイル: `src/app/login/page.tsx`, `src/app/auth/callback/route.ts`, `src/app/logout-button.tsx`

5. **権限設定（RLS）**
   - 閲覧（SELECT）: 認証済みユーザー全員
   - 編集（INSERT/UPDATE/DELETE）: `t_kikuchi@snafty.io` のみ
   - 操作ログ: 書き込みは全認証ユーザー、削除は管理者のみ

6. **備品一覧サンプル画面**
   - ダッシュボードカード（全備品数・使用中・修理中・更新推奨）
   - PC: テーブル表示 / モバイル: カードリスト表示（レスポンシブ対応）
   - ステータスバッジ（使用中/修理中/廃棄済）・更新推奨バッジ
   - サンプルデータ8件（後日DBに切り替え予定）
   - ファイル: `src/app/page.tsx`

7. **レスポンシブ対応**
   - ヘッダー: モバイルで折り返し、メールアドレス非表示
   - ボタン: タッチ操作しやすいサイズ（モバイルで `py-3`）
   - 備品一覧: PC=テーブル / モバイル=カードリスト
   - `lang="ja"` 設定

8. **README整備**
   - ファイル構成・操作ガイド・デプロイ手順を追記

## 今後の予定

- [ ] サンプルデータ → Supabase実データに切り替え
- [ ] 備品の登録・編集・削除フォーム（CRUD）
- [ ] QRコード生成・スキャン参照
- [ ] 棚卸し機能
- [ ] 検索・フィルター機能
- [ ] shadcn/ui によるUIデザイン刷新
- [ ] 操作ログの画面表示
