import Image from "next/image";
import { DonateCTA } from "@/components/site/donate-cta";
import { getAboutItems } from "@/features/about/queries";
import { getSiteSettings } from "@/features/settings/queries";

/**
 * §3 of the home funnel — the conversion heart.
 * Studio shot + lifestyle shot (charm on a bag) + claim columns.
 * The claims are the shared "camel point" content edited in /admin/about.
 */
export async function CamelSection() {
  const [{ camelPoints }, settings] = await Promise.all([
    getAboutItems(),
    getSiteSettings(),
  ]);
  const { camel } = settings.home;
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">{camel.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-5xl">
            {camel.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Photos column */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={camel.imageUrl1 || "/camel-charm.png"}
                alt="Бэлгэдлийн тэмээ — гар урлалын арьсан бүтээгдэхүүн"
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={camel.imageUrl2 || "/bagCamel-bg.png"}
                alt="Бэлгэдлийн тэмээ цүнхэнд зүүсэн нь — амьдралын хэрэглээ"
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Claim columns */}
          <div className="grid gap-8 lg:col-span-6">
            {camelPoints.map((p) => (
              <Claim key={p.id} title={p.title ?? ""} body={p.body} />
            ))}

            <p className="text-xs leading-relaxed text-charcoal-muted">
              {camel.note}
            </p>

            <div>
              <DonateCTA size="lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Claim({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-l-2 border-clay pl-5">
      <h3 className="font-display text-lg font-bold text-charcoal">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{body}</p>
    </div>
  );
}
