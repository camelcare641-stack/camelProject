import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getNews } from "@/features/news/queries";
import { formatDate } from "@/lib/utils";
import { cta, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Мэдээ",
  description: `${site.fullName} — хөтөлбөрийн мэдээ, үйл ажиллагааны тайлан.`,
};

export const revalidate = 60;

export default async function NewsIndexPage() {
  const news = await getNews(50);

  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <p className="eyebrow">Сэтгүүл</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-balance text-charcoal sm:text-6xl">
            Мэдээ
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal-muted">
            Төслийн үйл ажиллагаа, үр дүн, тайлангийн мэдээллүүд.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {news.length === 0 ? (
            <p className="text-charcoal-muted">Удахгүй…</p>
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {news.map((n) => (
                <li key={n.id} className="py-10">
                  <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                    <Link
                      href={`/news/${n.slug}`}
                      className="group relative block aspect-[4/3] w-full overflow-hidden bg-paper no-underline hover:no-underline sm:aspect-[4/5]"
                    >
                      {n.image_url ? (
                        <Image
                          src={n.image_url}
                          alt={n.title}
                          fill
                          sizes="(min-width:640px) 160px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-charcoal-muted">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-8 w-8">
                            <rect x="3" y="5" width="18" height="14" rx="1" />
                            <circle cx="9" cy="11" r="2" />
                            <path d="m21 17-5-5-9 9" />
                          </svg>
                        </div>
                      )}
                    </Link>
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-charcoal-muted">
                        {formatDate(n.published_at)}
                      </p>
                      <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-charcoal sm:text-3xl">
                        <Link
                          href={`/news/${n.slug}`}
                          className="text-charcoal no-underline hover:text-clay hover:underline"
                        >
                          {n.title}
                        </Link>
                      </h2>
                      {n.summary && (
                        <p className="mt-3 text-base leading-relaxed text-charcoal-muted">
                          {n.summary}
                        </p>
                      )}
                      <Link
                        href={`/news/${n.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.12em] text-clay no-underline hover:text-clay-dark hover:no-underline"
                      >
                        {cta.details} →
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
