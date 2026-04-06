# データベース設計

## テーブル構成

### assets（備品マスター）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| asset_code | TEXT UNIQUE | 備品ID (例: EQ-2026-0001) |
| category | TEXT | カテゴリ (プルダウン) |
| name | TEXT | 品名 |
| model_number | TEXT | 型番 |
| purchased_at | DATE | 購入日 |
| useful_life | INT | 耐用年数 (デフォルト: 5) |
| location | TEXT | 保管場所 (教室名等) |
| status | TEXT | 使用中 / 修理中 / 廃棄済 |
| qr_url | TEXT | QRコード用URL |
| notes | TEXT | 備考 |
| created_at | TIMESTAMPTZ | 作成日時 |
| updated_at | TIMESTAMPTZ | 更新日時 |

### inventory_checks（棚卸し記録）

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | 自動生成 |
| asset_id | UUID (FK) | assets.id への参照 |
| checked_at | TIMESTAMPTZ | 確認日時 |
| checked_by | TEXT | 確認者 |
| result | TEXT | 確認済 / 不明 / 破損 |
| notes | TEXT | 備考 |

## SQL定義

```sql
-- 備品マスター
CREATE TABLE assets (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_code    TEXT UNIQUE NOT NULL,
  category      TEXT NOT NULL,
  name          TEXT NOT NULL,
  model_number  TEXT,
  purchased_at  DATE NOT NULL,
  useful_life   INT NOT NULL DEFAULT 5,
  location      TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT '使用中',
  qr_url        TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 棚卸し記録
CREATE TABLE inventory_checks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id      UUID REFERENCES assets(id),
  checked_at    TIMESTAMPTZ DEFAULT now(),
  checked_by    TEXT NOT NULL,
  result        TEXT NOT NULL DEFAULT '確認済',
  notes         TEXT
);

-- 更新推奨フラグ付きビュー
CREATE VIEW assets_with_renewal AS
SELECT *,
  CASE WHEN purchased_at + (useful_life || ' years')::INTERVAL <= now()
       THEN true ELSE false END AS needs_renewal
FROM assets;
```

## プルダウン項目（入力規則）

| 項目 | 選択肢 |
|------|--------|
| category | PC, モニター, プリンター, ネットワーク機器, 什器, その他 |
| status | 使用中, 修理中, 廃棄済 |
| location | 教室名・部屋名を運用に合わせて定義 |
| result (棚卸し) | 確認済, 不明, 破損 |
