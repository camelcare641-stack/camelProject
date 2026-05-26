import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { bank, contactInfo, site } from "@/lib/content";

/**
 * Resolved site settings consumed by the public pages. Values come from the
 * `site_settings` table (editable in /admin/settings); a key that has never
 * been seeded falls back to the content.ts default, but a seeded-yet-blank
 * value renders blank (empty-means-empty).
 */
export type SiteSettings = {
  org: string;
  fullName: string;
  slogan: string;
  hook: string;
  description: string;
  bank: { name: string; holder: string; account: string; note: string };
  contactInfo: { phone: string; email: string; address: string };
};

// Wrapped in React cache() so the multiple consumers on a single page render
// (Hero, AboutSummary, DonateSection, Footer, …) share one query per request.
export const getSiteSettings = cache(async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error) {
    console.error("getSiteSettings", error);
  }

  const rows = new Map((data ?? []).map((r) => [r.key, r.value] as const));
  // Present row (even if "") wins; only a genuinely missing row falls back.
  const val = (key: string, fallback: string) =>
    rows.has(key) ? (rows.get(key) ?? "") : fallback;

  return {
    org: val("org_name", site.org),
    fullName: val("org_full_name", site.fullName),
    slogan: val("slogan", site.slogan),
    hook: val("hook", site.hook),
    description: val("description", site.description),
    bank: {
      name: val("bank_name", bank.name),
      holder: val("bank_holder", bank.holder),
      account: val("bank_account", bank.account),
      note: val("bank_note", bank.note),
    },
    contactInfo: {
      phone: val("contact_phone", contactInfo.phone),
      email: val("contact_email", contactInfo.email),
      address: val("contact_address", contactInfo.address),
    },
  };
});

/** Flat key→value map for pre-filling the admin settings form. */
export async function getSiteSettingsRaw(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error) {
    console.error("getSiteSettingsRaw", error);
    return {};
  }
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
}
