"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DonateCTA } from "@/components/site/donate-cta";
import { nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline hover:no-underline"
          aria-label={site.fullName}
        >
          <Image
            src="/logo-mark.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="font-display text-xl font-bold tracking-tight text-charcoal">
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} active={pathname === item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <DonateCTA />
        </div>

        {/* Mobile trigger + drawer */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Цэс"
                className="md:hidden"
              >
                <MenuIcon className="size-5" />
              </Button>
            }
          />
          <SheetContent side="right" className="w-full max-w-xs">
            <SheetTitle className="sr-only">Цэс</SheetTitle>
            <nav className="flex flex-col divide-y divide-border pt-12">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-5 py-4 text-base font-semibold text-charcoal no-underline hover:bg-paper hover:no-underline",
                    pathname === item.href && "text-clay",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-5 pt-4">
                <DonateCTA fullWidth />
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] no-underline hover:no-underline transition-colors",
        active ? "text-clay" : "text-charcoal hover:text-clay",
      )}
    >
      {children}
    </Link>
  );
}
