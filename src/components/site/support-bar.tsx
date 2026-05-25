import { DonorMarquee } from "@/features/home/components/donor-marquee";
import { getCampaignStats, getRecentDonors } from "@/features/donate/queries";
import { formatMNT } from "@/lib/utils";

/**
 * Site-wide bottom-fixed support bar.
 *
 * Always visible on public routes: total raised + donor count + a horizontal
 * ticker of recent donor names. Mounted from `(public)/layout.tsx` so the
 * admin area is excluded.
 */
export async function SupportBar() {
  const [stats, donors] = await Promise.all([
    getCampaignStats(),
    getRecentDonors(60),
  ]);

  return (
    <aside
      role="complementary"
      aria-label="Хандивын дүн"
      className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]"
    >
      {/* Top row: stats + CTA stay within the centered content container. */}
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 pt-2 sm:gap-6 sm:px-6 sm:pt-3">
        <dl className="flex shrink-0 items-baseline gap-4 rounded-xl border border-border bg-paper/95 px-4 py-2 shadow-sm backdrop-blur sm:gap-6 sm:px-5 sm:py-2.5">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal-muted">
              Цуглуулсан
            </dt>
            <dd className="font-display text-lg font-bold leading-none text-charcoal tabular-nums sm:text-2xl">
              {formatMNT(stats.total)}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal-muted">
              Дэмжигчид
            </dt>
            <dd className="font-display text-lg font-bold leading-none text-charcoal tabular-nums sm:text-2xl">
              {stats.count.toLocaleString("mn-MN")}
            </dd>
          </div>
        </dl>
      </div>

      {/* Bottom row: donor names flow across the full viewport width. */}
      <div className="mt-2 pb-2 sm:mt-2.5 sm:pb-3">
        <DonorMarquee donors={donors} />
      </div>
    </aside>
  );
}
