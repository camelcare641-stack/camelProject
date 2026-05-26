import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAdminAboutItems, type AdminAboutItem } from "@/features/admin/queries";
import { deleteAboutItem } from "@/features/admin/actions";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";

export const dynamic = "force-dynamic";

const GROUPS: { kind: AdminAboutItem["kind"]; label: string }[] = [
  { kind: "goal", label: "Зорилт" },
  { kind: "target", label: "Зорилтот бүлэг" },
  { kind: "outcome", label: "Хүлээгдэж буй үр дүн" },
  { kind: "camel_point", label: "“Тэмээ” цэг" },
];

export default async function AdminAboutPage() {
  const items = await getAdminAboutItems();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Төслийн тухай</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Танилцуулгын агуулга
            </h1>
            <p className="mt-2 text-sm text-charcoal-muted">Нийт {items.length}.</p>
          </div>
          <Button render={<Link href="/admin/about/new" />}>+ Шинэ зүйл</Button>
        </div>

        <div className="mt-8 grid gap-10">
          {GROUPS.map((g) => {
            const rows = items.filter((i) => i.kind === g.kind);
            return (
              <div key={g.kind}>
                <h2 className="font-display text-lg font-semibold text-charcoal">
                  {g.label}{" "}
                  <span className="text-sm font-normal text-charcoal-muted">
                    ({rows.length})
                  </span>
                </h2>
                {rows.length === 0 ? (
                  <p className="mt-3 text-sm text-charcoal-muted">Хоосон.</p>
                ) : (
                  <ul className="mt-3 divide-y divide-border border-y border-border">
                    {rows.map((i) => (
                      <li
                        key={i.id}
                        className="flex flex-wrap items-start justify-between gap-4 bg-white px-5 py-4"
                      >
                        <div className="min-w-0 flex-1">
                          {i.title && (
                            <p className="font-display text-base font-semibold text-charcoal">
                              {i.title}
                            </p>
                          )}
                          <p className="text-sm text-charcoal-muted">{i.body}</p>
                          <p className="mt-1 text-xs text-charcoal-muted">
                            Эрэмбэ {i.sort_order}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            render={<Link href={`/admin/about/${i.id}/edit`} />}
                          >
                            Засах
                          </Button>
                          <ConfirmDeleteButton
                            action={deleteAboutItem.bind(null, i.id)}
                            confirmText="Энэ зүйлийг устгах уу?"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
