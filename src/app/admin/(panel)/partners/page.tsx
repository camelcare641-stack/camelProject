import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAdminPartners } from "@/features/admin/queries";
import { deletePartner } from "@/features/admin/actions";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await getAdminPartners();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Хамтрагч</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Хамтрагч байгууллага
            </h1>
            <p className="mt-2 text-sm text-charcoal-muted">
              Нийт {partners.length}.
            </p>
          </div>
          <Button render={<Link href="/admin/partners/new" />}>
            + Шинэ хамтрагч
          </Button>
        </div>

        {partners.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">Одоогоор хамтрагч алга.</p>
        ) : (
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {partners.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-4 bg-white px-5 py-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-border bg-paper">
                    {p.logo_url ? (
                      <Image
                        src={p.logo_url}
                        alt={p.name}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-lg font-semibold text-charcoal">
                      {p.name}
                    </h2>
                    <p className="truncate text-xs text-charcoal-muted">
                      Эрэмбэ {p.sort_order}
                      {p.website_url ? ` · ${p.website_url}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/partners/${p.id}/edit`} />}
                  >
                    Засах
                  </Button>
                  <ConfirmDeleteButton
                    action={deletePartner.bind(null, p.id)}
                    confirmText={`"${p.name}"-г устгах уу?`}
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
