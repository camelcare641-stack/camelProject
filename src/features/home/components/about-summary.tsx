import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cta } from "@/lib/content";
import { getSiteSettings } from "@/features/settings/queries";

export async function AboutSummary() {
  const settings = await getSiteSettings();
  const { problem, solution } = settings.home;
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-x-12 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-24">
          {/* Row 1 — Problem: text left, image right */}
          <div>
            <p className="eyebrow">{problem.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
              {problem.title}
            </h2>
            {problem.body
              .split("\n")
              .filter((p) => p.trim())
              .map((p, i) => (
                <p
                  key={i}
                  className="mt-5 text-base leading-relaxed text-charcoal-muted first:mt-5 [&:not(:first-of-type)]:mt-3"
                >
                  {p}
                </p>
              ))}
          </div>
          <ImageSlot label="Асуудлын зураг" src={problem.imageUrl} />

          {/* Row 2 — Solution: text right, image left on desktop */}
          <div className="lg:order-2">
            <p className="eyebrow">{solution.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
              {settings.fullName}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-muted">
              {solution.body}
            </p>
            <dl className="mt-8 flex items-baseline gap-x-6 border-y border-border py-5">
              <dt className="font-display text-4xl font-bold text-charcoal sm:text-5xl">
                {solution.price}
              </dt>
              <dd className="text-sm text-charcoal-muted">
                {solution.priceCaption}
              </dd>
            </dl>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button variant="cta" size="lg" render={<Link href="/donate" />}>
                {cta.donate}
              </Button>
              <Link
                href="/about"
                className="text-[13px] font-semibold uppercase tracking-[0.12em] text-charcoal no-underline hover:text-clay hover:no-underline"
              >
                Дэлгэрэнгүй →
              </Link>
            </div>
          </div>
          <ImageSlot
            label="Шийдлийн зураг"
            src={solution.imageUrl}
            className="lg:order-1"
          />
        </div>
      </div>
    </section>
  );
}

function ImageSlot({
  label,
  src,
  className,
}: {
  label: string;
  src: string;
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={`relative aspect-[4/3] overflow-hidden${
          className ? ` ${className}` : ""
        }`}
      >
        <Image
          src={src}
          alt={label}
          fill
          sizes="(min-width: 1024px) 540px, 100vw"
          className="object-contain"
        />
      </div>
    );
  }
  return (
    <div
      aria-label={`${label} — удахгүй`}
      className={`flex aspect-[4/3] items-center justify-center border border-dashed border-border-strong bg-white px-4 text-center text-[11px] uppercase tracking-[0.1em] text-charcoal-muted${
        className ? ` ${className}` : ""
      }`}
    >
      [{label} — удахгүй]
    </div>
  );
}
