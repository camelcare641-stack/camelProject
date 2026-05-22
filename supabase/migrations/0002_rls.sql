-- 0002_rls.sql — Row Level Security policies.
-- Apply AFTER 0001_schema.sql.

-- Enable RLS on every base table.
alter table public.campaign  enable row level security;
alter table public.donations enable row level security;
alter table public.partners  enable row level security;
alter table public.news      enable row level security;

-- ── campaign ──────────────────────────────────────────────────────────────────
drop policy if exists campaign_public_select on public.campaign;
create policy campaign_public_select
  on public.campaign for select
  to anon, authenticated
  using (true);

drop policy if exists campaign_admin_write on public.campaign;
create policy campaign_admin_write
  on public.campaign for all
  to authenticated
  using (true)
  with check (true);

-- ── partners ──────────────────────────────────────────────────────────────────
drop policy if exists partners_public_select on public.partners;
create policy partners_public_select
  on public.partners for select
  to anon, authenticated
  using (true);

drop policy if exists partners_admin_write on public.partners;
create policy partners_admin_write
  on public.partners for all
  to authenticated
  using (true)
  with check (true);

-- ── news ──────────────────────────────────────────────────────────────────────
drop policy if exists news_public_select on public.news;
create policy news_public_select
  on public.news for select
  to anon
  using (published = true);

drop policy if exists news_admin_all on public.news;
create policy news_admin_all
  on public.news for all
  to authenticated
  using (true)
  with check (true);

-- ── donations ─────────────────────────────────────────────────────────────────
-- No public SELECT, no public INSERT. Inserts happen exclusively via the
-- service-role client in api/qpay/callback (bypasses RLS).
drop policy if exists donations_admin_select on public.donations;
create policy donations_admin_select
  on public.donations for select
  to authenticated
  using (true);

-- Explicitly NO insert/update/delete policy for anon/authenticated.
-- The service role bypasses RLS, so the webhook can still write.

-- ── public_donations view ─────────────────────────────────────────────────────
-- Views run as their owner, so anon SELECT bypasses the donations RLS — the
-- view itself constrains rows (paid + non-anonymous) and columns (no PII).
-- Grants live in 0001_schema.sql.
