import { fetchRows } from "@/lib/supabase/fetch";

export type Faq = { id: string; question: string; answer: string };

/** Public FAQ list for /contact, ordered for display. */
export async function getFaqs(): Promise<Faq[]> {
  const rows = await fetchRows<Faq & { sort_order: number }>(
    "faqs",
    "id, question, answer, sort_order",
    { orderBy: "sort_order" },
  );
  return rows.map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
}
