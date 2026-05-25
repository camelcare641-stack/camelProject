import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { cta, site } from "@/lib/content";
import { getNews } from "@/features/news/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Үйл ажиллагаа",
  description: site.description,
};

export const revalidate = 60;

const programs = [
  {
    code: "6.1",
    title: "Хүүхэд хөгжлийн сургалт",
    items: [
      "Харилцааны ур чадвар",
      "Багаар ажиллах",
      "Манлайлал",
      "Амьдрах ухаан",
      "Ирээдүйн зорилго тодорхойлох",
    ],
  },
  {
    code: "6.2",
    title: "Сэтгэлзүйн зөвлөгөө",
    items: [
      "Ганцаарчилсан зөвлөгөө",
      "Бүлгийн уулзалт",
      "Сэтгэлзүйн оношилгоо",
      "Арт терапи",
      "Хүүхэд сонсох үйлчилгээ",
    ],
  },
  {
    code: "6.3",
    title: "Урлаг, хөгжлийн хөтөлбөр",
    items: [
      "Гар урлал",
      "Зураг",
      "Дуу хөгжим",
      "Ном уншлага",
      "Театр жүжигчилсэн тоглолт",
    ],
  },
  {
    code: "6.4",
    title: "Эцэг эхийн хөтөлбөр",
    items: [
      "Хүүхэд хүмүүжлийн сургалт",
      "Гэр бүлийн харилцаа",
      "Хүүхдийн сэтгэлзүй ойлгох зөвлөгөө",
    ],
  },
];

export default async function ActivitiesPage() {
  const news = await getNews(12);

  return (
    <>
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20">
          <p className="eyebrow">Хөтөлбөр</p>
          <h1 className="mt-4 font-display text-4xl font-bold text-charcoal sm:text-6xl">
            Үйл ажиллагаа
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-charcoal-muted">
            Төслийн хүрээнд хэрэгжүүлж буй дөрвөн үндсэн хөтөлбөр.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid divide-y divide-border border-y border-border lg:grid-cols-2 lg:divide-x lg:[&>li:nth-child(2n)]:border-l">
            {programs.map((p) => (
              <li key={p.code} className="py-10 lg:px-10">
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
          <Button size="lg" className="mt-7" render={<Link href="/donate" />}>
            {cta.donate}
          </Button>
        </div>
      </section>
    </>
  );
}
