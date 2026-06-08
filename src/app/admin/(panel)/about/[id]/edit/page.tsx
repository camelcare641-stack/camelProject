import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AboutItemForm } from "@/features/admin/components/about-item-form";
import { getAdminAboutItemById } from "@/features/admin/queries";

export const metadata: Metadata = {
  title: "Зүйл засах",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditAboutItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getAdminAboutItemById(id);
  if (!item) notFound();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <Link
          href="/admin/about"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted no-underline hover:text-clay hover:no-underline"
        >
          ← Танилцуулгын жагсаалт руу буцах
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Зүйл засах
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <AboutItemForm
            mode="edit"
            id={item.id}
            initial={{
              kind: item.kind,
              title: item.title ?? "",
              body: item.body,
              sort_order: item.sort_order,
            }}
          />
        </div>
      </div>
    </section>
  );
}
