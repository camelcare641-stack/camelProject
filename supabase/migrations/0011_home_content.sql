-- Editable home-page content: headings, body copy and image URLs that were
-- previously hardcoded in the home section components. Stored as `home_*` keys
-- in the existing public.site_settings key-value table (created in 0007), so it
-- reuses the same RLS (public read, authenticated write) and the same
-- empty-means-empty resolution. Admins edit these on the /admin/home page.
--
-- Additive + idempotent: safe to re-run. Seeds the current content.ts defaults
-- verbatim so the public site is unchanged until an admin edits them. Image
-- keys that have no existing static asset seed blank (render the placeholder).
-- Never overwrites existing rows.

insert into public.site_settings (key, value) values
  -- Hero
  ('home_hero_title', E'Нэг тэмээ,\nнэг хүүхдийн ирээдүй.'),
  ('home_hero_subtitle', 'Хотын захын хорооллын болон зорилтот бүлгийн хүүхдүүдийн боловсрол, сэтгэлзүй, хөгжлийг хамтдаа бүтээе.'),
  ('home_hero_image_url', '/camel-charm.png'),
  -- About — problem (paragraphs separated by a newline)
  ('home_problem_eyebrow', 'Тулгамдсан асуудал'),
  ('home_problem_title', 'Хотын захын олон хүүхэд дэмжлэггүй өсөж байна.'),
  ('home_problem_body', E'Сэтгэлзүйн дарамт, гэр бүлийн хүчирхийлэл, боловсролын тэгш бус байдал, өөртөө итгэх итгэл сул, хөгжлийн боломж хомс, цахим болон нийгмийн сөрөг нөлөөлөл — эдгээр нь хотын захын хорооллын болон зорилтот бүлгийн хүүхдүүдийн өдөр тутмын бодит байдал.\nТэдэнд зөвхөн материаллаг тусламж бус, сэтгэлзүйн дэмжлэг, хөгжлийн орчин, хайр халамж, сонсох хүн хамгийн их хэрэгтэй.'),
  ('home_problem_image_url', ''),
  -- About — solution (heading stays the org full name → org_full_name)
  ('home_solution_eyebrow', 'Бидний шийдэл'),
  ('home_solution_body', 'Гар урлалын “Тэмээ” бэлэгдэл нь нэг хүүхдийн сургалт, сэтгэлзүйн зөвлөгөө, хөгжлийн үйл ажиллагаа, хамгаалал, урлаг спортын оролцоонд хүрэх дэмжлэг.'),
  ('home_solution_price', '25,000₮'),
  ('home_solution_price_caption', '= нэг хүүхдийн боломж'),
  ('home_solution_image_url', ''),
  -- Camel section
  ('home_camel_eyebrow', '“Тэмээ” гэж юу вэ?'),
  ('home_camel_title', 'Гар урлалын бэлгэдэл, нэг хүүхдийн ирээдүйг гэрэлтүүлнэ.'),
  ('home_camel_note', '25,000₮ ба түүнээс дээш хандивлавал бид таны тэмээг хүргэж болно.'),
  ('home_camel_image_1_url', '/camel-charm.png'),
  ('home_camel_image_2_url', '/bagCamel-bg.png'),
  -- News strip
  ('home_news_eyebrow', 'Мэдээ'),
  ('home_news_title', 'Сүүлийн үеийн мэдээ'),
  -- Testimonials
  ('home_testimonials_eyebrow', 'Дэмжигчид'),
  ('home_testimonials_title', 'Дэмжигчдийн үг'),
  -- Donate (bank transfer) section
  ('home_donate_eyebrow', 'Өөр сонголт'),
  ('home_donate_title', 'Дансаар шилжүүлэх'),
  ('home_donate_intro', 'QPay биш, банкны аппаар шилжүүлэх боломжтой. Шилжүүлэг хийсний дараа доорх формоор нэрээ бүртгүүлснээр хандивлагчдын жагсаалтад нэгдэнэ.'),
  ('home_qr_image_url', ''),
  ('home_qr_caption', 'QR кодыг өөрийн банкны аппаар уншуулан шилжүүлэг хийнэ үү.')
on conflict (key) do nothing;
