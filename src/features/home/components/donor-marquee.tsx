import type { Donor } from "@/features/donate/queries";
import { formatMNT, formatDate } from "@/lib/utils";

export function DonorMarquee({ donors }: { donors: Donor[] }) {
  if (donors.length === 0) return null;
  // Duplicate list so the animation loops seamlessly at translateX(-50%).
  const items = [...donors, ...donors];
  return (
    <div className="relative">
      {/* Screen-reader friendly list — static, not animated. */}
      <ul className="sr-only" aria-label="Сүүлийн хандивлагчид">
        {donors.map((d) => (
          <li key={d.id} translate="no">
            {d.name} — {formatMNT(d.amount)}, {formatDate(d.created_at)}
          </li>
        ))}
      </ul>

      {/* Visual marquee — hidden from assistive tech to avoid loop announcements. */}
      <div className="relative overflow-hidden" aria-hidden="true">
        <div className="flex w-max items-center gap-x-3 py-1 animate-marquee">
          {items.map((d, i) => (
            <span
              key={`${d.id}-${i}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-clay-tint px-3 py-1 text-sm whitespace-nowrap"
              translate="no"
            >
              <span className="font-semibold text-charcoal">{d.name}</span>
              <span aria-hidden className="text-border-strong">
                ·
              </span>
              <span className="font-semibold text-clay tabular-nums">
                {formatMNT(d.amount)}
              </span>
              <span aria-hidden className="text-border-strong">
                ·
              </span>
              <span className="text-xs text-charcoal-muted tabular-nums">
                {formatDate(d.created_at)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
