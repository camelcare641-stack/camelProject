import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminPrograms } from "@/features/admin/queries";
import { deleteProgram } from "@/features/admin/actions";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const programs = await getAdminPrograms();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Хөтөлбөр</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Үйл ажиллагааны хөтөлбөр
            </h1>
            <p className="mt-2 text-sm text-charcoal-muted">
              Нийт {programs.length}.
            </p>
          </div>
          <Button render={<Link href="/admin/programs/new" />}>
            + Шинэ хөтөлбөр
          </Button>
        </div>

        {programs.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">Одоогоор хөтөлбөр алга.</p>
        ) : (
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {programs.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-start justify-between gap-4 bg-white px-5 py-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold tracking-[0.2em] text-clay">
                    {p.code}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-charcoal">
                    {p.title}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-sm text-charcoal-muted">
                    {p.items.join(" · ")}
                  </p>
                  <p className="mt-1 text-xs text-charcoal-muted">
                    Эрэмбэ {p.sort_order} · {p.items.length} зүйл
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/programs/${p.id}/edit`} />}
                  >
                    Засах
                  </Button>
                  <ConfirmDeleteButton
                    action={deleteProgram.bind(null, p.id)}
                    confirmText={`"${p.title}"-г устгах уу?`}
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
