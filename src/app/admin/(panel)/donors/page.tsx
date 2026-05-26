import { getAdminDonors } from "@/features/admin/queries";
import { deleteDonor } from "@/features/admin/actions";
import { DonorForm } from "@/features/admin/components/donor-form";
import { ConfirmDeleteButton } from "@/features/admin/components/confirm-delete-button";
import { formatMNT, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDonorsPage() {
  const donors = await getAdminDonors();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">Хандивлагч</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Хандивлагчдын жагсаалт
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            Нүүр хуудасны нийт дүн ба гүйдэг нэрсийг тэжээдэг. Нийт {donors.length}.
          </p>
        </div>

        {/* Manual add (e.g. offline / bank-transfer donors) */}
        <div className="mt-8 border border-border bg-white p-6">
          <p className="eyebrow">Гараар нэмэх</p>
          <p className="mt-1 mb-4 text-sm text-charcoal-muted">
            Дансаар шилжүүлсэн хандивлагчийг гараар бүртгэнэ.
          </p>
          <DonorForm />
        </div>

        {donors.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">Одоогоор хандивлагч алга.</p>
        ) : (
          <div className="mt-8 overflow-x-auto border-y border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-paper text-left">
                  <Th>Нэр</Th>
                  <Th className="text-right">Дүн</Th>
                  <Th>Огноо</Th>
                  <Th className="text-right">Үйлдэл</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donors.map((d) => (
                  <tr key={d.id} className="bg-white">
                    <Td className="font-medium text-charcoal">{d.name}</Td>
                    <Td className="text-right tabular-nums">{formatMNT(d.amount)}</Td>
                    <Td className="text-charcoal-muted">{formatDate(d.created_at)}</Td>
                    <Td className="text-right">
                      <ConfirmDeleteButton
                        action={deleteDonor.bind(null, d.id)}
                        confirmText={`"${d.name}"-г устгах уу?`}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-muted ${className ?? ""}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className ?? ""}`}>{children}</td>;
}
