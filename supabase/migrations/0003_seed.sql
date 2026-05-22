-- 0003_seed.sql — placeholder content so the homepage renders out-of-the-box.
-- Idempotent: only inserts when the campaign table is empty.

insert into public.campaign
  (title, description, story, goals, advantages, goal_amount, bank_account_info)
select
  'Хамтдаа өөрчилье',
  'Бидний нэгдсэн зорилго бол хүүхэд, өрх гэрт тусламж хүргэх явдал юм.',
  'Тус нийгмийн санд нэгдсэн сайн дурын идэвхтнүүд олон жилийн турш Монгол улсын зэлүүд хөдөө орон нутагт болон хотын захын айлуудад хүрч ажиллаж байна. Бидний хийж байгаа ажил жижиг боловч, тогтвортой үр нөлөөтэй гэдгийг туршлагаар нотолсон билээ.',
  array[
    'Тусламж шаардлагатай 500 өрхөд хүрэх',
    'Хүүхдийн боловсролд дэмжлэг үзүүлэх',
    'Эрүүл мэндийн анхан шатны үйлчилгээг сайжруулах'
  ],
  array[
    'Бүх хандивын ил тод тайлан',
    'Тогтвортой урт хугацааны хөтөлбөр',
    'Орон нутгийн идэвхтнүүдтэй хамтын ажиллагаа'
  ],
  50000000,
  jsonb_build_object(
    'bank_name', 'Хаан банк',
    'account_number', '5000000000',
    'account_holder', 'Хандив сан',
    'currency', 'MNT'
  )
where not exists (select 1 from public.campaign);

-- Sample partner row.
insert into public.partners (name, description, sort_order)
select 'Хамтрагч байгууллага', 'Жишээ хамтрагч. Админ хэсгээс засаарай.', 0
where not exists (select 1 from public.partners);

-- Sample news post (published).
insert into public.news (slug, title, content, published, published_at)
select
  'tavtai-morilno-uu',
  'Тавтай морилно уу',
  'Энэ бол жишээ нийтлэл. Админ хэсгээс агуулгыг засаарай.',
  true,
  now()
where not exists (select 1 from public.news where slug = 'tavtai-morilno-uu');
