import { publicClient } from "@/lib/supabase/public";

export type News = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  published_at: string;
};

const SELECT = "id, slug, title, summary, content, image_url, published_at";

export async function getNews(limit = 8): Promise<News[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("news")
    .select(SELECT)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getNews", error);
    return [];
  }
  return (data ?? []) as News[];
}

export type NewsPage = {
  items: News[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
};

export async function getNewsPage(page = 1, pageSize = 12): Promise<NewsPage> {
  const supabase = publicClient();
  const safePage = Math.max(1, Math.floor(page) || 1);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("news")
    .select(SELECT, { count: "exact" })
    .order("published_at", { ascending: false })
    .range(from, to);
  if (error) {
    console.error("getNewsPage", error);
    return { items: [], total: 0, page: 1, pageCount: 1, pageSize };
  }
  const total = count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // Requested page is past the end (e.g. ?page=999): refetch the last page so
  // the list and pagination controls stay consistent instead of showing empty.
  if (safePage > pageCount && total > 0) {
    return getNewsPage(pageCount, pageSize);
  }

  return {
    items: (data ?? []) as News[],
    total,
    page: safePage,
    pageCount,
    pageSize,
  };
}

export async function getAllNewsSlugs(): Promise<string[]> {
  // Build-time call from generateStaticParams; cookies-less client.
  const supabase = publicClient();
  const { data, error } = await supabase.from("news").select("slug");
  if (error) {
    console.error("getAllNewsSlugs", error);
    return [];
  }
  return (data ?? []).map((r: { slug: string }) => r.slug);
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  // Used by /news/[slug] which is statically generated.
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("news")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("getNewsBySlug", error);
    return null;
  }
  return (data as News | null) ?? null;
}
