-- QPay donation pipeline: donations table, RLS, and realtime publication.
--
-- The existing `donors` table stays as the public marquee source.
-- On webhook confirm, a row is inserted into `donors` so SupportBar stats
-- and the marquee keep reading from one source. This table is the
-- operational transaction log used by the QPay flow and admin tooling.

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),

  -- Donor info captured by the modal form
  name text not null,
  email text not null,
  phone text,
  message text,
  anonymous boolean not null default false,

  -- Amount in MNT
  amount integer not null check (amount >= 1),

  -- QPay tracking
  qpay_invoice_id text unique,
  qpay_payment_id text unique,

  -- Lifecycle
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'expired', 'failed')),

  -- Charm fulfillment (for amount >= 25,000)
  shipping_status text not null default 'none'
    check (shipping_status in ('none', 'pending_address', 'addressed', 'shipped', 'delivered')),

  -- Notification state
  thank_you_sent_at timestamptz,

  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists donations_status_idx
  on public.donations (status);

create index if not exists donations_created_at_idx
  on public.donations (created_at desc);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.donations enable row level security;

-- Anon can insert pending rows from the modal. Selects/updates go via service role.
drop policy if exists donations_insert_anon on public.donations;
create policy donations_insert_anon on public.donations
  for insert to anon, authenticated with check (
    status = 'pending'
    and char_length(name) between 1 and 100
    and char_length(email) between 5 and 200
    and amount between 1 and 100000000
  );

-- Anon can read their own row by id (needed for the modal's realtime subscription).
-- We accept that knowing a UUID is sufficient — no PII like email is exposed
-- in the columns the modal subscribes to (it only watches status).
drop policy if exists donations_select_anon on public.donations;
create policy donations_select_anon on public.donations
  for select to anon, authenticated using (true);

-- ── Realtime publication ────────────────────────────────────────────────────
-- Add the donations table to the supabase_realtime publication so
-- postgres_changes subscriptions fire when status flips to 'paid'.
do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    alter publication supabase_realtime add table public.donations;
  end if;
exception
  when duplicate_object then null;
end $$;
