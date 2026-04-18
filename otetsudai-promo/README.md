# おこづかいクエスト PR動画 (Remotion)

React ベースの動画生成フレームワーク [Remotion](https://www.remotion.dev/) で制作した PR 動画プロジェクト。

## 概要

- **縦動画**: 1080x1920 / 30fps / 30秒 (900フレーム) — SNS・ストア・ショート向け
- **横動画**: 1920x1080 / 30fps / 30秒 — YouTube・LP埋込向け
- **画像/音声アセット不使用**: 全シーンを React コンポーネント + SVG/CSS で描画

## セットアップ

```bash
cd otetsudai-promo
npm install
```

## プレビュー（Remotion Studio）

```bash
npm run start
```

→ ブラウザが自動で `http://localhost:3000` を開き、タイムライン操作可能な編集画面が立ち上がります。

## 動画書き出し

```bash
# 縦動画のみ
npm run build:vertical

# 横動画のみ
npm run build:horizontal

# 両方
npm run build:all
```

出力先: `out/promo-vertical.mp4` / `out/promo-horizontal.mp4`

## シーン構成

| # | シーン | フレーム | 秒数 | 内容 |
|---|--------|----------|------|------|
| 1 | Title    | 0-90     | 3s | ロゴ「おこづかいクエスト」+ コインパーティクル + 剣アイコン |
| 2 | Problem  | 90-240   | 5s | 「お手伝い、どう教える？」+ 親の悩み吹き出し |
| 3 | Quest    | 240-420  | 6s | スマホモックアップにクエスト一覧UIスライドイン |
| 4 | Split    | 420-570  | 5s | 報酬が 使う/貯める/増やす の3バケットに分岐 |
| 5 | LevelPet | 570-720  | 5s | レベルアップ演出 + 卵→ヒナ→成鳥の成長アニメ |
| 6 | CTA      | 720-900  | 6s | 「無料ではじめる」ボタン + QRコード + URL |

## ファイル構成

```
otetsudai-promo/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── README.md
└── src/
    ├── index.ts                    # registerRoot エントリー
    ├── Root.tsx                    # Composition 登録
    ├── compositions/
    │   ├── PromoVertical.tsx       # 縦動画 Sequence構成
    │   └── PromoHorizontal.tsx     # 横動画 Sequence構成
    ├── scenes/
    │   ├── TitleScene.tsx
    │   ├── ProblemScene.tsx
    │   ├── QuestScene.tsx
    │   ├── SplitScene.tsx
    │   ├── LevelPetScene.tsx
    │   └── CtaScene.tsx
    ├── components/
    │   ├── PhoneMockup.tsx         # iPhone風フレーム
    │   ├── CoinParticle.tsx        # 舞うコインエフェクト
    │   ├── PixelCoin.tsx           # ピクセルアートのコイン
    │   └── PixelSword.tsx          # ピクセルアートの剣
    ├── utils/
    │   ├── colors.ts               # ダンジョンテーマカラー
    │   └── animations.ts           # fadeIn/slideIn/bounce等ヘルパー
    └── config/
        └── copy.ts                 # キャッチコピー集約（差し替え用）
```

## テキスト差し替え

`src/config/copy.ts` の COPY オブジェクトを編集するだけで、全シーンのコピーが更新されます。

```ts
export const COPY = {
  brand: { title: "...", tagline: "...", url: "..." },
  scenes: {
    problem: { headline: "...", sub: "..." },
    // ...
  },
};
```

## カラー差し替え

`src/utils/colors.ts` の COLORS オブジェクトで全カラー管理。otetsudai-bank の Habiticaダンジョンテーマ（#1f0f31 ダークパープル + #ffa623 ゴールド）と統一済。

## BGM追加（任意）

将来的に BGM を追加する場合は:

1. `public/bgm.mp3` を配置
2. `PromoVertical.tsx` に以下を追加:
```tsx
import { Audio, staticFile } from "remotion";
<Audio src={staticFile("bgm.mp3")} />
```

## 技術スタック

- [Remotion 4.x](https://www.remotion.dev/)
- React 19
- TypeScript 5.5
- SVG + CSS のみ（画像アセット不使用）

## メモ

- アニメーションは全て `useCurrentFrame()` ベース。`interpolate` / `spring` ヘルパーで制御
- コインパーティクルは決定論的ランダム（`random(seed)`）なのでレンダリングごとに再現性あり
- WCAG AA コントラスト比を意識したカラー選択
- otetsudai-bank / otetsudai-quest-mobile 本体には依存しない独立プロジェクト
