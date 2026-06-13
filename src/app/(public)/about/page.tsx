import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { cta, site } from "@/lib/content";
import { getPartners, getAboutItems } from "@/features/about/queries";
import { getSiteSettings } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Төслийн тухай",
  description: site.description,
};

export const revalidate = 120;

export default async function AboutPage() {
  const [partners, settings, about] = await Promise.all([
    getPartners(),
    getSiteSettings(),
    getAboutItems(),
  ]);
  const { goals, targets, outcomes, camelPoints } = about;

  return (
    <>
      {/* Intro — pass `image` later (e.g. a static path or settings field) to
          swap the clay band for a photo hero. */}
      <PageHero
        eyebrow="Төслийн танилцуулга"
        title={settings.fullName}
        lead={`${settings.org}-ийн санаачилгаар хэрэгжиж буй хүүхдийн хөгжил, сэтгэлзүй, боловсролыг дэмжих төсөл.`}
        variant="brand"
        image={null}
      >
        <p className="mx-auto mt-6 max-w-2xl font-display text-xl italic text-charcoal-muted sm:text-2xl">
          &ldquo;{settings.slogan}&rdquo;
        </p>
      </PageHero>

      {/* Үндэслэл */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="eyebrow">01 — Үндэслэл</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Тулгамдсан асуудал
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-muted">
              <p>
                Өнөөгийн нийгэмд хотын захын хороолол болон зорилтот бүлгийн
                олон хүүхэд сэтгэлзүйн дарамт, гэр бүлийн хүчирхийлэл,
                боловсролын тэгш бус байдал, өөртөө итгэх итгэл сул, хөгжлийн
                боломж хомс, цахим болон нийгмийн сөрөг нөлөөлөл зэрэг олон
                асуудалтай нүүр тулгарч байна.
              </p>
              <p>
                Эдгээр хүүхдүүдэд зөвхөн материаллаг тусламж бус,{" "}
                <span className="text-charcoal">сэтгэлзүйн дэмжлэг, хөгжлийн
                орчин, хайр халамж, сонсох хүн</span> хамгийн их хэрэгтэй
                байдаг.
              </p>
              <p>
                &ldquo;Дадал Тэнцвэр&rdquo; ТББ нь хүүхэд бүрийг үнэ цэнтэй
                иргэн болон төлөвших боломжийг дэмжих зорилгоор Монгол ахуй,
                энэрэл, хамтын оролцоонд суурилсан{" "}
                <span className="text-charcoal">&ldquo;ТЭМЭЭ&rdquo; хүүхэд
                хөгжлийн төслийг</span> санаачлан хэрэгжүүлж байна.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution — Тэмээ */}
      <section className="border-y border-border bg-paper py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-3">
              <p className="eyebrow">02 — Шийдэл</p>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
                &ldquo;Тэмээ&rdquo; гэж юу вэ?
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-charcoal-muted">
                <p>
                  Иргэн, байгууллага, сайн дурын дэмжигчид{" "}
                  <span className="text-charcoal">25,000 төгрөгөөр бэлгэдлийн
                  &ldquo;Тэмээ&rdquo;</span> худалдан авч төсөлд оролцоно. Энэхүү
                  худалдан авалт нь нэг хүүхдийн{" "}
                  <span className="text-charcoal">сургалт, сэтгэлзүйн зөвлөгөө,
                  хөгжлийн үйл ажиллагаа, хамгааллын үйлчилгээ, урлаг спортын
                  оролцоонд</span> бодит дэмжлэг болж хүрнэ.
                </p>
                <p>
                  &ldquo;Тэмээ&rdquo; нь тэсвэр, амьдралын хүч, холын замыг
                  давах чадвар, халамж, тогтвортой байдлын бэлгэдэл юм.
                  Тиймээс төсөл нь хүүхдийн ирээдүйг{" "}
                  <em>&ldquo;хамтдаа тээх&rdquo;</em> утга агуулгатай.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-16">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden">
              <Image
                src="/camel-charm.png"
                alt="Тэмээн бэлэгдэл"
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-contain"
                priority
              />
            </div>

            <ol className="divide-y divide-border border-y border-border">
              {camelPoints.map((p, i) => (
                <li
                  key={p.id}
                  className="grid grid-cols-[auto_1fr] gap-x-6 py-6"
                >
                  <span className="font-display text-sm font-bold tracking-[0.2em] text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-charcoal">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14 border-y border-border py-6">
            <div className="flex flex-wrap items-baseline gap-x-5">
              <span className="font-display text-4xl font-bold text-charcoal sm:text-5xl">
                25,000₮
              </span>
              <span className="text-base text-charcoal-muted">
                = Нэг хүүхдийн боломж
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Зорилго + 5 зорилт */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="eyebrow">03 — Зорилго</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Зорилго
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-muted">
              Эмзэг бүлгийн хүүхдүүдэд боловсролын, хөгжлийн, сэтгэлзүйн цогц
              дэмжлэг үзүүлж тэдний ирээдүйд эерэг өөрчлөлт авчрах.
            </p>

            <h3 className="mt-12 font-display text-xl font-bold text-charcoal">
              5 Зорилт
            </h3>
            <ol className="mt-5 divide-y divide-border border-y border-border">
              {goals.map((g, i) => (
                <li
                  key={g.id}
                  className="grid grid-cols-[auto_1fr] gap-x-6 py-5"
                >
                  <span className="font-display text-sm font-bold tracking-[0.2em] text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-base text-charcoal">{g.body}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Зорилтот бүлэг */}
      <section className="border-t border-border bg-paper py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="eyebrow">04 — Хамрах хүрээ</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Зорилтот бүлэг
            </h2>
            <ul className="mt-8 grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:[&>li:nth-child(2n)]:border-l">
              {targets.map((t) => (
                <li
                  key={t.id}
                  className="py-4 text-base text-charcoal sm:px-6"
                >
                  {t.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Хүлээгдэж буй үр дүн */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="eyebrow">05 — Үр дүн</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Хүлээгдэж буй үр дүн
            </h2>
            <ul className="mt-8 grid divide-y divide-border border-y border-border md:grid-cols-2 md:divide-x md:[&>li:nth-child(2n)]:border-l">
              {outcomes.map((o) => (
                <li
                  key={o.id}
                  className="flex items-baseline gap-3 py-5 md:px-6"
                >
                  <span className="font-display text-sm font-bold tracking-[0.2em] text-clay">
                    ✓
                  </span>
                  <span className="text-base text-charcoal">{o.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Тогтвортой байдал */}
      <section className="border-t border-border bg-paper py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-3">
            <p className="eyebrow">06 — Тогтвортой байдал</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Санхүүжилтийн загвар
            </h2>
            <p className="mt-5 text-base leading-relaxed text-charcoal-muted">
              Төслийн санхүүжилт нь тогтвортой байх үүднээс{" "}
              <span className="text-charcoal">Тэмээ бүтээгдэхүүний
              борлуулалт</span>, <span className="text-charcoal">иргэдийн
              хандив</span>, <span className="text-charcoal">байгууллагын
              түншлэл</span>, <span className="text-charcoal">корпорацийн
              нийгмийн хариуцлага (CSR)</span> болон{" "}
              <span className="text-charcoal">сайн дурын ажилтны
              хөтөлбөр</span> зэргээс бүрдэнэ.
            </p>
          </div>
        </div>
      </section>

      {/* Partners */}
      {partners.length > 0 && (
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-3">
              <p className="eyebrow">07 — Түншлэл</p>
            </div>
            <div className="lg:col-span-9">
              <h2 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
                Хамтран ажиллах байгууллагууд
              </h2>
              <ul className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {partners.map((p) => {
                  const inner = p.logo_url ? (
                    <div className="relative h-12 w-full opacity-70 transition-opacity hover:opacity-100">
                      <Image
                        src={p.logo_url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 45vw, 200px"
                        className="object-contain object-left"
                      />
                    </div>
                  ) : (
                    <span className="block text-sm font-medium text-charcoal-muted transition-colors hover:text-charcoal">
                      {p.name}
                    </span>
                  );
                  return (
                    <li key={p.id} className="flex h-12 items-center">
                      {p.website_url ? (
                        <a
                          href={p.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full no-underline hover:no-underline"
                          aria-label={p.name}
                        >
                          {inner}
                        </a>
                      ) : (
                        inner
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Уриалга */}
      <section className="border-t border-border bg-charcoal py-20 text-white sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
            Уриалга
          </p>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-balance text-white sm:text-5xl">
            &ldquo;Нэг тэмээ = Нэг хүүхдийн ирээдүй.&rdquo;
          </h2>
          <p className="mt-6 text-base text-white/70 sm:text-lg">
            Таны худалдан авсан бэлгэдлийн тэмээ хүүхдийн амьдралд итгэл ·
            боломж · халамж · гэрэл авчирна.
          </p>
          <Button variant="cta" size="lg" className="mt-10" render={<Link href="/donate" />}>
            {cta.donate}
          </Button>
        </div>
      </section>
    </>
  );
}
