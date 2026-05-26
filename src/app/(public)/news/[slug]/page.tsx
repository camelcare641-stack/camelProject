import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { getAllNewsSlugs, getNewsBySlug } from "@/features/news/queries";
import { formatDate } from "@/lib/utils";
import { cta } from "@/lib/content";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = await getNewsBySlug(slug);
  if (!n) return { title: "Мэдээ" };
  return {
    title: n.title,
    description: n.summary ?? undefined,
    openGraph: n.image_url ? { images: [n.image_url] } : undefined,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = await getNewsBySlug(slug);
  if (!n) notFound();

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal no-underline hover:text-clay hover:no-underline"
        >
          ← Мэдээ рүү буцах
        </Link>

        <header className="mt-10 border-b border-border pb-10">
          <p className="text-xs uppercase tracking-[0.15em] text-charcoal-muted">
            {formatDate(n.published_at)}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-balance text-charcoal sm:text-5xl">
            {n.title}
          </h1>
          {n.summary && (
            <p className="mt-6 font-display text-xl italic leading-relaxed text-charcoal-muted sm:text-2xl">
              {n.summary}
            </p>
          )}
        </header>

        {n.image_url && (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-paper">
            <Image
              src={n.image_url}
              alt={n.title}
              fill
              sizes="(min-width:768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {n.content && (
          <div
            className="news-content mt-10 text-lg leading-[1.75] text-charcoal"
            dangerouslySetInnerHTML={{ __html: n.content }}
          />
        )}

        <div className="mt-16 border-t border-border pt-10 text-center">
          <p className="font-display text-xl italic text-charcoal sm:text-2xl">
            Энэхүү үйл ажиллагааг үргэлжлүүлэхэд таны дэмжлэг хэрэгтэй.
          </p>
          <Button variant="cta" size="lg" className="mt-6" render={<Link href="/donate" />}>
            {cta.donate}
          </Button>
        </div>
      </div>
    </article>
  );
}
