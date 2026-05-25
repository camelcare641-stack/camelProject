import { createClient } from "@/lib/supabase/server";

export type Donor = {
  id: string;
  name: string;
  amount: number;
  created_at: string;
};

export async function getCampaignStats() {
  const supabase = await createClient();
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

export async function getRecentDonors(limit = 60): Promise<Donor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("donors")
    .select("id, name, amount, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("getRecentDonors", error);
    return [];
  }
  return (data ?? []) as Donor[];
}
