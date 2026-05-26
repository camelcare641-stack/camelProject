import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminFaqs } from "@/features/admin/queries";
import { deleteFaq } from "@/features/admin/actions";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await getAdminFaqs();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Түгээмэл асуулт</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Түгээмэл асуулт
            </h1>
            <p className="mt-2 text-sm text-charcoal-muted">Нийт {faqs.length}.</p>
          </div>
          <Button render={<Link href="/admin/faqs/new" />}>+ Шинэ асуулт</Button>
        </div>

        {faqs.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">Одоогоор асуулт алга.</p>
        ) : (
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {faqs.map((f) => (
              <li
                key={f.id}
                className="flex flex-wrap items-start justify-between gap-4 bg-white px-5 py-5"
              >
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-semibold text-charcoal">
                    {f.question}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-charcoal-muted">
                    {f.answer}
                  </p>
                  <p className="mt-1 text-xs text-charcoal-muted">
                    Эрэмбэ {f.sort_order}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/faqs/${f.id}/edit`} />}
                  >
                    Засах
                  </Button>
                  <ConfirmDeleteButton
                    action={deleteFaq.bind(null, f.id)}
                    confirmText={`"${f.question}"-г устгах уу?`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
