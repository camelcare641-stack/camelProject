import Image from "next/image";
import { DonateCTA } from "@/components/site/donate-cta";
import { getCampaignStats } from "@/features/donate/queries";
import { getSiteSettings } from "@/features/settings/queries";
import { formatMNT } from "@/lib/utils";

export async function Hero() {
  const [stats, settings] = await Promise.all([
    getCampaignStats(),
    getSiteSettings(),
  ]);
  const { hero } = settings.home;
  const titleLines = hero.title.split("\n");

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-12 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:pt-24 lg:pb-20">
        {/* Story */}
        <div className="lg:col-span-7">
          <p className="eyebrow">{settings.org}</p>
          <h1 className="mt-5 font-display text-[2.5rem] font-bold leading-[1.05] tracking-tight text-balance text-charcoal sm:text-[3.25rem] lg:text-[4.25rem]">
            {titleLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-muted">
            {hero.subtitle}
          </p>

          <dl className="mt-8 inline-flex items-baseline gap-4 border-l-2 border-clay pl-5">
            <dt className="sr-only">Цуглуулсан</dt>
            <dd className="font-display text-4xl font-bold leading-none text-charcoal tabular-nums sm:text-5xl">
              {formatMNT(stats.total)}
            </dd>
            <span className="text-xs uppercase tracking-[0.15em] text-charcoal-muted">
              цуглуулсан
            </span>
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <DonateCTA size="lg" />
            <a
              href="#camel"
              className="inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-charcoal no-underline hover:text-clay hover:no-underline"
            >
              Тэмээний тухай →
            </a>
          </div>
        </div>

        {/* Product photo */}
        <div className="lg:col-span-5">
          <div className="relative aspect-4/5 w-full overflow-hidden">
            <Image
              src={hero.imageUrl || "/camel-charm.png"}
              alt="Бэлгэдлийн тэмээ"
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
