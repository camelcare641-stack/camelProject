import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
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
