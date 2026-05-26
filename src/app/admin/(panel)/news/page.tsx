import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getNews } from "@/features/news/queries";
import { formatDate } from "@/lib/utils";
import { DeleteNewsButton } from "@/features/admin/components/delete-news-button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const news = await getNews(100);

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Мэдээ</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Мэдээ удирдах
            </h1>
            <p className="mt-2 text-sm text-charcoal-muted">
              Нийт {news.length} мэдээ.
            </p>
          </div>
          <Button render={<Link href="/admin/news/new" />}>+ Шинэ мэдээ</Button>
        </div>

        {news.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">
            Одоогоор мэдээ алга. &ldquo;Шинэ мэдээ&rdquo; даран нэмнэ үү.
          </p>
        ) : (
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {news.map((n) => (
              <li
                key={n.id}
                className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-charcoal-muted">
                    {formatDate(n.published_at)} · /{n.slug}
                  </p>
                  <h2 className="mt-1 truncate font-display text-lg font-semibold text-charcoal">
                    {n.title}
                  </h2>
                  {n.summary && (
                    <p className="mt-1 line-clamp-2 text-sm text-charcoal-muted">
                      {n.summary}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/news/${n.slug}`} />}
                  >
                    Үзэх
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/news/${n.id}/edit`} />}
                  >
                    Засах
                  </Button>
                  <DeleteNewsButton id={n.id} title={n.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
