-- Adds slug + content to news, plus partners and testimonials tables.
-- Wipes the placeholder news seed first so we can re-seed with slugs + content.

-- ── news: add slug + content, re-seed ────────────────────────────────────────
delete from public.news;

alter table public.news
  add column if not exists slug text,
  add column if not exists content text;

create unique index if not exists news_slug_uidx on public.news (slug);

alter table public.news
  alter column slug set not null,
  alter column content set not null;

-- ── partners ─────────────────────────────────────────────────────────────────
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website_url text,
  sort_order int not null default 0
);

create index if not exists partners_sort_idx on public.partners (sort_order);

alter table public.partners enable row level security;
drop policy if exists partners_select_anon on public.partners;
create policy partners_select_anon on public.partners
  for select to anon, authenticated using (true);

-- ── testimonials ─────────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text,
  body text not null,
  photo_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists testimonials_sort_idx on public.testimonials (sort_order);

alter table public.testimonials enable row level security;
drop policy if exists testimonials_select_anon on public.testimonials;
create policy testimonials_select_anon on public.testimonials
  for select to anon, authenticated using (true);

-- ── seed: news (with slug + content) ─────────────────────────────────────────
insert into public.news (title, slug, summary, content, image_url, published_at) values
  (
    'Анхны "Тэмээ" хүлээлгэн өгөх ёслол',
    'anhny-temee-hluulgen-ogoh-yoslol',
    'Хотын захын хорооллын 25 хүүхдэд анхны "Тэмээ" бэлэгдлийг гардуулж, сэтгэлзүйн зөвлөгөөний хөтөлбөр албан ёсоор эхэллээ.',
    '2026 оны 5-р сард зохион байгуулагдсан ёслолын үеэр хотын захын хорооллын 25 хүүхэд анхны "Тэмээ" бэлэгдлээ хүлээн авлаа. Энэхүү арга хэмжээгээр төслийн сургалтын болон сэтгэлзүйн зөвлөгөөний хөтөлбөр албан ёсоор эхэлсэн юм.

Ёслолд хороо, сургуулийн удирдлага, эцэг эх, сайн дурын ажилтнууд оролцож, хүүхэд бүрт нь "Тэмээ" бэлэгдлийг хүлээлгэн өгсөн. Дараа нь хөгжмийн жижиг тоглолт болж, оролцогч хүүхдүүд өөрсдийн ирээдүйн мөрөөдлийн тухай хуваалцлаа.

Энэхүү 25 хүүхэд цаашид сар бүр сэтгэлзүйн зөвлөгөө, амьдрах ухааны сургалт, урлаг хөгжлийн хичээлд оролцох болно.',
    null,
    current_date - 14
  ),
  (
    'Эцэг эхийн сургалт амжилттай боллоо',
    'etseg-ehiin-surgalt',
    'Гэр бүлийн харилцаа, хүүхэд хүмүүжлийн сэдвээр явагдсан 2 өдрийн сургалтад 40 гаруй эцэг эх оролцлоо.',
    'Хоёр өдрийн турш үргэлжилсэн "Эцэг эхийн ур чадварын" сургалтад нийт 40 гаруй эцэг эх оролцов. Сургалтыг манай байгууллагатай хамтран ажилладаг туршлагатай сэтгэл зүйчид удирдан явуулсан.

Сургалтын гол сэдвүүд:
• Хүүхэдтэйгээ үр дүнтэй харилцах
• Гэр бүлийн дотоодын зөрчлийг шийдвэрлэх
• Хүүхдийн нас сэтгэхүйн онцлогийг ойлгох
• Сэтгэлзүйн дарамтыг танин мэдэх

Сургалтын дараа оролцогчид санал асуулгад хариулж, ихэнх нь "ангид сурсан мэдлэгээ гэрт ашиглаж эхэлсэн" гэж хариулсан.',
    null,
    current_date - 30
  ),
  (
    'Сэтгэлзүйн зөвлөгөөний кабинет нээгдлээ',
    'setgelzui-kabinet-neegdlee',
    'Хүүхдүүдийн ганцаарчилсан болон бүлгийн сэтгэлзүйн зөвлөгөөг тогтмол хүлээн авах боломжтой боллоо.',
    'Манай төслийн хүрээнд шинэ сэтгэлзүйн зөвлөгөөний кабинет албан ёсоор нээгдсэнээр хүүхдүүд тогтмол үнэгүй зөвлөгөө авах боломжтой боллоо.

Кабинет нь долоо хоногийн 5 өдөр, өдөр бүр 09:00-18:00 цагийн хооронд ажиллана. Хүүхэд бүрт нь ганцаарчилсан зөвлөгөө болон бүлгийн уулзалт зохион байгуулагдана.

Хүсэлт гаргахдаа эцэг эх эсвэл сургуулийн нийгмийн ажилтнаар дамжуулж бүртгүүлж болно.',
    null,
    current_date - 60
  ),
  (
    'Сайн дурын ажилтнуудаа баярлуулав',
    'sain-duryn-ajiltnuudaa-bayarluulav',
    'Жилийн турш төслийн үйл ажиллагаанд хувь нэмрээ оруулсан 18 сайн дурын ажилтанд талархал илэрхийлсэн арга хэмжээ зохион байгууллаа.',
    'Жилийн эцсээр манай төслийн үйл ажиллагаанд идэвхтэй оролцсон 18 сайн дурын ажилтанд талархлын арга хэмжээ зохион байгууллаа. Энэхүү уулзалтаар жилийн ажлын тайлан, цаашдын төлөвлөгөөг танилцуулсан.

Сайн дурын ажилтнууд маань голчлон оюутан, залуу мэргэжилтнүүдээс бүрддэг бөгөөд тэд хүүхдийн сургалт, арга хэмжээний зохион байгуулалт, мэдээ материалын бэлтгэлд тусалдаг.

Шинэ жилийн сайн дурын ажилтны бүртгэл удахгүй нээгдэх болно.',
    null,
    current_date - 90
  )
on conflict (slug) do nothing;

-- ── seed: partners (SAMPLE — replace with real logos/links) ──────────────────
insert into public.partners (name, logo_url, website_url, sort_order) values
  ('Боловсролын яам',          null, null, 1),
  ('Хүүхэд хамгааллын төв',     null, null, 2),
  ('Улаанбаатар хот ЗДТГ',     null, null, 3),
  ('Сонгинохайрхан дүүрэг',    null, null, 4),
  ('UNICEF Mongolia',          null, null, 5),
  ('Mercy Corps Mongolia',     null, null, 6)
on conflict do nothing;

-- ── seed: testimonials (SAMPLE) ──────────────────────────────────────────────
insert into public.testimonials (author, role, body, photo_url, sort_order) values
  (
    'Б. Мөнхзул',
    'Эцэг эх',
    'Манай охин сэтгэлзүйн зөвлөгөөнд хамрагдаж эхэлсний дараа сургуульдаа дуртай болж, найз нөхөдтэйгөө илүү сайн харилцаж байна. Энэ хөтөлбөрт гүн талархаж байна.',
    null, 1
  ),
  (
    'Г. Ариунбаяр',
    '"Тэмээ" зүүсэн дэмжигч',
    'Нэг тэмээ авч өгөх нь жижигхэн алхам мэт боловч хүүхдийн ирээдүйд эерэг өөрчлөлт авчирч буйг харахад үнэхээр сэтгэл хангалуун байна.',
    null, 2
  ),
  (
    'С. Уранчимэг',
    'Сайн дурын ажилтан',
    'Энэ төсөлд оролцож эхэлснээс хойш би өөрөө ч их зүйл сурлаа. Хүүхдүүдийн инээмсэглэл бол хамгийн том баяр баясгалан байдгийг мэдэрсэн.',
    null, 3
  )
on conflict do nothing;
