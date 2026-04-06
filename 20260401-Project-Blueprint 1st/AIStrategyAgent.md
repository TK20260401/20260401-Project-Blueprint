# AI Strategy Agent — プロジェクト実装ログ

## 概要

コンサルタント不在でもAIと伴走し、業務棚卸し・コスト削減・人月削減を実現するAIエージェント。企業名を入力するだけで、業務プロセス分析・AI導入提案・ROI算出を自動生成する。収益計画シミュレーションとKGI/KPI管理を統合したWebアプリケーション。

## リンク

- 本番: <https://ai-strategy-agent.vercel.app>
- GitHub: <https://github.com/TK20260401/ai-strategy-agent>
- Supabase: <https://ycqgkgtgkhxfvgfhlmqe.supabase.co>

## 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Vercel (ホスティング・デプロイ)
- Recharts (グラフ・予定)
- Claude API (提案書自動生成・予定)

## 実装ログ

### 2026-04-06

1. **要件ヒアリング（第1回）**
   - ユーザーの要望を整理
   - 業務棚卸し・コスト削減・人月削減がテーマ
   - AIエージェント時代のコンサルなし伴走ツール
   - 5フェーズの伴走プロセス（事前調査→ヒアリング→PoC→現場導入→定着支援）
   - 参考: Planning MAN (planningman.vercel.app) のダッシュボードUI

2. **リポジトリ作成・プロジェクト初期化**
   - `create-next-app` でNext.js 16 + TypeScript + Tailwind CSS構築
   - `@supabase/supabase-js`, `@supabase/ssr` 導入
   - ファイル: `package.json`, `tsconfig.json`, `next.config.ts`

3. **Supabase DB構築**
   - `proposals` テーブル（提案書: 企業名・業界・課題・フェーズ・ステータス）
   - RLS有効化（ユーザーは自分のデータのみ操作可能）
   - ファイル: Supabase マイグレーション

4. **認証・Supabase接続**
   - ブラウザ用・サーバー用Supabaseクライアント
   - Next.js 16対応の `proxy.ts` で未認証→/loginリダイレクト
   - 認証コールバック (`/auth/callback`)
   - ログイン・新規登録・ログアウト
   - ファイル: `src/lib/supabase/`, `src/proxy.ts`, `src/app/login/`, `src/app/auth/callback/`

5. **サイドバーUI（Planning MAN風）**
   - 紫（violet）テーマカラー
   - ナビ: ダッシュボード / 新規作成 / 履歴 / 分析 / ログアウト
   - レスポンシブ対応（モバイルはハンバーガーメニュー）
   - ファイル: `src/components/sidebar.tsx`, `src/components/app-shell.tsx`

6. **ダッシュボード**
   - 統計カード4枚（総提案書数・今月の作成数・対象業界数・平均生成時間）
   - 最近の提案書一覧
   - 「新しい提案書を作成」ボタン
   - ファイル: `src/app/dashboard/page.tsx`

7. **新規提案書作成**
   - 5フェーズ伴走プロセスの横スクロール表示
   - 企業情報入力（企業名・業界・従業員数・売上・課題・対象プロセス）
   - Supabaseに保存
   - ファイル: `src/app/proposals/new/page.tsx`

8. **提案書履歴ページ**
   - テーブル形式で一覧表示（企業名・業界・フェーズ・ステータス・作成日）
   - ステータスバッジ（下書き/進行中/完了）
   - ファイル: `src/app/history/page.tsx`

9. **分析ページ**
   - 業界別・フェーズ別・ステータス別の集計
   - バーチャートで可視化
   - ファイル: `src/app/analysis/page.tsx`

10. **環境変数設定（printfで改行なし）**
    - `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` をVercelに設定
    - `echo`ではなく`printf`で改行混入を防止（他プロジェクトでの教訓）

11. **Vercelデプロイ・GitHub push**
    - 本番: <https://ai-strategy-agent.vercel.app>
    - GitHub: <https://github.com/TK20260401/ai-strategy-agent>

12. **要件ヒアリング（第2回）— 収益計画シミュレーション統合**
    - 「営業が現場で使うツール」が軸
    - シミュレーション入力: 現状コスト7項目 + AI導入2項目 + 削減見込み3項目
    - 即時出力: 月間/年間コスト削減額、ROI%、投資回収期間
    - グラフ: 折れ線（回収ポイント）+ 棒グラフ（月次ビフォーアフター）を1画面に
    - KGI/KPI: Phase 1は目標設定、Phase 2で実績トラッキング
    - ユーザー: 管理者/営業/クライアント閲覧者の3ロール、CSV一括登録
    - 保存 → PDF → URL共有の優先度順

13. **要件定義書作成（v1.0）**
    - システム概要・ユーザー定義・機能要件（Phase 1/2/3）
    - 5フェーズ伴走プロセス・非機能要件・技術スタック
    - DB設計・画面一覧・開発ロードマップ・優先度まとめ
    - ファイル: `20260401-Project-Blueprint 1st/AIStrategyAgent-Requirements.md`

14. **ワイヤーフレーム作成**
    - シミュレーション画面のHTML版ワイヤーフレーム
    - 2カラムレイアウト（左:入力 / 右:結果+グラフ）
    - KPI結果カード4枚 + 折れ線グラフ + 棒グラフ + コスト内訳
    - ファイル: `20260401-Project-Blueprint 1st/wireframe-simulation.html`

15. **タスクリスト作成**
    - Phase 1 MVP: 約40タスク（シミュレーション・KGI/KPI・認証・ダッシュボード）
    - Phase 2: 実績トラッキング（4タスク）
    - Phase 3: 拡張（PDF・共有URL・AI連携、3タスク）
    - 計算ロジックの式とテストケース3本を含む
    - 推奨実装順序: シミュレーション画面 → 保存 → KGI/KPI → ダッシュボード → ユーザー管理
    - ファイル: `20260401-Project-Blueprint 1st/AIStrategyAgent-TaskList.md`

## 成果物一覧

| ファイル | 内容 |
| --- | --- |
| `AIStrategyAgent-Requirements.md` | 要件定義書 v1.0 |
| `wireframe-simulation.html` | ワイヤーフレーム（ブラウザで確認可能） |
| `AIStrategyAgent-TaskList.md` | タスクリスト（Phase 1/2/3） |
| `AIStrategyAgent.md` | 本ファイル（実装ログ） |

## ファイル構成

```
ai-strategy-agent/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 全体レイアウト
│   │   ├── page.tsx              # / → /dashboard リダイレクト
│   │   ├── login/page.tsx        # ログイン・新規登録
│   │   ├── auth/callback/route.ts # 認証コールバック
│   │   ├── dashboard/page.tsx    # ダッシュボード
│   │   ├── proposals/new/page.tsx # 提案書作成
│   │   ├── history/page.tsx      # 提案書履歴
│   │   └── analysis/page.tsx     # 分析
│   ├── components/
│   │   ├── sidebar.tsx           # サイドバーナビ
│   │   └── app-shell.tsx         # レイアウトシェル
│   ├── lib/supabase/
│   │   ├── client.ts             # ブラウザ用クライアント
│   │   └── server.ts             # サーバー用クライアント
│   └── proxy.ts                  # 認証チェック・リダイレクト
├── package.json
└── tsconfig.json
```

## DBテーブル（Supabase）

| テーブル | 用途 | ステータス |
| --- | --- | --- |
| `proposals` | 提案書（企業名・業界・課題・フェーズ・ステータス） | 作成済み |
| `simulations` | シミュレーション（コスト入力値・計算結果） | 未作成 |
| `kgi_goals` | KGI目標 | 未作成 |
| `kpi_metrics` | KPI指標（KGIに紐付け） | 未作成 |
| `users_extended` | ユーザー拡張（ロール情報） | 未作成 |

## 今後の予定

### Phase 1 MVP（次のステップ）
- [ ] シミュレーション画面（入力→即時計算→グラフ）
- [ ] シミュレーション保存・一覧・編集
- [ ] KGI/KPI目標設定・管理
- [ ] ダッシュボード強化（シミュレーション+KPI連携）
- [ ] ユーザー管理（CSV招待・ロール）

### Phase 2 実績トラッキング
- [ ] KPI実績値入力（月次）
- [ ] 目標 vs 実績グラフ

### Phase 3 拡張
- [ ] PDF出力
- [ ] 共有URL（閲覧専用）
- [ ] Claude API連携（提案書自動生成）
