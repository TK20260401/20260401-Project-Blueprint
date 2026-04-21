# joho1-app — 情報I学習アプリ

共通テスト「情報I」対策のスマホ完結型学習アプリ。

## テックスタック

- **フロント**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **BaaS**: Supabase（joho1 スキーマで分離）
- **ホスティング**: Vercel
- **AI**: Claude API（MVP後に実装予定）

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.local.example .env.local
# .env.local を編集して NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY を設定

# 開発サーバー起動
npm run dev
```

http://localhost:3000 で確認できます。

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Publishable Key |

## Supabase

- プロジェクト: TK20260401's Project（ap-northeast-1）
- スキーマ: `joho1`（他アプリと分離）
- RLS: 各テーブル作成時に必ず有効化
