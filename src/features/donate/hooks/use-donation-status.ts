"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Watches a single donation row and fires `onPaid` once its status flips to
 * 'paid'.
 *
 * We poll rather than subscribe over Realtime: migration 0006 revokes the
 * blanket SELECT on `donations` from anon (column grants keep PII hidden),
 * and Realtime's row authorization needs table-level SELECT — so anon never
 * receives postgres_changes for this table. The column grant *does* allow anon
 * to read (id, status), so a lightweight PK-indexed poll is the reliable path.
 */
export function useDonationStatus(
  donationId: string | null,
  onPaid: () => void,
) {
  useEffect(() => {
    if (!donationId) return;
    const supabase = createClient();
    let active = true;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      const { data, error } = await supabase
        .from("donations")
        .select("status")
        .eq("id", donationId)
        .maybeSingle();
      if (!active) return;
      if (!error && data?.status === "paid") {
        onPaid();
        return;
      }
      timer = setTimeout(poll, 3000);
    }

    void poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [donationId, onPaid]);
}
