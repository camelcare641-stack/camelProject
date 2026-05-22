"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PublicDonation } from "@/types/database";

interface UseDonationsRealtimeOptions {
  initial?: PublicDonation[];
  limit?: number;
}

/**
 * Live feed of paid, non-anonymous donations for the donor ticker.
 *
 * The donor feed reads from `public_donations` (a view that strips PII).
 * Realtime updates arrive via the Supabase broadcast channel `donations`,
 * event `paid`. TODO: add a Postgres trigger on `donations` (AFTER UPDATE
 * status -> 'paid') that calls `realtime.send(payload, 'paid', 'donations', false)`
 * with a safe payload (donor_name, amount, message, paid_at). Do NOT use
 * postgres_changes on the raw donations table — its row payload exposes
 * donor_email/donor_phone.
 */
export function useDonationsRealtime(
  options: UseDonationsRealtimeOptions = {},
) {
  const { initial = [], limit = 50 } = options;
  const [donations, setDonations] = useState<PublicDonation[]>(initial);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("public_donations")
        .select("donor_name, amount, message, paid_at")
        .order("paid_at", { ascending: false })
        .limit(limit);

      if (!cancelled && !error && data) {
        setDonations(data as PublicDonation[]);
      }
    })();

    const channel = supabase
      .channel("donations")
      .on(
        "broadcast",
        { event: "paid" },
        ({ payload }: { payload: PublicDonation }) => {
          setDonations((prev) => [payload, ...prev].slice(0, limit));
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return donations;
}
