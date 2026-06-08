import { fetchRows } from "@/lib/supabase/fetch";

export type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  body: string;
  photo_url: string | null;
};

export function getTestimonials(): Promise<Testimonial[]> {
  return fetchRows<Testimonial>(
    "testimonials",
    "id, author, role, body, photo_url",
    { orderBy: "sort_order" },
  );
}
