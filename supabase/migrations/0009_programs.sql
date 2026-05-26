-- Activity programs shown on /activities. Previously a hardcoded array.
-- `items` holds the bullet list as a Postgres text[]. Mirrors the
-- partners/testimonials pattern: public read, authenticated write.
-- Additive + idempotent.

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  title text not null,
  items text[] not null default '{}',
  sort_order int not null default 0
);

create index if not exists programs_sort_idx on public.programs (sort_order);

alter table public.programs enable row level security;

drop policy if exists programs_select_anon on public.programs;
create policy programs_select_anon on public.programs
  for select to anon, authenticated using (true);

drop policy if exists programs_insert_authenticated on public.programs;
create policy programs_insert_authenticated on public.programs
  for insert to authenticated with check (true);

drop policy if exists programs_update_authenticated on public.programs;
create policy programs_update_authenticated on public.programs
  for update to authenticated using (true) with check (true);

drop policy if exists programs_delete_authenticated on public.programs;
create policy programs_delete_authenticated on public.programs
  for delete to authenticated using (true);

-- Seed the 4 current programs (6.1–6.4) from activities/page.tsx.
insert into public.programs (code, title, items, sort_order) values
  (
    '6.1',
    'Хүүхэд хөгжлийн сургалт',
    array['Харилцааны ур чадвар','Багаар ажиллах','Манлайлал','Амьдрах ухаан','Ирээдүйн зорилго тодорхойлох'],
    1
  ),
  (
    '6.2',
    'Сэтгэлзүйн зөвлөгөө',
    array['Ганцаарчилсан зөвлөгөө','Бүлгийн уулзалт','Сэтгэлзүйн оношилгоо','Арт терапи','Хүүхэд сонсох үйлчилгээ'],
    2
  ),
  (
    '6.3',
    'Урлаг, хөгжлийн хөтөлбөр',
    array['Гар урлал','Зураг','Дуу хөгжим','Ном уншлага','Театр жүжигчилсэн тоглолт'],
    3
  ),
  (
    '6.4',
    'Эцэг эхийн хөтөлбөр',
    array['Хүүхэд хүмүүжлийн сургалт','Гэр бүлийн харилцаа','Хүүхдийн сэтгэлзүй ойлгох зөвлөгөө'],
    4
  )
on conflict do nothing;
