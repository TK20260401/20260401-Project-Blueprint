# 備品管理台帳（Asset Management Ledger）

## 目的

学校・オフィスの備品管理をデジタル化し、QRコード管理・棚卸し・更新推奨の自動化により、管理漏れをゼロにする。

## 主要な機能一覧

| # | 機能 | 概要 |
|---|------|------|
| 1 | 備品CRUD | 備品の登録・編集・削除・一覧表示 |
| 2 | カテゴリ/ステータス管理 | プルダウン選択（使用中/修理中/廃棄済） |
| 3 | QRコード生成 | 備品ごとにQRコードを自動生成、印刷可能 |
| 4 | QRスキャン参照 | スマホでQRを読み取り→備品詳細を表示 |
| 5 | 棚卸し機能 | チェックリスト形式で棚卸し記録を管理 |
| 6 | 更新推奨アラート | 購入日＋耐用年数から自動で「更新推奨」表示 |
| 7 | 検索・フィルター | カテゴリ、保管場所、ステータス等で絞り込み |
| 8 | ダッシュボード | カテゴリ別集計・ステータス別集計の可視化 |

## 技術スタック（ベータ版）

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js (App Router) on Vercel |
| UI | shadcn/ui + Tailwind CSS |
| バックエンド/DB | Supabase (PostgreSQL + Auth + Row Level Security) |
| QRコード生成 | `qrcode` ライブラリ (クライアント側生成) |
| デプロイ | Vercel (プレビュー＋本番) |
| 認証 | Supabase Auth |

## 環境情報

| 項目 | URL |
|------|-----|
| 本番サイト | https://asset-management-ledger.vercel.app |
| Supabase | https://ycqgkgtgkhxfvgfhlmqe.supabase.co |
| GitHub | https://github.com/TK20260401/asset-management-ledger |

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いて確認。

## ファイル構成と操作ガイド

### 主要ファイル一覧

```
src/
├── app/
│   ├── layout.tsx          # 全体レイアウト（タイトル・フォント・HTML構造）
│   ├── page.tsx            # トップページ（備品一覧・ダッシュボード表示）★
│   ├── globals.css         # グローバルCSS（配色・テーマ）
│   ├── logout-button.tsx   # ログアウトボタンコンポーネント
│   ├── login/
│   │   └── page.tsx        # ログイン・新規登録画面
│   └── auth/
│       └── callback/
│           └── route.ts    # メール確認後の認証コールバック
├── lib/
│   └── supabase/
│       ├── client.ts       # ブラウザ用Supabaseクライアント
│       └── server.ts       # サーバー用Supabaseクライアント
├── proxy.ts                # 認証チェック・リダイレクト制御
docs/
└── database-design.md      # DB設計書（テーブル定義・SQL）
```

### よくある操作と対象ファイル

| やりたいこと | 操作するファイル | 備考 |
|-------------|----------------|------|
| サンプルデータの変更・追加 | `src/app/page.tsx` | `sampleAssets` 配列を編集 |
| DBの実データに切り替え | `src/app/page.tsx` | サンプルデータ → Supabase取得に変更 |
| テーブルの列を追加・変更 | `src/app/page.tsx` + `docs/database-design.md` | 画面とDB両方を更新 |
| ログイン画面の変更 | `src/app/login/page.tsx` | メール/パスワード認証UI |
| サイトタイトル変更 | `src/app/layout.tsx` | `metadata` オブジェクト |
| 配色・テーマ変更 | `src/app/globals.css` | CSS変数 `--background`, `--foreground` |
| 認証リダイレクト先の変更 | `src/proxy.ts` | 未認証ユーザーの遷移先 |
| DB環境変数の変更 | `.env.local` | `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` |
| DBテーブル構造の変更 | Supabase管理画面 or マイグレーション | [docs/database-design.md](docs/database-design.md) 参照 |

### 権限設定

| 権限 | 対象 |
|------|------|
| 閲覧（SELECT） | 認証済みユーザー全員 |
| 編集（INSERT/UPDATE/DELETE） | `t_kikuchi@snafty.io` のみ |

権限の変更は Supabase管理画面 > Authentication > Policies で行う。

### デプロイ手順

```bash
# 1. 変更をコミット
git add -A
git commit -m "変更内容"

# 2. GitHubにpush
git push

# 3. Vercelに本番デプロイ
vercel --prod
```

## DB設計

詳細は [docs/database-design.md](docs/database-design.md) を参照。

### テーブル一覧

| テーブル | 用途 |
|---------|------|
| `assets` | 備品マスター（備品ID、品名、カテゴリ、ステータス等） |
| `inventory_checks` | 棚卸し記録 |
| `activity_logs` | 操作ログ（誰がいつ何をしたか） |
| `assets_with_renewal` | 更新推奨フラグ付きビュー（自動算出） |
