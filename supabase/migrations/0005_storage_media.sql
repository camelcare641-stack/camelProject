-- Public Storage bucket for admin-managed content images
-- (news image_url, and later partners.logo_url / testimonials.photo_url).
--
-- Read: public. Write: authenticated (admin) only, scoped to this bucket.
-- Constraints (size + mime) are enforced at the bucket level so a leaked
-- session can't turn the bucket into a dumping ground.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ── Storage RLS (on storage.objects) ─────────────────────────────────────────
-- Every policy is scoped to bucket_id = 'media' so it never leaks to other
-- buckets added later.

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media');

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'media');
