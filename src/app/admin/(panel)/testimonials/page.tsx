import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminTestimonials } from "@/features/admin/queries";
import { deleteTestimonial } from "@/features/admin/actions";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const items = await getAdminTestimonials();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Сэтгэгдэл</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Дэмжигчдийн сэтгэгдэл
            </h1>
            <p className="mt-2 text-sm text-charcoal-muted">Нийт {items.length}.</p>
          </div>
          <Button render={<Link href="/admin/testimonials/new" />}>
            + Шинэ сэтгэгдэл
          </Button>
        </div>

        {items.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">Одоогоор сэтгэгдэл алга.</p>
        ) : (
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {items.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-start justify-between gap-4 bg-white px-5 py-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-charcoal-muted">
                    {t.author}
                    {t.role ? ` · ${t.role}` : ""} · эрэмбэ {t.sort_order}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-charcoal">
                    &ldquo;{t.body}&rdquo;
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/testimonials/${t.id}/edit`} />}
                  >
                    Засах
                  </Button>
                  <ConfirmDeleteButton
                    action={deleteTestimonial.bind(null, t.id)}
                    confirmText={`"${t.author}"-н сэтгэгдлийг устгах уу?`}
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
