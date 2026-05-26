"use client";

import { useRef } from "react";
import type { Testimonial } from "@/features/home/queries";

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);

  if (items.length === 0) return null;

  function scrollByCards(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const firstCard = scroller.querySelector("li");
    // Scroll by one card width (+ gap) when measurable, else fall back to ~80% viewport.
    const step = firstCard
      ? firstCard.getBoundingClientRect().width + 48
      : scroller.clientWidth * 0.8;
    scroller.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Дэмжигчид</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
              Дэмжигчдийн үг
            </h2>
          </div>
          {items.length > 1 && (
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                aria-label="Өмнөх"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-clay hover:text-clay"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                aria-label="Дараах"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-clay hover:text-clay"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                  <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <ul
          ref={scrollerRef}
          className="mt-10 flex snap-x snap-mandatory items-start gap-10 overflow-x-auto pb-4 sm:gap-12 [scrollbar-width:thin]"
        >
          {items.map((t) => (
            <li
              key={t.id}
              className="flex w-[17rem] shrink-0 snap-start flex-col border-t-2 border-charcoal pt-6 sm:w-80"
            >
              <span
                aria-hidden="true"
                className="font-display text-5xl leading-[0.4] text-clay/70"
              >
                &ldquo;
              </span>

              <p className="mt-5 line-clamp-[10] font-display text-lg italic leading-relaxed text-charcoal sm:text-xl">
                {t.body}
              </p>

              <footer className="mt-auto pt-8">
                <cite className="block font-semibold not-italic text-charcoal">
                  — {t.author}
                </cite>
                {t.role && (
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-charcoal-muted">
                    {t.role}
                  </p>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
