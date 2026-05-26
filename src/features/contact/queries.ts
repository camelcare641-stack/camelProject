import { createClient } from "@/lib/supabase/server";

export type Faq = { id: string; question: string; answer: string };

/** Public FAQ list for /contact, ordered for display. */
export async function getFaqs(): Promise<Faq[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getFaqs", error);
    return [];
  }
  return (data ?? []).map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }));
}
