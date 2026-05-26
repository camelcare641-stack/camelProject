"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Handshake,
  MessageSquareQuote,
  HeartHandshake,
  Inbox,
  Wallet,
  MessageCircleQuestion,
  ListChecks,
  Target,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { href: "/admin", label: "Самбар", icon: LayoutDashboard, exact: true },
  { href: "/admin/news", label: "Мэдээ", icon: Newspaper },
  { href: "/admin/partners", label: "Хамтрагч", icon: Handshake },
  { href: "/admin/testimonials", label: "Сэтгэгдэл", icon: MessageSquareQuote },
  { href: "/admin/programs", label: "Хөтөлбөр", icon: ListChecks },
  { href: "/admin/about", label: "Танилцуулга", icon: Target },
  { href: "/admin/faqs", label: "Асуулт", icon: MessageCircleQuestion },
  { href: "/admin/donors", label: "Хандивлагч", icon: HeartHandshake },
  { href: "/admin/messages", label: "Зурвас", icon: Inbox },
  { href: "/admin/donations", label: "Хандив", icon: Wallet },
  { href: "/admin/settings", label: "Тохиргоо", icon: Settings },
];

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {sections.map((s) => {
        const active = s.exact
          ? pathname === s.href
          : pathname === s.href || pathname.startsWith(`${s.href}/`);
        const Icon = s.icon;
        return (
          <Link
            key={s.href}
            href={s.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold no-underline transition-colors hover:no-underline",
              active
                ? "bg-clay-tint text-clay"
                : "text-charcoal-muted hover:bg-paper hover:text-charcoal",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-clay"
              />
            )}
            <Icon className="size-[18px] shrink-0" strokeWidth={2} />
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
