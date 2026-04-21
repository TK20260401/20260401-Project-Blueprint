# 時計アプリで学ぶ CSS問題集

NHK風時計アプリの実装を題材に、CSSのレイアウト・装飾・アニメーション技法を学ぶ問題集である。
観点別（知識・理解 / 思考・判断・表現 / 主体的に学習に取り組む態度）に構成している。

---

## 知識・理解

---

### C-K1（難易度1）

Flexboxで`justify-content`が制御するのはどの方向の配置か。（デフォルトの`flex-direction: row`の場合）

| 選択肢 | 内容 |
| --- | --- |
| A | 主軸方向（水平） |
| B | 交差軸方向（垂直） |
| C | テキストの行方向 |
| D | z軸方向（重なり順） |

#### 正解: A

> `justify-content`は主軸方向、`align-items`は交差軸方向の配置を制御する。デフォルトのrow方向ではjustifyが水平、alignが垂直となる。

---

### C-K2（難易度1）

`border-radius: 50%`を正方形の要素に適用した場合の形状はどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 正円 |
| B | 楕円 |
| C | 角丸の正方形 |
| D | 変化なし |

#### 正解: A

> 正方形の場合は縦横の半径が等しいため正円になる。幅≠高さの場合は楕円になる。

---

### C-K3（難易度1）

`font-variant-numeric: tabular-nums`の効果として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | すべての数字を同じ幅で表示する |
| B | 数字をローマ数字に変換する |
| C | 数字を太字にする |
| D | 小数点の位置を揃える |

#### 正解: A

> tabular-numsは等幅数字を使用する指定で、"1"も"0"も同じ幅を占める。時刻表示のように数字が毎秒変わる場面でのガタつきを防ぐ。

---

### C-K4（難易度1）

`position: fixed`と`position: absolute`の違いとして正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | fixedはビューポート基準、absoluteは最も近い位置指定された祖先要素基準 |
| B | fixedは親要素基準、absoluteはビューポート基準 |
| C | どちらもビューポート基準で同じ動作 |
| D | fixedは相対位置、absoluteは絶対位置 |

#### 正解: A

> `position: fixed`はスクロールしても画面上の同じ位置に留まる。`position: absolute`は位置指定された最も近い祖先要素に対して配置される。

---

### C-K5（難易度2）

`box-shadow: 0 4px 20px rgba(0,0,0,0.4)`の4つの値が意味するものの組合せとして正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 水平オフセット0、垂直オフセット4px、ぼかし半径20px、色 |
| B | 上0、右4px、下20px、色 |
| C | 水平オフセット0、垂直オフセット4px、広がり20px、色 |
| D | 幅0、高さ4px、不透明度20%、色 |

#### 正解: A

> box-shadowの値は順に「水平オフセット、垂直オフセット、ぼかし半径、（広がり半径、）色」である。ぼかし半径20pxにより影の端が柔らかくなる。

---

### C-K6（難易度2）

`transition: width 0.3s ease`の3つの値が意味するものの組合せとして正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 対象プロパティ、遷移時間、イージング関数 |
| B | 遅延時間、対象プロパティ、遷移時間 |
| C | 対象プロパティ、遷移回数、遷移方向 |
| D | 遷移時間、遅延時間、イージング関数 |

#### 正解: A

> transitionの短縮記法は「プロパティ名 時間 イージング（遅延）」の順である。`ease`は開始と終了が緩やかな加減速カーブを指定する。

---

## 思考・判断・表現

---

### C-T1（難易度2）

`border-radius: 50%`を`width: 420px; height: 340px`の要素に適用した場合の形状はどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 横長の楕円 |
| B | 正円 |
| C | 角丸の長方形 |
| D | 縦長の楕円 |

#### 正解: A

> 50%は幅と高さそれぞれに対する割合。幅420の50%=210px、高さ340の50%=170pxとなり、横方向の半径が大きい横長の楕円になる。

---

### C-T2（難易度2）

以下のCSSで作られる縦縞の1パターンの幅は何pxか。

```css
background: repeating-linear-gradient(
  90deg,
  rgba(255,255,255,0.07) 0px,
  rgba(255,255,255,0.07) 3px,
  transparent 3px,
  transparent 8px
);
```

| 選択肢 | 内容 |
| --- | --- |
| A | 8px |
| B | 3px |
| C | 5px |
| D | 11px |

#### 正解: A

> 白い部分0〜3px（3px幅）+透明部分3〜8px（5px幅）=合計8pxが1パターン。90degは左→右方向なので縦縞になる。

---

### C-T3（難易度2）

`linear-gradient(160deg, ...)`の160degが示す方向として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 上方向(0deg)から時計回りに160度 |
| B | 右方向(0deg)から反時計回りに160度 |
| C | 左から右 |
| D | 下から上 |

#### 正解: A

> CSSのgradient角度は上(12時方向)を0deg、時計回りに増加する。160degは左上から右下方向であり、金属質感の光沢表現に使われている。

---

### C-T4（難易度3）

以下のCSSで`pointer-events: none`を削除した場合に発生する問題はどれか。

```css
#screen-flash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
}
```

| 選択肢 | 内容 |
| --- | --- |
| A | 画面全体のクリック・タップが遮断され、ボタンが操作できなくなる |
| B | オーバーレイが非表示になる |
| C | アニメーションが停止する |
| D | z-indexが無効になる |

#### 正解: A

> この要素はfixed+inset:0で画面全体を覆い、z-index:9999で最前面にある。pointer-events:noneがないとイベントを遮断する。

---

### C-T5（難易度3）

`backdrop-filter: blur(8px)`と`filter: blur(8px)`の違いとして正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | backdrop-filterは背後の内容をぼかし、filterは要素自体をぼかす |
| B | どちらも要素自体をぼかす |
| C | backdrop-filterは影をぼかし、filterは背景をぼかす |
| D | backdrop-filterはテキストのみ、filterは画像のみに適用される |

#### 正解: A

> backdrop-filterは要素の背後にある描画内容にフィルターを適用する（すりガラス効果）。filterは要素自体（テキスト、画像含む）全体にフィルターを適用する。

---

### C-T6（難易度3）

CSSアニメーションの`alternate`と`normal`の違いとして正しいものはどれか。

```css
animation: blink 0.6s ease-in-out infinite alternate;
```

| 選択肢 | 内容 |
| --- | --- |
| A | alternateは順方向と逆方向を交互に再生、normalは毎回順方向のみ |
| B | alternateは2回で停止、normalは無限に再生 |
| C | alternateは速度が変化、normalは一定速度 |
| D | どちらも同じ動作 |

#### 正解: A

> alternateは from→to→from→to と滑らかに往復する。normalは毎回from→toの後、瞬時にfromへ戻るため、ぎこちない点滅になる。

---

### C-T7（難易度3）

`appearance: none`を`<input type="range">`に指定する目的として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | ブラウザのデフォルトスタイルを除去し、CSSでカスタムデザインする |
| B | スライダーの機能を無効にする |
| C | スライダーを非表示にする |
| D | 値の範囲を初期化する |

#### 正解: A

> appearance:noneはネイティブスタイルを除去する。::-webkit-slider-thumb等の擬似要素でつまみやトラックを自由にデザインできる。機能は維持される。

---

### C-T8（難易度3）

`inset: 0`はどのプロパティの短縮記法か。

| 選択肢 | 内容 |
| --- | --- |
| A | top: 0; right: 0; bottom: 0; left: 0 |
| B | margin: 0; padding: 0 |
| C | width: 100%; height: 100% |
| D | border: 0; outline: 0 |

#### 正解: A

> insetはtop/right/bottom/leftの一括指定。position:fixedと組み合わせるとビューポート全体を覆う。width/heightとは異なり位置指定プロパティの短縮である。

---

## 主体的に学習に取り組む態度

---

### ハンズオン検証

#### 課題C-1: 楕円フレームの作成

以下のHTMLに対し、CSSで横長の銀色楕円フレームを作成せよ。

```html
<div class="frame">
  <div class="inner">時計</div>
</div>
```

要件:
- `.frame`: 幅400px、高さ300px、`border-radius: 50%`、linear-gradient（#e8e8e8→#a0a0a0→#d0d0d0）
- `.inner`: 幅300px、高さ220px、背景#1a1a2e、Flexboxで中央配置
- widthとheightを同じ値に変えると正円になることを確認せよ

#### 課題C-2: 縦縞背景の検証

`repeating-linear-gradient`を使って青い背景（#3a7abf）の上に白い半透明の縦縞を重ねよ。

- 縞の幅3px、間隔5px（1パターン8px）
- 90degを0degに変えた場合の変化を検証せよ
- rgba()の透明度を0.07→0.2に変えた場合の見た目を確認せよ

#### 課題C-3: すりガラスパネル

半透明の黒背景にbackdrop-filter: blur(8px)を適用したパネルを作成せよ。

- パネルの後ろにカラフルな画像やテキストを配置し、ぼかし効果を確認
- blur値を0px, 4px, 8px, 16pxと変えて効果の違いを観察せよ
- backdrop-filterをfilterに変えた場合の違いを検証せよ

#### 課題C-4: プログレスバー

コンテナ内に色付きバーを配置し、`transition: width 0.3s`でアニメーションさせよ。

- ボタンクリックでバー幅を0%→50%→100%と変更する仕組みを作成
- transitionの秒数（0.1s, 0.3s, 1s, 3s）を変えて体感速度を確認せよ
- イージング（ease, linear, ease-in-out）の違いを検証せよ

#### 課題C-5: @keyframesアニメーション

以下の点滅アニメーションを作成し、`alternate`の有無で動きがどう変わるか検証せよ。

```css
@keyframes blink {
  from { opacity: 1; }
  to { opacity: 0.3; }
}
```

- `animation: blink 0.6s infinite`（alternateなし）
- `animation: blink 0.6s infinite alternate`（alternateあり）
- 0.6sを2sに変えた場合の体感を確認せよ
