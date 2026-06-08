import { z } from "zod";
import { errors } from "@/lib/content";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("И-мэйл хаяг буруу байна.").max(255),
  password: z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт."),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const newsSchema = z.object({
  title: z.string().trim().min(3, "Гарчиг хэт богино байна.").max(200),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug нь зөвхөн a-z, 0-9, дашгүй (-)."),
  summary: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().max(200000).optional().or(z.literal("")),
  image_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  published_at: z.string().min(10), // ISO date YYYY-MM-DD
});
export type NewsInput = z.infer<typeof newsSchema>;

export const donorSchema = z.object({
  name: z.string().trim().min(2, errors.nameShort).max(100),
  amount: z.number().int().min(0).max(100_000_000),
});
export type DonorInput = z.infer<typeof donorSchema>;

// Modal donation form. Phone is required at the 25,000₮+ threshold (server-side enforced).
export const donationSchema = z.object({
  amount: z.number().int().min(1, "Хамгийн багадаа 1₮ хандивлана уу.").max(100_000_000),
  name: z.string().trim().min(2, errors.nameShort).max(100),
  email: z.string().trim().email("И-мэйл хаяг буруу байна.").max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().max(500).optional().or(z.literal("")),
  anonymous: z.boolean(),
}).refine(
  (v) => v.amount < 25_000 || (v.phone && v.phone.trim().length >= 6),
  { message: "25,000₮+ хандивт утасны дугаар шаардлагатай.", path: ["phone"] },
);
export type DonationInput = z.infer<typeof donationSchema>;

export const messageSchema = z.object({
  name: z.string().trim().min(2, errors.nameShort).max(100),
  contact: z.string().trim().min(3, errors.contactShort).max(200),
  topic: z.string().trim().max(120).optional().or(z.literal("")),
  body: z.string().trim().min(3, errors.bodyShort).max(4000),
});
export type MessageInput = z.infer<typeof messageSchema>;

// ── Admin-managed content ────────────────────────────────────────────────────

export const partnerSchema = z.object({
  name: z.string().trim().min(2, "Нэр хэт богино байна.").max(100),
  logo_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  website_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(10_000),
});
export type PartnerInput = z.infer<typeof partnerSchema>;

export const testimonialSchema = z.object({
  author: z.string().trim().min(2, "Нэр хэт богино байна.").max(100),
  role: z.string().trim().max(100).optional().or(z.literal("")),
  body: z.string().trim().min(2, "Текст хэт богино байна.").max(2000),
  photo_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(10_000),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

// Editable site settings (bank/contact/org strings). Every field is optional —
// the admin may leave any blank, and blank renders blank on the public site.
const settingsField = z.string().trim().max(2000).optional().or(z.literal(""));
export const siteSettingsSchema = z.object({
  org_name: settingsField,
  org_full_name: settingsField,
  slogan: settingsField,
  hook: settingsField,
  description: settingsField,
  bank_name: settingsField,
  bank_holder: settingsField,
  bank_account: settingsField,
  bank_note: settingsField,
  contact_phone: settingsField,
  contact_email: settingsField,
  contact_address: settingsField,
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
/** The known settings keys, derived from the schema (single source of truth). */
export const SITE_SETTINGS_KEYS = Object.keys(
  siteSettingsSchema.shape,
) as (keyof SiteSettingsInput)[];

// Editable home-page content (headings, body, image URLs). Stored in the same
// `site_settings` table under `home_*` keys; every field is optional/blank-allowed,
// matching the empty-means-empty behaviour of the other settings.
export const homeContentSchema = z.object({
  home_hero_title: settingsField,
  home_hero_subtitle: settingsField,
  home_hero_image_url: settingsField,
  home_problem_eyebrow: settingsField,
  home_problem_title: settingsField,
  home_problem_body: settingsField,
  home_problem_image_url: settingsField,
  home_solution_eyebrow: settingsField,
  home_solution_body: settingsField,
  home_solution_price: settingsField,
  home_solution_price_caption: settingsField,
  home_solution_image_url: settingsField,
  home_camel_eyebrow: settingsField,
  home_camel_title: settingsField,
  home_camel_note: settingsField,
  home_camel_image_1_url: settingsField,
  home_camel_image_2_url: settingsField,
  home_news_eyebrow: settingsField,
  home_news_title: settingsField,
  home_testimonials_eyebrow: settingsField,
  home_testimonials_title: settingsField,
  home_donate_eyebrow: settingsField,
  home_donate_title: settingsField,
  home_donate_intro: settingsField,
  home_qr_image_url: settingsField,
  home_qr_caption: settingsField,
});
export type HomeContentInput = z.infer<typeof homeContentSchema>;
/** The known home-content keys, derived from the schema (single source of truth). */
export const HOME_CONTENT_KEYS = Object.keys(
  homeContentSchema.shape,
) as (keyof HomeContentInput)[];

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Асуулт хэт богино байна.").max(300),
  answer: z.string().trim().min(1, "Хариулт оруулна уу.").max(4000),
  sort_order: z.number().int().min(0).max(10_000),
});
export type FaqInput = z.infer<typeof faqSchema>;

// Canonical program shape (items as a list) — used by the server action / DB.
export const programSchema = z.object({
  code: z.string().trim().min(1, "Код оруулна уу.").max(10),
  title: z.string().trim().min(2, "Гарчиг хэт богино байна.").max(200),
  items: z.array(z.string().trim().min(1).max(200)).max(50),
  sort_order: z.number().int().min(0).max(10_000),
});
export type ProgramInput = z.infer<typeof programSchema>;

// Form variant: items edited as one-per-line text; transformed to an array on
// submit before being handed to the action.
export const programFormSchema = z.object({
  code: z.string().trim().min(1, "Код оруулна уу.").max(10),
  title: z.string().trim().min(2, "Гарчиг хэт богино байна.").max(200),
  items: z.string().trim().min(1, "Дор хаяж нэг зүйл оруулна уу."),
  sort_order: z.number().int().min(0).max(10_000),
});
export type ProgramFormInput = z.infer<typeof programFormSchema>;

export const ABOUT_ITEM_KINDS = [
  "goal",
  "target",
  "outcome",
  "camel_point",
] as const;

// About-page list item. `title` is only meaningful (and required) for the
// camel_point kind — the DB CHECK can't express that, so the schema enforces it.
export const aboutItemSchema = z
  .object({
    kind: z.enum(ABOUT_ITEM_KINDS),
    title: z.string().trim().max(200).optional().or(z.literal("")),
    body: z.string().trim().min(1, "Текст оруулна уу.").max(1000),
    sort_order: z.number().int().min(0).max(10_000),
  })
  .refine((v) => v.kind !== "camel_point" || !!v.title?.trim(), {
    message: "“Тэмээ” цэгт гарчиг шаардлагатай.",
    path: ["title"],
  });
export type AboutItemInput = z.infer<typeof aboutItemSchema>;

// Admin manual donor entry (e.g. recording an offline / bank-transfer donor).
export const donorAdminSchema = z.object({
  name: z.string().trim().min(2, errors.nameShort).max(100),
  amount: z.number().int().min(0).max(100_000_000),
});
export type DonorAdminInput = z.infer<typeof donorAdminSchema>;

export const DONATION_STATUSES = [
  "pending",
  "paid",
  "expired",
  "failed",
] as const;
export const SHIPPING_STATUSES = [
  "none",
  "pending_address",
  "addressed",
  "shipped",
  "delivered",
] as const;

export const donationUpdateSchema = z.object({
  status: z.enum(DONATION_STATUSES),
  shipping_status: z.enum(SHIPPING_STATUSES),
});
export type DonationUpdateInput = z.infer<typeof donationUpdateSchema>;
