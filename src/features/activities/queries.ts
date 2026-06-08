import { fetchRows } from "@/lib/supabase/fetch";

export type Program = {
  id: string;
  code: string;
  title: string;
  items: string[];
  sort_order: number;
};

/** Public program list for /activities, ordered for display. */
export function getPrograms(): Promise<Program[]> {
  return fetchRows<Program>("programs", "id, code, title, items, sort_order", {
    orderBy: "sort_order",
  });
}
