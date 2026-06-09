import { publicClient } from "@/lib/supabase/public";
import { fetchRows } from "@/lib/supabase/fetch";

export type Donor = {
  id: string;
  name: string;
  amount: number;
  created_at: string;
};

export async function getCampaignStats() {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("donors")
    .select("amount, id");
  if (error) {
    console.error("getCampaignStats", error);
    return { total: 0, count: 0 };
  }
  const total = (data ?? []).reduce(
    (sum, row: { amount: number }) => sum + (row.amount || 0),
    0,
  );
  return { total, count: data?.length ?? 0 };
}

export function getRecentDonors(limit = 60): Promise<Donor[]> {
  return fetchRows<Donor>("donors", "id, name, amount, created_at", {
    orderBy: "created_at",
    ascending: false,
    limit,
  });
}
