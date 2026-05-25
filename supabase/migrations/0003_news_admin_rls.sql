-- Grant authenticated users write access to news (admin role).
-- Anonymous users keep read-only access via the existing select policy.

drop policy if exists news_insert_authenticated on public.news;
create policy news_insert_authenticated on public.news
  for insert to authenticated with check (true);

drop policy if exists news_update_authenticated on public.news;
create policy news_update_authenticated on public.news
  for update to authenticated using (true) with check (true);

drop policy if exists news_delete_authenticated on public.news;
create policy news_delete_authenticated on public.news
  for delete to authenticated using (true);
