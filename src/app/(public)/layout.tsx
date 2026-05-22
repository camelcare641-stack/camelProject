import Link from "next/link";
import { nav, site, footer } from "@/lib/content";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold">
            {site.name}
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:underline">
              {nav.home}
            </Link>
            <Link href="/transparency" className="hover:underline">
              {nav.transparency}
            </Link>
            <Link href="/partners" className="hover:underline">
              {nav.partners}
            </Link>
            <Link href="/news" className="hover:underline">
              {nav.news}
            </Link>
            <Link
              href="/donate"
              className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90"
            >
              {nav.donate}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>{footer.copyright}</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">
              {footer.privacy}
            </Link>
            <Link href="#" className="hover:underline">
              {footer.terms}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
