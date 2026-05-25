-- "ТЭМЭЭ" donation site — full schema, RLS, and seed in one migration.
-- Apply once on a fresh Supabase project.

create extension if not exists "pgcrypto";

-- ── Drop legacy tables from the prior scaffold (qpay / admin) ───────────────
-- These had different shapes (campaign singleton, donations w/ qpay invoice
-- ids, news w/ slug+content, partners). The new site doesn't use any of them.
drop view if exists public.public_donations;
drop view if exists public.campaign_stats;
drop table if exists public.donations cascade;
drop table if exists public.campaign cascade;
drop table if exists public.partners cascade;
drop table if exists public.news cascade;
drop type if exists public.donation_status;

-- ── donors ───────────────────────────────────────────────────────────────────
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount integer not null default 25000 check (amount >= 0),
  created_at timestamptz not null default now()
);

create index if not exists donors_created_at_idx
  on public.donors (created_at desc);

-- ── news ─────────────────────────────────────────────────────────────────────
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  image_url text,
  published_at date not null default current_date
);

create index if not exists news_published_at_idx
  on public.news (published_at desc);

-- ── messages ─────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  topic text,
  body text not null,
  created_at timestamptz not null default now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.donors enable row level security;
alter table public.news enable row level security;
alter table public.messages enable row level security;

-- donors: public read, public insert (the donor self-registers from the form).
drop policy if exists donors_select_anon on public.donors;
create policy donors_select_anon on public.donors
  for select to anon, authenticated using (true);

drop policy if exists donors_insert_anon on public.donors;
create policy donors_insert_anon on public.donors
  for insert to anon, authenticated with check (
    char_length(name) between 1 and 100
    and amount between 0 and 100000000
  );

-- news: public read only. Writes via service role.
drop policy if exists news_select_anon on public.news;
create policy news_select_anon on public.news
  for select to anon, authenticated using (true);

-- messages: public insert only. Reads via service role.
drop policy if exists messages_insert_anon on public.messages;
create policy messages_insert_anon on public.messages
  for insert to anon, authenticated with check (
    char_length(name) between 1 and 100
    and char_length(contact) between 1 and 200
    and char_length(body) between 1 and 4000
  );

-- ── seed: news ───────────────────────────────────────────────────────────────
insert into public.news (title, summary, image_url, published_at) values
  (
    'Анхны "Тэмээ" хүлээлгэн өгөх ёслол',
    'Хотын захын хорооллын 25 хүүхдэд анхны "Тэмээ" бэлэгдлийг гардуулж, сэтгэлзүйн зөвлөгөөний хөтөлбөр албан ёсоор эхэллээ.',
    null,
    current_date - 14
  ),
  (
    'Эцэг эхийн сургалт амжилттай боллоо',
    'Гэр бүлийн харилцаа, хүүхэд хүмүүжлийн сэдвээр явагдсан 2 өдрийн сургалтад 40 гаруй эцэг эх оролцлоо.',
    null,
    current_date - 30
  ),
  (
    'Сэтгэлзүйн зөвлөгөөний кабинет нээгдлээ',
    'Хүүхдүүдийн ганцаарчилсан болон бүлгийн сэтгэлзүйн зөвлөгөөг тогтмол хүлээн авах боломжтой боллоо.',
    null,
    current_date - 60
  ),
  (
    'Сайн дурын ажилтнуудаа баярлуулав',
    'Жилийн турш төслийн үйл ажиллагаанд хувь нэмрээ оруулсан 18 сайн дурын ажилтанд талархал илэрхийлсэн арга хэмжээ зохион байгууллаа.',
    null,
    current_date - 90
  )
on conflict do nothing;

-- ── seed: donors (for the homepage marquee + running total) ─────────────────
insert into public.donors (name, amount, created_at) values
  ('Б. Энхтуяа',     25000, now() - interval '1 hour'),
  ('Г. Болормаа',    25000, now() - interval '3 hours'),
  ('Д. Батбаяр',     50000, now() - interval '5 hours'),
  ('С. Оюунчимэг',   25000, now() - interval '8 hours'),
  ('Т. Мөнхбат',     25000, now() - interval '1 day'),
  ('Н. Цэцэгмаа',    100000, now() - interval '1 day 2 hours'),
  ('Ж. Анхбаяр',     25000, now() - interval '2 days'),
  ('Х. Сарангэрэл',  25000, now() - interval '2 days 4 hours'),
  ('О. Болд',        75000, now() - interval '3 days'),
  ('Ц. Уранбилэг',   25000, now() - interval '4 days'),
  ('М. Гантулга',    25000, now() - interval '5 days'),
  ('Э. Дэлгэрмаа',   50000, now() - interval '6 days'),
  ('А. Тэмүүлэн',    25000, now() - interval '7 days'),
  ('Р. Энхжаргал',   25000, now() - interval '8 days'),
  ('П. Сүхбат',      25000, now() - interval '9 days'),
  ('Ё. Наранцэцэг',  25000, now() - interval '10 days')
on conflict do nothing;
