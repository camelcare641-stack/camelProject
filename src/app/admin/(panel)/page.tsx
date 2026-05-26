import Link from "next/link";
import {
  Newspaper,
  Handshake,
  MessageSquareQuote,
  MessageCircleQuestion,
  ListChecks,
  Target,
  HeartHandshake,
  Inbox,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { getAdminStats } from "@/features/admin/queries";
import { formatMNT } from "@/lib/utils";

export const dynamic = "force-dynamic";

const sections: {
  href: string;
  label: string;
  key: "news" | "partners" | "testimonials" | "faqs" | "programs" | "aboutItems" | "donors" | "messages" | "donations";
  icon: LucideIcon;
}[] = [
  { href: "/admin/news", label: "Мэдээ", key: "news", icon: Newspaper },
  { href: "/admin/partners", label: "Хамтрагч", key: "partners", icon: Handshake },
  { href: "/admin/testimonials", label: "Сэтгэгдэл", key: "testimonials", icon: MessageSquareQuote },
  { href: "/admin/programs", label: "Хөтөлбөр", key: "programs", icon: ListChecks },
  { href: "/admin/about", label: "Танилцуулга", key: "aboutItems", icon: Target },
  { href: "/admin/faqs", label: "Асуулт", key: "faqs", icon: MessageCircleQuestion },
  { href: "/admin/donors", label: "Хандивлагч", key: "donors", icon: HeartHandshake },
  { href: "/admin/messages", label: "Зурвас", key: "messages", icon: Inbox },
  { href: "/admin/donations", label: "Хандив", key: "donations", icon: Wallet },
];

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
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
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group flex items-center justify-between gap-4 rounded-md border border-border bg-white p-5 no-underline transition-colors hover:border-clay hover:no-underline"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-clay-tint text-clay">
                    <Icon className="size-[18px]" strokeWidth={2} />
                  </span>
                  <span className="truncate font-display text-base font-semibold text-charcoal group-hover:text-clay">
                    {s.label}
                  </span>
                </span>
                <span className="font-display text-2xl font-bold tabular-nums text-charcoal-muted group-hover:text-clay">
                  {stats[s.key]}
                </span>
              </Link>
            );
          })}
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
