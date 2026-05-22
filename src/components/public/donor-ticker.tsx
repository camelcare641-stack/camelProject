"use client";

import { useDonationsRealtime } from "@/hooks/use-donations-realtime";
import type { PublicDonation } from "@/types/database";
import { anonymous } from "@/lib/content";
import { formatMNT } from "@/lib/utils";

interface DonorTickerProps {
  initial?: PublicDonation[];
}

export function DonorTicker({ initial = [] }: DonorTickerProps) {
  const donations = useDonationsRealtime({ initial, limit: 30 });

  if (donations.length === 0) {
    return null;
  }

  // Duplicate the list so the marquee loops seamlessly.
  const items = [...donations, ...donations];

  return (
    <div className="relative overflow-hidden border-y bg-muted/40 py-3">
      <div className="animate-ticker flex w-max gap-8 whitespace-nowrap">
        {items.map((d, i) => (
          <span key={`${d.paid_at}-${i}`} className="text-sm">
            <span className="font-semibold">
              {d.donor_name || anonymous}
            </span>{" "}
            <span className="text-muted-foreground">— {formatMNT(d.amount)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
