-- About-page list content: goals, targets, outcomes, and "camel point" claims.
-- One table discriminated by `kind`. Only camel_point rows use `title`; the
-- other kinds store their single line in `body`. The camel_point rows also feed
-- the home camel-section (de-duplicated). Mirrors the public-read/auth-write
-- pattern. Additive + idempotent.

create table if not exists public.about_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('goal','target','outcome','camel_point')),
  title text,
  body text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists about_items_kind_sort_idx
  on public.about_items (kind, sort_order);

alter table public.about_items enable row level security;

drop policy if exists about_items_select_anon on public.about_items;
create policy about_items_select_anon on public.about_items
  for select to anon, authenticated using (true);

drop policy if exists about_items_insert_authenticated on public.about_items;
create policy about_items_insert_authenticated on public.about_items
  for insert to authenticated with check (true);

drop policy if exists about_items_update_authenticated on public.about_items;
create policy about_items_update_authenticated on public.about_items
  for update to authenticated using (true) with check (true);

drop policy if exists about_items_delete_authenticated on public.about_items;
create policy about_items_delete_authenticated on public.about_items
  for delete to authenticated using (true);

-- Seed current about-page content.
insert into public.about_items (kind, title, body, sort_order) values
  ('goal', null, 'Хүүхдүүдэд амьдрах ухаан, хувь хүний хөгжлийн сургалт зохион байгуулах.', 1),
  ('goal', null, 'Сэтгэлзүйн зөвлөгөө, сэтгэл заслын дэмжлэг үзүүлэх.', 2),
  ('goal', null, 'Эрсдэлт нөхцөлд байгаа хүүхдүүдийг нийгмийн хамгааллын үйлчилгээтэй холбох.', 3),
  ('goal', null, 'Хүүхдийн өөртөө итгэх итгэл болон нийгмийн оролцоог нэмэгдүүлэх.', 4),
  ('goal', null, 'Сайн дурын болон олон нийтийн оролцоог нэмэгдүүлэх.', 5),
  ('target', null, 'Хотын захын хорооллын хүүхдүүд', 1),
  ('target', null, 'Амьжиргааны түвшин доогуур өрхийн хүүхдүүд', 2),
  ('target', null, 'Сэтгэлзүйн дэмжлэг шаардлагатай хүүхдүүд', 3),
  ('target', null, 'Сургууль завсардалтын эрсдэлтэй хүүхдүүд', 4),
  ('target', null, 'Хүчирхийлэл, үл хайхралд өртөх эрсдэлтэй хүүхдүүд', 5),
  ('target', null, 'Өөртөө итгэх итгэл сул хүүхдүүд', 6),
  ('outcome', null, 'Хүүхдийн сэтгэлзүйн байдал сайжирна', 1),
  ('outcome', null, 'Өөртөө итгэх итгэл нэмэгдэнэ', 2),
  ('outcome', null, 'Нийгмийн оролцоо сайжирна', 3),
  ('outcome', null, 'Сургууль завсардалт буурна', 4),
  ('outcome', null, 'Эерэг хандлага төлөвшинө', 5),
  ('outcome', null, 'Иргэдийн сайн дурын оролцоо нэмэгдэнэ', 6),
  ('camel_point', 'Гар урлалын бүтээгдэхүүн', 'Арьсаар гараар хийсэн тэмээн цүнх / түлхүүрний оосор.', 1),
  ('camel_point', '25,000₮ = Нэг хүүхдийн боломж', 'Сургалт, сэтгэлзүйн зөвлөгөө, хөгжлийн үйл ажиллагаа, хамгааллын үйлчилгээ, урлаг спортын оролцоонд нэг хүүхдэд хүрэх бодит дэмжлэг.', 2),
  ('camel_point', 'Зүүсэн хүний үнэ цэн', 'Ижил зорилготой хүмүүсийн хүрээлэлд нэгдэнэ.', 3)
on conflict do nothing;
