import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/features/admin/components/testimonial-form";
import { getAdminTestimonialById } from "@/features/admin/queries";

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
  const item = await getAdminTestimonialById(id);
  if (!item) notFound();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
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
