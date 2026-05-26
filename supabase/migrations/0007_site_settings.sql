-- Editable site settings: a simple key-value store for client-provided strings
-- (bank details, contact info, org descriptions) that were previously hardcoded
-- placeholders in src/lib/content.ts. Public pages read these; admins edit them.
--
-- Additive + idempotent: safe to re-run. Public read is intentional — every
-- seeded value is already shown on the public site (bank/contact info).

create table if not exists public.site_settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Public read (anon + authenticated), same pattern as partners/testimonials.
drop policy if exists site_settings_select_anon on public.site_settings;
create policy site_settings_select_anon on public.site_settings
  for select to anon, authenticated using (true);

-- Authenticated write (admin role; app enforces requireAdmin()).
drop policy if exists site_settings_insert_authenticated on public.site_settings;
create policy site_settings_insert_authenticated on public.site_settings
  for insert to authenticated with check (true);

drop policy if exists site_settings_update_authenticated on public.site_settings;
create policy site_settings_update_authenticated on public.site_settings
  for update to authenticated using (true) with check (true);

-- Seed with the current content.ts values verbatim (placeholders included) so
-- the public site is unchanged until an admin edits them. Never overwrites
-- existing rows.
insert into public.site_settings (key, value) values
  ('org_name',        '“Дадал Тэнцвэр” ТББ'),
  ('org_full_name',   '“ТЭМЭЭ” хүүхэд хөгжлийн төсөл'),
  ('slogan',          'Тэнцвэртэй нийгэм — Гэрэлтэй ирээдүй'),
  ('hook',            'Нэг тэмээ — Нэг хүүхдийн ирээдүй'),
  ('description',     '“ТЭМЭЭ” хүүхэд хөгжлийн төсөл, хотын захын хорооллын болон эмзэг бүлгийн хүүхдүүдийн боловсрол, сэтгэлзүй, хөгжлийг хамтдаа дэмжье.'),
  ('bank_name',       'Хаан банк'),
  ('bank_holder',     '"Дадал Тэнцвэр" ТББ'),
  ('bank_account',    '[REPLACE — дансны дугаар]'),
  ('bank_note',       'Гүйлгээний утганд өөрийн нэр + утасны дугаараа бичээрэй.'),
  ('contact_phone',   '[REPLACE — утас]'),
  ('contact_email',   '[REPLACE — и-мэйл]'),
  ('contact_address', '[REPLACE — хаяг]')
on conflict (key) do nothing;
