import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cta, howItWorks } from "@/lib/content";

export function HowItWorks() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="eyebrow">Хандив өгөх</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-balance text-charcoal sm:text-4xl">
            Гурван алхам
          </h2>
        </div>

        <ol className="mt-14 grid gap-px divide-y divide-border border border-border bg-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {howItWorks.map((s) => (
            <li
              key={s.step}
              className="flex flex-col gap-3 bg-white p-7 sm:p-8"
            >
              <span className="font-display text-sm font-bold tracking-[0.2em] text-clay">
                {String(s.step).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold text-charcoal">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-charcoal-muted">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Button variant="cta" size="lg" render={<Link href="/donate" />}>
            {cta.donate}
          </Button>
        </div>
      </div>
    </section>
  );
}
