import type { Testimonial } from "@/features/home/queries";

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl border-b border-border pb-6">
          <p className="eyebrow">Дэмжигчид</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
            Дэмжигчдийн үг
          </h2>
        </div>

        <ul className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((t, i) => (
            <li
              key={t.id}
              className={`flex flex-col py-10 ${
                i === 0 ? "md:pr-10" : i === items.length - 1 ? "md:pl-10" : "md:px-10"
              }`}
            >
              <p className="font-display text-lg italic leading-relaxed text-charcoal sm:text-xl">
                &ldquo;{t.body}&rdquo;
              </p>
              <div className="mt-auto pt-6">
                <p className="font-semibold text-charcoal">— {t.author}</p>
                {t.role && (
                  <p className="text-sm text-charcoal-muted">{t.role}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
