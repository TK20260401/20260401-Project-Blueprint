-- =====================================================================
-- 新規テーブル作成テンプレート (Supabase 2026-05-30 以降の必須セット)
-- =====================================================================
-- 背景: 2026-05-30以降、publicスキーマに新規作成したテーブルは
--       明示的にGRANTしないとData API (supabase-js, PostgREST, GraphQL)
--       から見えない。10-30に既存プロジェクトにも強制適用。
-- 共用Supabaseプロジェクト: TK20260401's Project (ycqgkgtgkhxfvgfhlmqe)
-- =====================================================================

-- ▼ パターンA: 認証ユーザーのみアクセス可（最も一般的）
-- 例: profiles, otetsudai_*, daily_reports など個人データ系
-- ---------------------------------------------------------------------
create table public.your_table (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  -- ... 業務カラム ...
  created_at timestamptz not null default now()
);

-- 必須: 明示的GRANT (5/30以降のデフォルトでは付かない)
grant select, insert, update, delete on public.your_table to authenticated;
grant all                              on public.your_table to service_role;
-- anonには付与しない (=データAPI経由で未認証アクセス不可)

-- RLS有効化
alter table public.your_table enable row level security;

-- ポリシー (TO authenticatedで明示)
create policy "your_table_select_own"
  on public.your_table for select to authenticated
  using (auth.uid() = user_id);

create policy "your_table_insert_own"
  on public.your_table for insert to authenticated
  with check (auth.uid() = user_id);

create policy "your_table_update_own"
  on public.your_table for update to authenticated
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "your_table_delete_own"
  on public.your_table for delete to authenticated
  using (auth.uid() = user_id);


-- ▼ パターンB: 未認証も読める公開テーブル
-- 例: visitors, visitor_counts, scores (公開リーダーボード等)
-- ---------------------------------------------------------------------
create table public.public_stats (
  id         uuid primary key default gen_random_uuid(),
  visit_date date not null,
  count      bigint not null default 0
);

grant select         on public.public_stats to anon;          -- 公開SELECT
grant select, insert on public.public_stats to authenticated;
grant all            on public.public_stats to service_role;

alter table public.public_stats enable row level security;

create policy "public_stats_select_all"
  on public.public_stats for select to anon, authenticated
  using (true);


-- ▼ パターンC: サーバ専用 (service_roleのみ)
-- 例: webhook_logs, internal_audit など
-- ---------------------------------------------------------------------
create table public.server_only (
  id         uuid primary key default gen_random_uuid(),
  payload    jsonb,
  created_at timestamptz not null default now()
);

grant all on public.server_only to service_role;
-- anon / authenticated は付与しない
alter table public.server_only enable row level security;
-- ポリシー不要 (誰もアクセスできない、service_roleはRLSバイパス)


-- =====================================================================
-- もしGRANT忘れたら…
-- PostgRESTは 42501 エラーと一緒に「不足しているGRANT文」を返す。
-- エラーメッセージのSQLをそのままコピペすれば直る。
-- =====================================================================
