import Link from "next/link";
import { getAdminStats } from "@/features/admin/queries";
import { formatMNT } from "@/lib/utils";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/admin/news", label: "Мэдээ", key: "news" as const },
  { href: "/admin/partners", label: "Хамтрагч", key: "partners" as const },
  { href: "/admin/testimonials", label: "Сэтгэгдэл", key: "testimonials" as const },
  { href: "/admin/donors", label: "Хандивлагч", key: "donors" as const },
  { href: "/admin/messages", label: "Зурвас", key: "messages" as const },
  { href: "/admin/donations", label: "Хандив", key: "donations" as const },
];

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">Удирдлага</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl">
            Хяналтын самбар
          </h1>
        </div>

        {/* Headline numbers */}
        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3">
          <Stat label="Нийт цуглуулсан" value={formatMNT(stats.donorTotal)} accent />
          <Stat label="Хандивлагч" value={String(stats.donors)} />
          <Stat
            label="Хүргэлт хүлээгдэж буй"
            value={String(stats.pendingShipments)}
          />
        </div>

        {/* Section cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-center justify-between border border-border bg-white p-6 no-underline transition-colors hover:border-clay hover:no-underline"
            >
              <span className="font-display text-lg font-semibold text-charcoal group-hover:text-clay">
                {s.label}
              </span>
              <span className="font-display text-2xl font-bold tabular-nums text-charcoal-muted group-hover:text-clay">
                {stats[s.key]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-white px-6 py-7">
      <p className="text-[11px] uppercase tracking-[0.15em] text-charcoal-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-3xl font-bold tabular-nums sm:text-4xl ${
          accent ? "text-clay" : "text-charcoal"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
