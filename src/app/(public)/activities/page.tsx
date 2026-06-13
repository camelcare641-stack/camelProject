import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { cta, site } from "@/lib/content";
import { getNews } from "@/features/news/queries";
import { getPrograms } from "@/features/activities/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Үйл ажиллагаа",
  description: site.description,
};

export const revalidate = 60;

export default async function ActivitiesPage() {
  const [news, programs] = await Promise.all([getNews(12), getPrograms()]);

  return (
    <>
      {/* Pass `image` later (e.g. a static path or settings field) to swap the
          light-brown band for a photo hero. */}
      <PageHero
        eyebrow="Хөтөлбөр"
        title="Үйл ажиллагаа"
        lead="Төслийн хүрээнд хэрэгжүүлж буй дөрвөн үндсэн хөтөлбөр."
        variant="brand"
        image={null}
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid divide-y divide-border border-y border-border lg:grid-cols-2 lg:divide-x lg:[&>li:nth-child(2n)]:border-l">
            {programs.map((p) => (
              <li key={p.id} className="py-10 lg:px-10">
                <p className="font-display text-sm font-bold tracking-[0.2em] text-clay">
                  {p.code}
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold text-charcoal sm:text-3xl">
                  {p.title}
                </h2>
                <ul className="mt-6 space-y-3">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-clay" />
                      <span className="text-base text-charcoal">{it}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="eyebrow">Мэдээ</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-charcoal sm:text-4xl">
                Сүүлийн үеийн үйл ажиллагаа
              </h2>
            </div>
            <Link
              href="/news"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-charcoal no-underline hover:text-clay hover:no-underline"
            >
              Бүх мэдээ →
            </Link>
          </div>

          {news.length === 0 ? (
            <p className="mt-8 text-charcoal-muted">Удахгүй…</p>
          ) : (
            <ul className="mt-8 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
              {news.map((n) => (
                <li
                  key={n.id}
                  className="flex flex-col bg-paper p-6"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-charcoal-muted">
                    {formatDate(n.published_at)}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug">
                    <Link
                      href={`/news/${n.slug}`}
                      className="text-charcoal no-underline hover:text-clay hover:underline"
                    >
                      {n.title}
                    </Link>
                  </h3>
                  {n.summary && (
                    <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
                      {n.summary}
                    </p>
                  )}
                  <Link
                    href={`/news/${n.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-clay no-underline hover:text-clay-dark hover:underline"
                  >
                    {cta.details} →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-white py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="font-display text-xl italic text-charcoal sm:text-2xl">
            Хүүхэд бүрд хүргэхэд таны дэмжлэг хэрэгтэй.
          </p>
          <Button variant="cta" size="lg" className="mt-7" render={<Link href="/donate" />}>
            {cta.donate}
          </Button>
        </div>
      </section>
    </>
  );
}
