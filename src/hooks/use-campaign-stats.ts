"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CampaignStats } from "@/types/database";

interface UseCampaignStatsOptions {
  initial?: CampaignStats;
}

/**
 * Live campaign totals for the progress bar / hero stats.
 *
 * Reads from the `campaign_stats` view. Realtime updates piggyback on the
 * same broadcast as the donor ticker (`donations` channel, `paid` event):
 * when a donation is marked paid, we refetch the totals view.
 */
export function useCampaignStats(options: UseCampaignStatsOptions = {}) {
  const fallback: CampaignStats = options.initial ?? {
    total_raised: 0,
    donor_count: 0,
    goal_amount: 0,
  };
  const [stats, setStats] = useState<CampaignStats>(fallback);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const refetch = async () => {
      const { data, error } = await supabase
        .from("campaign_stats")
        .select("total_raised, donor_count, goal_amount")
        .single();
      if (!cancelled && !error && data) {
        setStats(data as CampaignStats);
      }
    };

    refetch();

    const channel = supabase
      .channel("donations")
      .on("broadcast", { event: "paid" }, () => {
        refetch();
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return stats;
}
