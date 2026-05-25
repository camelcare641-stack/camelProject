import Image from "next/image";
import Link from "next/link";
import { contactInfo, nav, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className=" border-t border-border bg-paper text-charcoal">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-full.jpg"
              alt={site.org}
              width={56}
              height={56}
              className="h-12 w-12 object-cover"
            />
            <div>
              <p className="font-display text-lg font-bold text-charcoal">
                {site.name}
              </p>
              <p className="text-sm text-charcoal-muted">{site.org}</p>
            </div>
          </div>
          <p className="mt-5 font-display text-lg italic text-charcoal">
            &ldquo;{site.slogan}&rdquo;
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-muted">
            {site.description}
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-muted">
            Хуудаснууд
          </h2>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-charcoal no-underline hover:text-clay hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/donate"
                className="text-sm font-semibold text-clay no-underline hover:text-clay-dark hover:underline"
              >
                Хандив өгөх
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-muted">
            Холбоо барих
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-charcoal">
            <li>
              <span className="text-charcoal-muted">Утас. </span>
              {contactInfo.phone}
            </li>
            <li>
              <span className="text-charcoal-muted">И-мэйл. </span>
              {contactInfo.email}
            </li>
            <li>
              <span className="text-charcoal-muted">Хаяг. </span>
              {contactInfo.address}
            </li>
          </ul>

          © {new Date().getFullYear()} {site.org}. Бүх эрх хуулиар хамгаалагдсан.

        </div>
      </div>
    </footer>
  );
}
