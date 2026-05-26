"use client";

import { useEffect, useState } from "react";
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

/** A nav item is active on its own page and (except for Home) on sub-routes. */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Header sits flush at the top of the page (no border) and grows a hairline
  // border + soft shadow once the user scrolls, so it reads as a finished bar
  // floating over content rather than a flat strip.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-200",
        scrolled
          ? "border-border bg-white/90 shadow-[0_8px_24px_-16px_rgba(31,27,23,0.25)] backdrop-blur-md"
          : "border-transparent bg-white",
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline hover:no-underline"
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

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              active={isActive(pathname, item.href)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Donate stays visible on every breakpoint — it's the primary action
              and must never be buried behind the mobile menu. */}
          <DonateCTA size="sm" className="md:hidden" />
          <div className="hidden md:block">
            <DonateCTA />
          </div>

          {/* Mobile menu trigger + drawer for secondary navigation. */}
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
                      "px-5 py-4 text-base font-semibold no-underline hover:bg-paper hover:no-underline",
                      isActive(pathname, item.href)
                        ? "text-clay"
                        : "text-charcoal",
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
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center py-2 text-[15px] font-medium no-underline transition-colors hover:no-underline",
        active ? "text-clay" : "text-charcoal hover:text-clay",
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-clay transition-transform duration-200",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}
