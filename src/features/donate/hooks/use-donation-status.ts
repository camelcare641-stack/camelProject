"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Subscribes to a single donation row and fires `onPaid` once the row's
 * status flips to 'paid'. Unsubscribes on cleanup.
 */
export function useDonationStatus(
  donationId: string | null,
  onPaid: () => void,
) {
  useEffect(() => {
    if (!donationId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`donation:${donationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "donations",
          filter: `id=eq.${donationId}`,
        },
        (payload) => {
          const next = payload.new as { status?: string };
          if (next.status === "paid") {
            onPaid();
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [donationId, onPaid]);
}
