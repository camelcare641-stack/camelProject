"use client";

import { Progress } from "@/components/ui/progress";
import { useCampaignStats } from "@/hooks/use-campaign-stats";
import type { CampaignStats } from "@/types/database";
import { home } from "@/lib/content";
import { formatMNT } from "@/lib/utils";

interface ProgressBarProps {
  initial: CampaignStats;
}

export function ProgressBar({ initial }: ProgressBarProps) {
  const stats = useCampaignStats({ initial });
  const goal = stats.goal_amount || initial.goal_amount || 0;
  const pct =
    goal > 0
      ? Math.min(100, Math.round((stats.total_raised / goal) * 100))
      : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {home.raised}
          </div>
          <div className="text-2xl font-bold sm:text-3xl">
            {formatMNT(stats.total_raised)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {home.goal}
          </div>
          <div className="text-lg font-semibold">{formatMNT(goal)}</div>
        </div>
      </div>
      <Progress value={pct} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {home.donorCount}: {stats.donor_count}
        </span>
        <span>
          {home.progress}: {pct}%
        </span>
      </div>
    </div>
  );
}
