import { createClient } from "@/lib/supabase/server";

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
};

export async function getPartners(): Promise<Partner[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, logo_url, website_url")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getPartners", error);
    return [];
  }
  return (data ?? []) as Partner[];
}
