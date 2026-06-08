"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
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
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

type NavGroup = {
  // Section heading; omitted for the top-level dashboard link.
  heading?: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    items: [
      { href: "/admin", label: "Самбар", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    heading: "Агуулга",
    items: [
      { href: "/admin/home", label: "Нүүр хуудас", icon: Home },
      { href: "/admin/about", label: "Танилцуулга", icon: Target },
      { href: "/admin/programs", label: "Хөтөлбөр", icon: ListChecks },
      { href: "/admin/news", label: "Мэдээ", icon: Newspaper },
      {
        href: "/admin/testimonials",
        label: "Сэтгэгдэл",
        icon: MessageSquareQuote,
      },
      { href: "/admin/partners", label: "Хамтрагч", icon: Handshake },
      { href: "/admin/faqs", label: "Асуулт", icon: MessageCircleQuestion },
    ],
  },
  {
    heading: "Хандив, харилцаа",
    items: [
      { href: "/admin/donations", label: "Хандив", icon: Wallet },
      { href: "/admin/donors", label: "Хандивлагч", icon: HeartHandshake },
      { href: "/admin/messages", label: "Зурвас", icon: Inbox },
    ],
  },
  {
    heading: "Систем",
    items: [{ href: "/admin/settings", label: "Тохиргоо", icon: Settings }],
  },
];

function isActive(pathname: string, item: NavItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  // Open only the group that holds the current page; the rest stay collapsed
  // so the sidebar reads as a short list. State persists across navigations
  // because the admin layout stays mounted.
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const group of groups) {
      if (!group.heading) continue;
      initial[group.heading] = group.items.some((item) =>
        isActive(pathname, item),
      );
    }
    return initial;
  });

  return (
    <nav className="flex flex-col gap-1.5">
      {groups.map((group, i) => {
        const NavLinks = group.items.map((s) => {
          const active = isActive(pathname, s);
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
        });

        // Ungrouped (dashboard): render the link directly.
        if (!group.heading) {
          return (
            <div key={i} className="flex flex-col gap-1">
              {NavLinks}
            </div>
          );
        }

        const heading = group.heading;
        const isOpen = open[heading];
        const hasActive = group.items.some((item) => isActive(pathname, item));
        const panelId = `nav-group-${i}`;

        return (
          <div key={heading} className="flex flex-col">
            <button
              type="button"
              onClick={() =>
                setOpen((prev) => ({ ...prev, [heading]: !prev[heading] }))
              }
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-paper",
                hasActive ? "text-clay" : "text-charcoal-muted",
              )}
            >
              {heading}
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
                  isOpen && "rotate-180",
                )}
                strokeWidth={2.5}
              />
            </button>
            <div
              id={panelId}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-1 pt-1">{NavLinks}</div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
