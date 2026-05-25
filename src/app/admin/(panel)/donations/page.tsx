import { getDonations } from "@/features/admin/queries";
import { DonationStatusControl } from "@/features/admin/components/donation-status-control";
import { formatMNT, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDonationsPage() {
  const donations = await getDonations();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">Хандив</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            QPay хандивын бүртгэл
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            Хувийн мэдээлэл агуулсан — болгоомжтой ажиллана уу. Нийт{" "}
            {donations.length}.
          </p>
        </div>

        {donations.length === 0 ? (
          <p className="mt-10 text-charcoal-muted">Одоогоор хандив алга.</p>
        ) : (
          <div className="mt-8 overflow-x-auto border-y border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-paper text-left">
                  <Th>Огноо</Th>
                  <Th>Хандивлагч</Th>
                  <Th className="text-right">Дүн</Th>
                  <Th>Төлөв / Хүргэлт</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donations.map((d) => (
                  <tr key={d.id} className="bg-white align-top">
                    <Td className="whitespace-nowrap text-charcoal-muted">
                      {formatDate(d.created_at)}
                    </Td>
                    <Td>
                      <span className="font-medium text-charcoal">
                        {d.name}
                        {d.anonymous ? " (нэргүй)" : ""}
                      </span>
                      <span className="block text-xs text-charcoal-muted">
                        {d.email}
                        {d.phone ? ` · ${d.phone}` : ""}
                      </span>
                      {d.message ? (
                        <span className="mt-1 block text-xs italic text-charcoal-muted">
                          &ldquo;{d.message}&rdquo;
                        </span>
                      ) : null}
                    </Td>
                    <Td className="whitespace-nowrap text-right tabular-nums font-medium text-charcoal">
                      {formatMNT(d.amount)}
                    </Td>
                    <Td>
                      <DonationStatusControl
                        id={d.id}
                        status={d.status}
                        shippingStatus={d.shipping_status}
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
  return <td className={`px-4 py-3 ${className ?? ""}`}>{children}</td>;
}
