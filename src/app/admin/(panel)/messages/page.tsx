import { getMessages } from "@/features/admin/queries";
import { deleteMessage } from "@/features/admin/actions";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">Зурвас</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Холбоо барих зурвас
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            Холбоо барих формоор ирсэн зурвас. Нийт {messages.length}.
          </p>
        </div>

        {messages.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">Одоогоор зурвас алга.</p>
        ) : (
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {messages.map((m) => (
              <li key={m.id} className="bg-white px-5 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-charcoal-muted">
                      {formatDate(m.created_at)}
                      {m.topic ? ` · ${m.topic}` : ""}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold text-charcoal">
                      {m.name}
                    </h2>
                    <p className="text-sm text-charcoal-muted">{m.contact}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-charcoal">
                      {m.body}
                    </p>
                  </div>
                  <ConfirmDeleteButton
                    action={deleteMessage.bind(null, m.id)}
                    confirmText={`"${m.name}"-н зурвасыг устгах уу?`}
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
