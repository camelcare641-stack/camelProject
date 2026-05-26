import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialForm } from "@/features/admin/components/testimonial-form";

export const metadata: Metadata = {
  title: "Шинэ сэтгэгдэл",
  robots: { index: false, follow: false },
};

export default function NewTestimonialPage() {
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
          Шинэ сэтгэгдэл
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <TestimonialForm mode="create" />
        </div>
      </div>
    </section>
  );
}
