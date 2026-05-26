-- FAQ entries shown on /contact. Previously a hardcoded array in the page.
-- Mirrors the partners/testimonials pattern: public read, authenticated write.
-- Additive + idempotent.

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists faqs_sort_idx on public.faqs (sort_order);

alter table public.faqs enable row level security;

drop policy if exists faqs_select_anon on public.faqs;
create policy faqs_select_anon on public.faqs
  for select to anon, authenticated using (true);

drop policy if exists faqs_insert_authenticated on public.faqs;
create policy faqs_insert_authenticated on public.faqs
  for insert to authenticated with check (true);

drop policy if exists faqs_update_authenticated on public.faqs;
create policy faqs_update_authenticated on public.faqs
  for update to authenticated using (true) with check (true);

drop policy if exists faqs_delete_authenticated on public.faqs;
create policy faqs_delete_authenticated on public.faqs
  for delete to authenticated using (true);

-- Seed the 5 current Q&As from contact/page.tsx.
insert into public.faqs (question, answer, sort_order) values
  (
    'Нэг тэмээ хэдэн төгрөг вэ?',
    'Нэг тэмээ 25,000₮. Энэ нь нэг хүүхдийн боловсрол, сэтгэлзүйн зөвлөгөө, халамжийн боломжтой тэнцэх хандив юм.',
    1
  ),
  (
    'Хандив хаашаа очдог вэ?',
    'Бүх хандив "Дадал Тэнцвэр" ТББ-ын дансанд орж, "ТЭМЭЭ" хүүхэд хөгжлийн төслийн сургалт, сэтгэлзүйн зөвлөгөө, халамжийн үйл ажиллагаанд зарцуулагдана.',
    2
  ),
  (
    'Яаж хандив өгөх вэ?',
    '/donate хуудаснаас дансаар шилжүүлэг хийгээд, нэрээ бүртгүүлснээр хандивлагчдын жагсаалтад нэмэгдэнэ. Гүйлгээний утганд нэр + утсаа бичээрэй.',
    3
  ),
  (
    'Сайн дурын ажилтан болж болох уу?',
    'Болно. Холбоо барих маягтаар бидэнтэй холбогдвол сайн дурын хөтөлбөрийн талаар дэлгэрэнгүй мэдээлэл өгөх болно.',
    4
  ),
  (
    'Байгууллагын түншлэлд хэрхэн оролцох вэ?',
    'Корпорацийн нийгмийн хариуцлагын (CSR) хүрээнд хамтран ажиллах, ивээн тэтгэх боломжтой. Сэдвийг ''Хамтын ажиллагаа'' гэж тэмдэглэн зурвас илгээгээрэй.',
    5
  )
on conflict do nothing;
