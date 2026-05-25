import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  body: string;
  photo_url: string | null;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author, role, body, photo_url")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getTestimonials", error);
    return [];
  }
  return (data ?? []) as Testimonial[];
}
