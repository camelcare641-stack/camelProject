"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { DonateCTA } from "@/components/site/donate-cta";
import { CamelCharm } from "@/components/brand/camel-charm";
import { formatMNT } from "@/lib/utils";
import { home, site } from "@/lib/content";

/**
 * §12.5 "хэдэн тэмээ" calculator — a quantity stepper (− / count / +) times the
 * 25,000₮ unit price, with the running total in deep gold. The CTA pre-fills
 * the donate modal with the computed total.
 */
export function DonateCalculator() {
  const [qty, setQty] = useState(1);
  const total = qty * site.unitPrice;

  return (
    <div className="rounded-lg border border-border bg-white p-6 sm:p-8">
      <p className="font-display text-lg font-bold text-charcoal">
        {home.calcTitle}
      </p>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm uppercase tracking-[0.12em] text-charcoal-muted">
          {home.calcLabel}
        </span>
        <div className="inline-flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label={home.calcDecrease}
            className="flex size-11 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-clay hover:text-clay disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MinusIcon className="size-5" />
          </button>

          <span className="inline-flex min-w-12 items-center justify-center gap-2 font-display text-3xl font-bold tabular-nums text-charcoal">
            <CamelCharm className="size-6 text-clay" strokeWidth={2.2} />
            {qty}
          </span>

          <button
            type="button"
            onClick={() => setQty((q) => Math.min(999, q + 1))}
            aria-label={home.calcIncrease}
            className="flex size-11 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:border-clay hover:text-clay"
          >
            <PlusIcon className="size-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-6">
        <span className="text-sm uppercase tracking-[0.12em] text-charcoal-muted">
          {home.calcTotalLabel}
        </span>
        <span className="font-display text-3xl font-bold tabular-nums text-gold-deep sm:text-4xl">
          {formatMNT(total)}
        </span>
      </div>

      <div className="mt-7">
        <DonateCTA size="lg" fullWidth initialAmount={total} />
      </div>
    </div>
  );
}
