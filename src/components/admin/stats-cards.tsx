import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { admin } from "@/lib/content";
import { formatMNT } from "@/lib/utils";

interface StatsCardsProps {
  totalRaised: number;
  totalDonations: number;
  donorCount: number;
}

export function StatsCards({
  totalRaised,
  totalDonations,
  donorCount,
}: StatsCardsProps) {
  const average =
    totalDonations > 0 ? Math.round(totalRaised / totalDonations) : 0;

  const cards = [
    { label: admin.totalRaised, value: formatMNT(totalRaised) },
    { label: admin.totalDonations, value: totalDonations.toString() },
    { label: admin.donorCount, value: donorCount.toString() },
    { label: admin.averageDonation, value: formatMNT(average) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {c.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
