"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/admin", label: "Самбар", exact: true },
  { href: "/admin/news", label: "Мэдээ" },
  { href: "/admin/partners", label: "Хамтрагч" },
  { href: "/admin/testimonials", label: "Сэтгэгдэл" },
  { href: "/admin/donors", label: "Хандивлагч" },
  { href: "/admin/messages", label: "Зурвас" },
  { href: "/admin/donations", label: "Хандив" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <Link
        href="/admin"
        className="font-display font-bold text-charcoal no-underline hover:text-clay"
      >
        Удирдлага
      </Link>
      {sections.map((s) => {
        const active =
          "exact" in s && s.exact
            ? pathname === s.href
            : pathname === s.href || pathname.startsWith(`${s.href}/`);
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={active ? "page" : undefined}
            className={`font-semibold uppercase tracking-[0.12em] text-[12px] no-underline hover:text-clay ${
              active ? "text-clay" : "text-charcoal-muted"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
