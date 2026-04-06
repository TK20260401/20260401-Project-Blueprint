# ROI Simulator — プロジェクト実装ログ

## 概要

AIエージェントシステムのROI・投資回収期間・年間効果額を営業がその場で即時可視化するWebアプリケーション。収益計画シミュレーションとKGI/KPI管理を統合。

## リンク

- 本番: <https://roi-simulator-delta.vercel.app>
- GitHub: <https://github.com/TK20260401/roi-simulator>
- Supabase: <https://ycqgkgtgkhxfvgfhlmqe.supabase.co>

## 技術スタック

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Recharts (グラフ)
- Supabase (PostgreSQL + RLS)
- Vercel (ホスティング・デプロイ)

## 実装ログ

### 2026-04-06

1. **要件定義書作成（v1.0）**
   - ヒアリング2回実施（シミュレーション方式・KGI/KPI・ユーザー種別・出力・グラフ）
   - ファイル: `AIStrategyAgent-Requirements.md`

2. **ワイヤーフレーム作成**
   - シミュレーション画面のHTML版ワイヤーフレーム
   - 2カラムレイアウト（左:入力 / 右:結果+グラフ）
   - ファイル: `wireframe-simulation.html`

3. **タスクリスト作成**
   - Phase 1/2/3の約47タスク、計算ロジック・テストケース3本
   - ファイル: `AIStrategyAgent-TaskList.md`

4. **プロジェクト初期化・基盤構築**
   - Next.js 16 + TypeScript + Tailwind CSS + Supabase + Recharts
   - サイドバーナビ（violet テーマ、レスポンシブ対応）

5. **シミュレーション画面（コア機能）**
   - 入力フォーム: 現状コスト7項目 + AI導入2項目 + 削減見込み3項目
   - スライダー: AI自動化率・教育コスト削減率
   - 即時計算: useMemoで入力変更→200ms以内に結果反映
   - KPI結果カード4枚: 月間削減額・年間効果額・ROI・回収期間
   - 折れ線グラフ: 累積削減額 vs 累積投資額（回収ポイント表示）
   - 棒グラフ: 月次ビフォーアフター比較
   - コスト削減内訳サマリー
   - 計算ロジック: `src/lib/calc.ts`に独立関数として切り出し

6. **シミュレーション保存・管理**
   - 名前をつけて保存（Supabase）
   - 一覧ページ（/history）
   - 詳細表示（/simulations/[id]）— グラフ付き

7. **KGI/KPI管理**
   - KGI（最終目標）の作成・削除
   - KPI（中間指標）のKGIへの紐付け・作成・削除
   - 階層表示（KGI → 配下のKPI一覧）

8. **ダッシュボード**
   - 統計カード（シミュレーション数・今月の作成数・KGI目標数）
   - 最近のシミュレーション一覧

9. **ベーシック認証実装**
   - ID: admin / PW: 20260406
   - Cookie-based認証（httpOnly、7日間有効）
   - proxy.tsで全ページチェック
   - ログイン時に表示名をCookieに保存

10. **セキュリティ強化（第1回）**
    - RLS: anon = SELECTのみに制限
    - 全ミューテーションをサーバーAPIルート経由に変更
    - SECURITY DEFINER関数でRLSバイパス（サーバー側のみ）
    - created_by_name追加（メールアドレスは非公開）

11. **セキュリティ強化（第2回）— 全DB操作をAPI経由に**
    - anon SELECTポリシーを全削除（外部からの直接読み取り完全遮断）
    - 読み取り用SECURITY DEFINER関数を追加
    - 全ページをAPIルート経由に変更（ダッシュボード・履歴・詳細・KPI）
    - クライアント側Supabaseインポートを全除去
    - RLS確認: anonでSELECT→0件（データアクセス不可を確認）

12. **レスポンシブ対応**
    - シミュレーション入力: モバイルで縦並び、PCで横並び
    - コスト内訳: モバイルで1カラム、PCで3カラム
    - サイドバー: モバイルでハンバーガーメニュー

## セキュリティフロー

```
外部攻撃者がanon keyを取得しても：
  → SELECT: RLSで拒否 → データ取得不可
  → INSERT: RLSで拒否 → データ書き込み不可

正規ユーザー：
  ブラウザ → proxy.ts（cookie確認）→ ページ表示
           → /api/*（cookie確認）→ SECURITY DEFINER関数 → DB
```

## 今後の予定

- [ ] Supabase Auth連携（外部公開時）
- [ ] KPI実績値入力（Phase 2）
- [ ] 目標 vs 実績グラフ
- [ ] PDF出力
- [ ] 共有URL（閲覧専用）
- [ ] Claude API連携（提案書自動生成）
