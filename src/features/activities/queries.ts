import { createClient } from "@/lib/supabase/server";

export type Program = {
  id: string;
  code: string;
  title: string;
  items: string[];
  sort_order: number;
};

/** Public program list for /activities, ordered for display. */
export async function getPrograms(): Promise<Program[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("id, code, title, items, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getPrograms", error);
    return [];
  }
  return (data ?? []) as Program[];
}
