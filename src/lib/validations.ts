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
  amount: z.number().int().min(1000, "Хамгийн багадаа 1,000₮ хандивлана уу.").max(100_000_000),
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
