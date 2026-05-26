import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsForm } from "@/features/admin/components/news-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Мэдээ засах",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, summary, content, image_url, published_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <Link
          href="/admin/news"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted no-underline hover:text-clay hover:no-underline"
        >
          ← Мэдээ жагсаалт руу буцах
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Мэдээ засах
        </h1>
        <p className="mt-1 text-sm text-charcoal-muted">/news/{data.slug}</p>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <NewsForm
            mode="edit"
            id={data.id}
            initial={{
              title: data.title,
              slug: data.slug,
              summary: data.summary ?? "",
              content: data.content ?? "",
              image_url: data.image_url ?? "",
              published_at: data.published_at,
            }}
          />
        </div>
      </div>
    </section>
  );
}
