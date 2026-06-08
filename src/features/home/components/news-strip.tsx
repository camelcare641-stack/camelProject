"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { News } from "@/features/news/queries";
import { formatDate } from "@/lib/utils";
import { cta } from "@/lib/content";

export function NewsSection({
  news,
  eyebrow,
  title,
}: {
  news: News[];
  eyebrow: string;
  title: string;
}) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const firstCard = scroller.querySelector("li");
    // Scroll by one card width (+ gap) when measurable, else fall back to ~80% viewport.
    const step = firstCard
      ? firstCard.getBoundingClientRect().width + 32
      : scroller.clientWidth * 0.8;
    scroller.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {news.length > 0 && (
              <div className="hidden items-center gap-2 lg:flex">
                <button
                  type="button"
                  onClick={() => scrollByCards(-1)}
                  aria-label="Өмнөх мэдээ"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-clay hover:text-clay"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCards(1)}
                  aria-label="Дараах мэдээ"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-clay hover:text-clay"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
            <Link
              href="/news"
              className="text-sm font-semibold uppercase tracking-[0.12em] text-charcoal no-underline hover:text-clay hover:no-underline"
            >
              Бүх мэдээ →
            </Link>
          </div>
        </div>

        {news.length === 0 ? (
          <p className="mt-8 text-charcoal-muted">Удахгүй…</p>
        ) : (
          <ul
            ref={scrollerRef}
            className="mt-8 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 [scrollbar-width:thin]"
          >
            {news.map((n) => (
              <li
                key={n.id}
                className="flex w-72 shrink-0 snap-start flex-col sm:w-80"
              >
                <Link
                  href={`/news/${n.slug}`}
                  className="group no-underline hover:no-underline"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper">
                    {n.image_url ? (
                      <Image
                        src={n.image_url}
                        alt={n.title}
                        fill
                        sizes="320px"
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
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.15em] text-charcoal-muted">
                    {formatDate(n.published_at)}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-charcoal transition-colors group-hover:text-clay">
                    {n.title}
                  </h3>
                </Link>
                {n.summary && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-charcoal-muted">
                    {n.summary}
                  </p>
                )}
                <Link
                  href={`/news/${n.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-clay no-underline hover:text-clay-dark hover:underline"
                >
                  {cta.details} →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
