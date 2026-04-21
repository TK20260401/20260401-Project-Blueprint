# tetris-games

ブラウザで動く3言語版テトリス。JavaScript・Python（Pyodide）・C言語（JS移植）を比較学習できる教材用プロジェクト。

## 概要

「テトリスを作りながらアルゴリズムを学ぶ」教材として、同じゲームを3つの言語／実行方式で実装。言語ごとの書き方の違い、実行方式の違いを体感できる。

- **用途**：高校「情報I」／プログラミング入門／アルゴリズム学習
- **動作**：すべてブラウザ内で完結（サーバー不要）

## ファイル構成

```
tetris-games/
├── top.html          トップページ（3版へのリンク）
├── index.html        JS版テトリス
├── style.css         JS版スタイル
├── tetris.js         JS版ロジック
├── python/
│   └── index.html    Python版（Pyodide使用）
├── c/
│   ├── index.html    C版（JS移植＋ソース表示）
│   └── tetris.c      C言語ソースコード
└── vercel.json       Vercel設定
```

## 各版の特徴

### JS版（`index.html`）
- フル機能：ホールド、NEXT 3つ表示、ゴーストブロック、7-bagランダマイザ、モバイル対応
- 即起動、軽量

### Python版（`python/index.html`）
- [Pyodide](https://pyodide.org/)（WebAssembly版Python）でブラウザ上でPythonコードを直接実行
- 初回ロード時に数秒かかる（Pythonランタイムのダウンロード）
- Pythonの文法・実行の様子をそのまま観察できる

### C版（`c/index.html`）
- 構造体・関数・ポインタ的な設計をJSに忠実に移植
- `tetris.c` のソースコードをページ上で閲覧可能
- C言語の設計思想をブラウザで体験

## ローカルで動かす

静的ファイルのみなので、任意の静的サーバーで動作：

```bash
cd tetris-games
python3 -m http.server 8000
# → http://localhost:8000/top.html
```

## デプロイ

Vercelで静的サイトとしてデプロイ可能。`vercel.json` 設定済み。

```bash
vercel deploy
```

## PythonをWebアプリにする方法（参考）

本プロジェクトでは **Pyodide** を採用。他の選択肢との比較：

| 方法 | 特徴 | 向き |
|---|---|---|
| **Pyodide**（採用） | ブラウザ内でPythonが直接動く。サーバー不要 | 教材・デモ |
| Flask / FastAPI + フロントエンド | サーバーサイドPython + API | 本格Webアプリ |
| Streamlit / Gradio | Python特化のWebフレームワーク | データ分析・ML系 |

## 操作方法（共通）

| キー | 動作 |
|---|---|
| ← → | 左右移動 |
| ↓ | ソフトドロップ |
| ↑ | 回転 |
| Space | ハードドロップ |
| Shift / C | ホールド（JS版のみ） |
| P | ポーズ |

## ライセンス

教育目的のサンプル実装。自由に改変・利用可。
