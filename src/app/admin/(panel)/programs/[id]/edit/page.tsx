import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgramForm } from "@/features/admin/components/program-form";
import { getAdminPrograms } from "@/features/admin/queries";

export const metadata: Metadata = {
  title: "Хөтөлбөр засах",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = (await getAdminPrograms()).find((p) => p.id === id);
  if (!program) notFound();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-3xl">
        <Link
          href="/admin/programs"
          className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted no-underline hover:text-clay hover:no-underline"
        >
          ← Хөтөлбөрийн жагсаалт руу буцах
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold text-charcoal sm:text-4xl">
          Хөтөлбөр засах
        </h1>
        <div className="mt-8 border border-border bg-white p-6 sm:p-8">
          <ProgramForm
            mode="edit"
            id={program.id}
            initial={{
              code: program.code,
              title: program.title,
              items: program.items,
              sort_order: program.sort_order,
            }}
          />
        </div>
      </div>
    </section>
  );
}
