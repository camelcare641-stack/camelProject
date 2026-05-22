import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { news as t } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { News } from "@/types/database";

interface NewsPostProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function NewsPostPage({ params }: NewsPostProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select(
      "id, slug, title, content, cover_image_url, published, published_at, created_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  const post = data as News | null;
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <Link
        href="/news"
        className="text-sm text-muted-foreground hover:underline"
      >
        ← {t.backToList}
      </Link>
      {post.cover_image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="w-full rounded-lg object-cover"
        />
      ) : null}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        {post.published_at ? (
          <div className="text-xs text-muted-foreground">
            {formatDate(post.published_at)}
          </div>
        ) : null}
      </header>
      <div className="prose prose-neutral max-w-none whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
