import type { Metadata } from "next";
import Link from "next/link";
import { FaqForm } from "@/features/admin/components/faq-form";

export const metadata: Metadata = {
  title: "Шинэ асуулт",
  robots: { index: false, follow: false },
};

export default function NewFaqPage() {
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
          Шинэ асуулт
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <FaqForm mode="create" />
        </div>
      </div>
    </section>
  );
}
