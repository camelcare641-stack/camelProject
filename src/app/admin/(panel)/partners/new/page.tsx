import type { Metadata } from "next";
import Link from "next/link";
import { PartnerForm } from "@/features/admin/components/partner-form";

export const metadata: Metadata = {
  title: "Шинэ хамтрагч",
  robots: { index: false, follow: false },
};

export default function NewPartnerPage() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link
          href="/admin/partners"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted no-underline hover:text-clay hover:no-underline"
        >
          ← Хамтрагч жагсаалт руу буцах
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Шинэ хамтрагч
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <PartnerForm mode="create" />
        </div>
      </div>
    </section>
  );
}
