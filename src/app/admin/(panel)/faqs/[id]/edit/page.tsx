import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqForm } from "@/features/admin/components/faq-form";
import { getAdminFaqById } from "@/features/admin/queries";

export const metadata: Metadata = {
  title: "Асуулт засах",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await getAdminFaqById(id);
  if (!faq) notFound();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <Link
          href="/admin/faqs"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted no-underline hover:text-clay hover:no-underline"
        >
          ← Асуултын жагсаалт руу буцах
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Асуулт засах
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <FaqForm
            mode="edit"
            id={faq.id}
            initial={{
              question: faq.question,
              answer: faq.answer,
              sort_order: faq.sort_order,
            }}
          />
        </div>
      </div>
    </section>
  );
}
