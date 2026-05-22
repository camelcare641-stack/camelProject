-- 0001_schema.sql — base tables, views, indexes
-- Run AFTER creating the Supabase project. Apply in order: 0001 → 0002 → 0003.

create extension if not exists "pgcrypto";

-- ── ENUMS ─────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'donation_status') then
    create type public.donation_status as enum ('pending', 'paid', 'failed');
  end if;
end$$;

-- ── campaign (single row) ─────────────────────────────────────────────────────
create table if not exists public.campaign (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  story text not null default '',
  goals text[] not null default '{}',
  advantages text[] not null default '{}',
  goal_amount bigint not null check (goal_amount > 0),
  bank_account_info jsonb,
  created_at timestamptz not null default now()
);

-- Guard the "single fixed campaign" invariant with a partial unique index.
create unique index if not exists campaign_singleton_idx
  on public.campaign ((true));

-- ── donations ─────────────────────────────────────────────────────────────────
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_name text not null,
  donor_email text,
  donor_phone text,
  amount bigint not null check (amount >= 1000),
  message text,
  is_anonymous boolean not null default false,
  qpay_invoice_id text,
  qpay_payment_id text unique,         -- idempotency key for the webhook
  status public.donation_status not null default 'pending',
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists donations_status_paid_at_idx
  on public.donations (status, paid_at desc);
create index if not exists donations_qpay_invoice_id_idx
  on public.donations (qpay_invoice_id);

-- ── partners ──────────────────────────────────────────────────────────────────
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  description text,
  sort_order int not null default 0
);

create index if not exists partners_sort_idx on public.partners (sort_order);

-- ── news ──────────────────────────────────────────────────────────────────────
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null,
  cover_image_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists news_published_idx
  on public.news (published, published_at desc);

-- ── public_donations VIEW ─────────────────────────────────────────────────────
-- Hides donor_email/donor_phone/is_anonymous internals from public clients.
-- Only paid, non-anonymous donations are exposed.
create or replace view public.public_donations as
select
  donor_name,
  amount,
  message,
  paid_at
from public.donations
where status = 'paid'
  and is_anonymous = false
  and paid_at is not null;

-- ── campaign_stats VIEW ───────────────────────────────────────────────────────
create or replace view public.campaign_stats as
select
  coalesce(sum(d.amount) filter (where d.status = 'paid'), 0)::bigint as total_raised,
  count(*) filter (where d.status = 'paid')::int as donor_count,
  (select goal_amount from public.campaign limit 1) as goal_amount
from public.donations d;

-- Views inherit the security context of the *caller*. To let Supabase Realtime
-- and anon clients read them, GRANT explicit SELECT below — RLS on the
-- underlying tables still applies, so the view is constrained by the table
-- policies in 0002_rls.sql.
grant select on public.public_donations to anon, authenticated;
grant select on public.campaign_stats to anon, authenticated;
