import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import { fetchRows } from "@/lib/supabase/fetch";

export type Partner = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
};

export function getPartners(): Promise<Partner[]> {
  return fetchRows<Partner>("partners", "id, name, logo_url, website_url", {
    orderBy: "sort_order",
  });
}

export type AboutItem = { id: string; title: string | null; body: string };
export type AboutContent = {
  goals: AboutItem[];
  targets: AboutItem[];
  outcomes: AboutItem[];
  camelPoints: AboutItem[];
};

/**
 * About-page list content grouped by kind. Wrapped in cache() so the /about
 * page and the home camel-section share a single query per request.
 */
export const getAboutItems = cache(async function getAboutItems(): Promise<AboutContent> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("about_items")
    .select("id, kind, title, body, sort_order")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getAboutItems", error);
  }

  const pick = (kind: string): AboutItem[] =>
    (data ?? [])
      .filter((r) => r.kind === kind)
      .map((r) => ({ id: r.id, title: r.title, body: r.body }));

  return {
    goals: pick("goal"),
    targets: pick("target"),
    outcomes: pick("outcome"),
    camelPoints: pick("camel_point"),
  };
});
