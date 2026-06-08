import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { bank, contactInfo, homeDefaults, site } from "@/lib/content";
import { HOME_CONTENT_KEYS } from "@/lib/validations";

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
  home: {
    hero: { title: string; subtitle: string; imageUrl: string };
    problem: { eyebrow: string; title: string; body: string; imageUrl: string };
    solution: {
      eyebrow: string;
      body: string;
      price: string;
      priceCaption: string;
      imageUrl: string;
    };
    camel: {
      eyebrow: string;
      title: string;
      note: string;
      imageUrl1: string;
      imageUrl2: string;
    };
    news: { eyebrow: string; title: string };
    testimonials: { eyebrow: string; title: string };
    donate: {
      eyebrow: string;
      title: string;
      intro: string;
      qrImageUrl: string;
      qrCaption: string;
    };
  };
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
    home: {
      hero: {
        title: val("home_hero_title", homeDefaults.home_hero_title),
        subtitle: val("home_hero_subtitle", homeDefaults.home_hero_subtitle),
        imageUrl: val("home_hero_image_url", homeDefaults.home_hero_image_url),
      },
      problem: {
        eyebrow: val("home_problem_eyebrow", homeDefaults.home_problem_eyebrow),
        title: val("home_problem_title", homeDefaults.home_problem_title),
        body: val("home_problem_body", homeDefaults.home_problem_body),
        imageUrl: val(
          "home_problem_image_url",
          homeDefaults.home_problem_image_url,
        ),
      },
      solution: {
        eyebrow: val(
          "home_solution_eyebrow",
          homeDefaults.home_solution_eyebrow,
        ),
        body: val("home_solution_body", homeDefaults.home_solution_body),
        price: val("home_solution_price", homeDefaults.home_solution_price),
        priceCaption: val(
          "home_solution_price_caption",
          homeDefaults.home_solution_price_caption,
        ),
        imageUrl: val(
          "home_solution_image_url",
          homeDefaults.home_solution_image_url,
        ),
      },
      camel: {
        eyebrow: val("home_camel_eyebrow", homeDefaults.home_camel_eyebrow),
        title: val("home_camel_title", homeDefaults.home_camel_title),
        note: val("home_camel_note", homeDefaults.home_camel_note),
        imageUrl1: val(
          "home_camel_image_1_url",
          homeDefaults.home_camel_image_1_url,
        ),
        imageUrl2: val(
          "home_camel_image_2_url",
          homeDefaults.home_camel_image_2_url,
        ),
      },
      news: {
        eyebrow: val("home_news_eyebrow", homeDefaults.home_news_eyebrow),
        title: val("home_news_title", homeDefaults.home_news_title),
      },
      testimonials: {
        eyebrow: val(
          "home_testimonials_eyebrow",
          homeDefaults.home_testimonials_eyebrow,
        ),
        title: val(
          "home_testimonials_title",
          homeDefaults.home_testimonials_title,
        ),
      },
      donate: {
        eyebrow: val("home_donate_eyebrow", homeDefaults.home_donate_eyebrow),
        title: val("home_donate_title", homeDefaults.home_donate_title),
        intro: val("home_donate_intro", homeDefaults.home_donate_intro),
        qrImageUrl: val("home_qr_image_url", homeDefaults.home_qr_image_url),
        qrCaption: val("home_qr_caption", homeDefaults.home_qr_caption),
      },
    },
  };
});

/**
 * Flat home_*→value map for pre-filling the admin "Нүүр хуудас" form. Unlike
 * getSiteSettingsRaw (DB rows only), this resolves each key against the content.ts
 * default so the form shows the current effective copy even before the seed
 * migration has run — while still honouring a seeded-yet-blank override.
 */
export async function getHomeContentFlat(): Promise<Record<string, string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  if (error) {
    console.error("getHomeContentFlat", error);
  }
  const rows = new Map((data ?? []).map((r) => [r.key, r.value] as const));
  const out: Record<string, string> = {};
  for (const key of HOME_CONTENT_KEYS) {
    out[key] = rows.has(key) ? (rows.get(key) ?? "") : homeDefaults[key];
  }
  return out;
}

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
