import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PartnerForm } from "@/features/admin/components/partner-form";
import { getAdminPartners } from "@/features/admin/queries";

export const metadata: Metadata = {
  title: "Хамтрагч засах",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = (await getAdminPartners()).find((p) => p.id === id);
  if (!partner) notFound();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <Link
          href="/admin/partners"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted no-underline hover:text-clay hover:no-underline"
        >
          ← Хамтрагч жагсаалт руу буцах
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Хамтрагч засах
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <PartnerForm
            mode="edit"
            id={partner.id}
            initial={{
              name: partner.name,
              logo_url: partner.logo_url ?? "",
              website_url: partner.website_url ?? "",
              sort_order: partner.sort_order,
            }}
          />
        </div>
      </div>
    </section>
  );
}
