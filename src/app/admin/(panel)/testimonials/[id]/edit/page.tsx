import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/features/admin/components/testimonial-form";
import { getAdminTestimonials } from "@/features/admin/queries";

export const metadata: Metadata = {
  title: "Сэтгэгдэл засах",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = (await getAdminTestimonials()).find((t) => t.id === id);
  if (!item) notFound();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/admin/testimonials"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted no-underline hover:text-clay hover:no-underline"
        >
          ← Сэтгэгдэл жагсаалт руу буцах
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Сэтгэгдэл засах
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <TestimonialForm
            mode="edit"
            id={item.id}
            initial={{
              author: item.author,
              role: item.role ?? "",
              body: item.body,
              photo_url: item.photo_url ?? "",
              sort_order: item.sort_order,
            }}
          />
        </div>
      </div>
    </section>
  );
}
