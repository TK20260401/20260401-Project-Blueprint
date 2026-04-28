# TestFlight v3 配信チェックリスト（v0.26.0）

> 作成: 2026-04-28（Win機）／実行: MBA環境
> 前回 TestFlight: v0.14.0 (build 5) 2026-04-17 ／ 直近 EAS build: 9（v0.22.0）

## 配信前チェック

### コード状態確認

- [ ] `git pull --rebase origin main` で Win機の今日の作業（22コミット）を取り込み済み
- [ ] `git log --oneline -10` で最終コミットが `b15ca29 docs(sync)` 以降になっている
- [ ] `git status` で working tree clean

### app.json 確認

- [x] `version: "0.26.0"` （0.14.0 から bump 済）
- [ ] EAS CLI でビルド番号自動 increment 確認（前回 9 → 10 になる予定）
- [ ] `slug: "otetsudai-quest-mobile"` 維持（EAS projectId と紐付け）
- [ ] `bundleIdentifier: "com.tk20260401.otetsudaiquest"` 維持

### 検証必須項目（実機）

#### v0.26.0 の主要変更点を実機確認

- [ ] **3pot ラベル**: 取引／金庫／錬成 が表示されている
- [ ] **戻るボタン**: 🏠+(TOPへ)補強、🚪+(まえへ)補強、ChildDashboardは🏠+(ログインへ)
- [ ] **SVG 整列**: 4ボタンの上下端が揃っている（IconBox 効果確認）
- [ ] **WalletDetail 総額**: ヘッダーに統合、独立カードなし
- [ ] **3pot 振替**: WalletTransferModal でつかう⇄ためる⇄ふやす 移動できる
- [ ] **家族メッセージ**: スタンプのみ／メッセージのみ／両方 すべて送信成功
- [ ] **ペット P4**: 孵化済ペットをタップ → bounce + ハート3個 → 200ms後 modal

#### 既存機能のリグレッション無し確認

- [ ] ログイン → 子ダッシュ遷移
- [ ] クエスト完了 → 親承認 → ウォレット加算（FK違反バグなし）
- [ ] 投資画面の購入動線（initial modal表示含む）
- [ ] スタンプリレー送信
- [ ] 月次レポート表示

### DB マイグレーション確認

- [ ] `20260419_family_messages_nullable.sql` を Supabase 本番に適用済み
  - stamp_id / message いずれかでも送信可（CHECK制約付き）
  - 未適用だと家族メッセージで PARTIAL FAIL の可能性

## ビルド手順（MBA で実行）

```bash
cd otetsudai-quest-mobile
git pull --rebase origin main
npm install                                # 念のため
eas build --platform ios --profile preview  # TestFlight 用 preview profile
# autoIncrement: true なので build 番号自動 +1（前回9 → 今回10）
```

ビルド時間目安: 15〜20分。完了後 EAS CLI が iOS submit ガイドを案内。

## 申請手順

```bash
eas submit --platform ios --profile production --latest
# → App Store Connect の TestFlight タブにアップロード
# → 内部テスター配信は通常 5〜30分後
```

## リリースノート（TestFlight ユーザー向け）

```
おこづかいクエスト v0.26.0
2026-04-28

【今回の改善】
1) 4ボタンのリブランド
   冒険・取引・金庫・錬成 で世界観統一

2) 戻るボタンの導線改善
   「TOPへ」「まえへ」「ログインへ」など、
   どこに戻るか一目で分かるようになりました

3) ウォレット画面のシンプル化
   重複していた総額カードを削除、ヘッダーに統合

4) ペットをタップすると喜びます
   ハートが飛ぶようになりました

5) 家族メッセージ送信の不具合修正
   スタンプのみ／メッセージのみでも送れるように

6) 細かい視認性・整列の修正多数
```

## 既知の制限

- **Web版（otetsudai-bank）の3pot リブランド**: child page / slider / modal は反映済み、parent page も今回スコープに入ってない箇所はあとで確認
- **ParentDashboardScreen の RPG強テーマ反映**: モバイルもまだ未対応の箇所あり
- **EAS build番号10 で配布**: TestFlight 上では「v0.26.0 (10)」と表示される予定

## 配信後アクション

- [ ] TestFlight 内部テスター（自分＋家族）の招待状況確認
- [ ] フィードバック受付窓口（GitHub Issues / Slack / DM）の周知
- [ ] note 記事更新（v0.26.0 を含む形に）
