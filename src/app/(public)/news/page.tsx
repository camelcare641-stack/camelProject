import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { news as t } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { News } from "@/types/database";

export const metadata = { title: t.title };
export const dynamic = "force-dynamic";

export default async function NewsListPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select(
      "id, slug, title, content, cover_image_url, published, published_at, created_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false });

  const posts = (data as News[] | null) ?? [];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 space-y-1 text-center">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">{t.empty}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              {p.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover_image_url}
                  alt={p.title}
                  className="h-40 w-full object-cover"
                />
              ) : null}
              <CardHeader>
                <CardTitle>
                  <Link href={`/news/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {p.published_at ? (
                  <div className="text-xs text-muted-foreground">
                    {formatDate(p.published_at)}
                  </div>
                ) : null}
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {p.content}
                </p>
                <Link
                  href={`/news/${p.slug}`}
                  className="text-sm font-medium underline"
                >
                  {t.readMore}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
