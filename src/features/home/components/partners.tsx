import Image from "next/image";
import type { Partner } from "@/features/about/queries";

export function PartnersSection({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;
  return (
    <section className="border-t border-border bg-paper py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-muted">
          Хамтран ажиллагч байгууллагууд
        </p>
        <ul className="mt-8 grid grid-cols-2 items-center justify-items-center gap-x-10 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {partners.map((p) => {
            const inner = p.logo_url ? (
              <div className="relative h-10 w-28 opacity-70 transition-opacity hover:opacity-100">
                <Image
                  src={p.logo_url}
                  alt={p.name}
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="block text-center text-sm font-medium text-charcoal-muted transition-colors hover:text-charcoal">
                {p.name}
              </span>
            );
            return (
              <li key={p.id} className="">
                {p.website_url ? (
                  <a
                    href={p.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:no-underline"
                    aria-label={p.name}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
