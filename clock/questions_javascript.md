# 時計アプリで学ぶ JavaScript問題集

NHK風時計アプリの実装を題材に、JavaScriptのDOM操作・API・非同期処理・Canvas等を学ぶ問題集である。
観点別（知識・理解 / 思考・判断・表現 / 主体的に学習に取り組む態度）に構成している。

---

## 知識・理解

---

### J-K1（難易度1）

`document.getElementById('clock-canvas')`の戻り値として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | id属性が"clock-canvas"であるHTML要素 |
| B | class属性が"clock-canvas"であるすべての要素 |
| C | タグ名が"clock-canvas"である要素 |
| D | 文字列"clock-canvas" |

#### 正解: A

> getElementByIdはid属性で1つの要素を取得する。classで取得するのはgetElementsByClassNameやquerySelectorAll、タグ名で取得するのはgetElementsByTagNameである。

---

### J-K2（難易度1）

`String(5).padStart(2, '0')`の戻り値として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | "05" |
| B | "50" |
| C | "5" |
| D | "005" |

#### 正解: A

> String(5)は"5"（1文字）。padStart(2, '0')は文字列の先頭を'0'で埋めて全体を2文字にする。padEndなら末尾に埋めて"50"になる。

---

### J-K3（難易度1）

`new Date().getMonth()`が返す値の範囲として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 0〜11（1月=0） |
| B | 1〜12（1月=1） |
| C | 0〜6（曜日） |
| D | 1〜31（日付） |

#### 正解: A

> getMonth()は0始まりで0=1月、11=12月。表示用には+1する必要がある。曜日を返すのはgetDay()（0=日曜）、日付を返すのはgetDate()である。

---

### J-K4（難易度1）

`setInterval(func, 1000)`と`setTimeout(func, 1000)`の違いとして正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | setIntervalは繰り返し実行、setTimeoutは1回だけ実行 |
| B | setIntervalは1回だけ、setTimeoutは繰り返し実行 |
| C | どちらも繰り返し実行 |
| D | どちらも1回だけ実行 |

#### 正解: A

> setIntervalは指定間隔で関数を繰り返し呼び出す。setTimeoutは指定時間後に1回だけ呼び出す。いずれもclearInterval/clearTimeoutで停止できる。

---

### J-K5（難易度2）

Canvas APIで`ctx.clearRect(0, 0, W, H)`を毎フレーム呼び出す理由として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 前フレームの描画を消去し、白紙から描画し直す |
| B | キャンバスのサイズを変更する |
| C | コンテキストを初期化する |
| D | アニメーション速度を制御する |

#### 正解: A

> Canvasは描画内容が保持されるため、毎フレームclearRectで消去しないと前フレームの針が残って扇形の軌跡になる。

---

### J-K6（難易度2）

`appendChild`の動作として正しいものはどれか。

```js
const opt = document.createElement('option');
citySelect.appendChild(opt);
```

| 選択肢 | 内容 |
| --- | --- |
| A | 親要素の子要素リストの末尾に追加する |
| B | 親要素を置き換える |
| C | 子要素をすべて削除してから追加する |
| D | 要素のテキストを変更する |

#### 正解: A

> appendChildは既存の子要素を保持したまま末尾に追加する。置き換えはreplaceChild、削除はremoveChildである。

---

### J-K7（難易度2）

`classList.add('running')`と`className = 'running'`の違いとして正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | classList.addは既存クラスを維持して追加、classNameは全クラスを置き換え |
| B | どちらも既存クラスを維持する |
| C | どちらも全クラスを置き換える |
| D | classList.addは文字列のみ、classNameはオブジェクトを受け取る |

#### 正解: A

> classList.add/removeは個別のクラスを追加・削除し、他のクラスに影響しない。classNameへの代入はすべてのクラスを上書きする。

---

## 思考・判断・表現

---

### J-T1（難易度2）

`async/await`を使った天気データ取得で、`await`の役割として正しいものはどれか。

```js
async function fetchWeather() {
  const res = await fetch(url);
  const data = await res.json();
}
```

| 選択肢 | 内容 |
| --- | --- |
| A | Promiseが解決されるまで関数内の処理を一時停止し、結果を変数に代入する |
| B | 関数の実行を永久に停止する |
| C | エラー時のみ実行される |
| D | 同期的に即座にデータを取得する |

#### 正解: A

> awaitはasync関数内でPromiseの完了を待つ。ブラウザ全体を止めるのではなく、その関数内の実行だけが一時停止する。

---

### J-T2（難易度2）

テンプレートリテラルの出力として正しいものはどれか。

```js
const city = { name: '東京', lat: 35.6895 };
const url = `https://api.example.com?lat=${city.lat}&name=${city.name}`;
```

| 選択肢 | 内容 |
| --- | --- |
| A | `https://api.example.com?lat=35.6895&name=東京` |
| B | `https://api.example.com?lat=${city.lat}&name=${city.name}` |
| C | エラーが発生する |
| D | `https://api.example.com?lat=35&name=東京` |

#### 正解: A

> バッククォート内の${}は式を評価して文字列に埋め込む。通常の引用符では${}はそのまま文字列になる。

---

### J-T3（難易度3）

Web Audio APIで`osc.frequency.value = 880`の880が意味するものはどれか。

```js
const osc = ac.createOscillator();
osc.type = 'sine';
osc.frequency.value = 880;
```

| 選択肢 | 内容 |
| --- | --- |
| A | 周波数880Hz（ラの音、A5） |
| B | 音量880 |
| C | 再生時間880ミリ秒 |
| D | サンプリングレート880 |

#### 正解: A

> frequencyは正弦波の周波数をHz単位で指定する。880Hzは音楽のA5。音量はGainNodeのgain値、再生時間はstart/stopで制御する。

---

### J-T4（難易度3）

イベントリスナーで`{ passive: true }`を指定する目的として正しいものはどれか。

```js
slider.addEventListener('touchstart', handler, { passive: true });
```

| 選択肢 | 内容 |
| --- | --- |
| A | preventDefault()を呼ばないことをブラウザに伝え、スクロール性能を向上させる |
| B | イベントを1回だけ受け取る |
| C | イベントの伝播を停止する |
| D | イベントリスナーを自動的に削除する |

#### 正解: A

> passive:trueはpreventDefault()を呼ばない宣言。ブラウザはpreventDefaultが呼ばれるか待たずにスクロール処理を開始でき、タッチ操作の応答性が向上する。

---

### J-T5（難易度3）

`parseInt(slider.value, 10)`の第2引数`10`の役割として正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | 10進数として解析することを明示する |
| B | 最大10文字まで解析する |
| C | 10を加算する |
| D | 小数点以下10桁まで解析する |

#### 正解: A

> parseIntの第2引数は基数（radix）。10を指定すると10進数として解析される。省略すると文字列が"0x"で始まる場合に16進数と解釈される等の意図しない動作が起こりうる。

---

### J-T6（難易度3）

即時実行関数式(IIFE)で全体を囲む理由として正しいものはどれか。

```js
(function () {
  const canvas = document.getElementById('clock-canvas');
  // ...全コード
})();
```

| 選択肢 | 内容 |
| --- | --- |
| A | 変数がグローバルスコープを汚染しないようにする |
| B | 関数を非同期にする |
| C | エラーハンドリングを自動化する |
| D | コードの実行速度を上げる |

#### 正解: A

> IIFEは関数スコープを作り、内部で宣言した変数（canvas, ctx等）がグローバルスコープに漏れないようにする。他のスクリプトとの変数名の衝突を防ぐ。

---

### J-T7（難易度3）

`document.querySelectorAll('.weather-tab')`と`document.getElementsByClassName('weather-tab')`の違いとして正しいものはどれか。

| 選択肢 | 内容 |
| --- | --- |
| A | querySelectorAllは静的なNodeList、getElementsByClassNameはライブHTMLCollection |
| B | どちらも静的なリストを返す |
| C | querySelectorAllはidで検索、getElementsByClassNameはclassで検索 |
| D | querySelectorAllは1つの要素、getElementsByClassNameは複数の要素を返す |

#### 正解: A

> querySelectorAllは呼び出し時点のスナップショット（静的NodeList）を返す。getElementsByClassNameはDOM変更を自動反映するライブHTMLCollectionを返す。forEachはNodeListでのみ直接使用可能。

---

## 主体的に学習に取り組む態度

---

### ハンズオン検証

#### 課題J-1: デジタル時計

以下のHTMLに対し、JavaScriptで現在時刻を「HH:MM:SS」形式で表示し、毎秒更新せよ。

```html
<div id="time" style="font-size:48px; font-family:monospace;"></div>
```

ヒント:
- `new Date()`で現在日時を取得
- `getHours()`, `getMinutes()`, `getSeconds()`で時分秒を取得
- `String(n).padStart(2, '0')`でゼロ埋め
- `setInterval`で1秒ごとに更新
- 動作確認後、`setInterval`を`setTimeout`に変えた場合の違いを検証せよ

#### 課題J-2: 天気API呼び出し

Open-Meteo APIから東京の現在気温を取得し、画面に表示せよ。

```js
const url = 'https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current=temperature_2m&timezone=Asia%2FTokyo';
```

- `fetch(url)`→`.then(res => res.json())`→`.then(data => ...)`の形式で記述
- 取得したデータのdata.current.temperature_2mを表示
- 動作確認後、async/await形式に書き換えて同じ結果になることを検証せよ

#### 課題J-3: カウントダウンタイマー

10秒のカウントダウンタイマーを検証せよ。

要件:
- 「スタート」ボタンを押すと10からカウントダウン開始
- 残り秒数を画面に大きく表示
- 0になったら`alert('終了!')`を表示しタイマーを停止
- `Date.now()`の差分で経過時間を計測すること
- 「ストップ」ボタンで途中停止できるようにせよ
- clearIntervalの前後でtimerInterval変数がどう変化するか`console.log`で確認せよ

#### 課題J-4: 都市セレクトの動的生成

以下の都市配列から`<select>`を動的に生成し、選択された都市名を表示せよ。

```js
const cities = [
  { name: '札幌', lat: 43.06 },
  { name: '東京', lat: 35.69 },
  { name: '大阪', lat: 34.69 },
  { name: '福岡', lat: 33.59 },
  { name: '那覇', lat: 26.21 }
];
```

- `document.createElement('option')`で選択肢を生成
- `selectEl.appendChild(opt)`で追加
- `addEventListener('change', ...)`で選択変更を検知
- 選択した都市名と緯度を同時に表示する仕組みを検証せよ

#### 課題J-5: Canvas基礎 — 図形描画

300×300のcanvasに以下を描画せよ。

1. 中心(150,150)に半径100の円（線のみ、塗りなし）
2. 中心から12時方向に長さ80の赤い線（時計の針）
3. 中心に半径5の黒い丸（中心点）

- `ctx.beginPath()`, `ctx.arc()`, `ctx.stroke()`の使い方を確認
- 針の角度を変数にして、ボタンクリックで30度ずつ回転させる仕組みを検証せよ

#### 課題J-6: イベント委譲の検証

複数のボタン（1分, 3分, 5分, 10分）をHTML上に並べ、クリックされたボタンのdata-minutes属性の値を表示せよ。

```html
<div id="presets">
  <button data-minutes="1">1分</button>
  <button data-minutes="3">3分</button>
  <button data-minutes="5">5分</button>
  <button data-minutes="10">10分</button>
</div>
```

- 方法1: 各ボタンにaddEventListenerを設定
- 方法2: 親要素#presetsに1つだけaddEventListenerを設定し、`event.target.dataset.minutes`で値を取得
- 両方を検証し、方法2（イベント委譲）の利点を考察せよ
