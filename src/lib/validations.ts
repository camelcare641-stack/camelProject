import { z } from "zod";
import { errors } from "@/lib/content";

const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 100_000_000;

export const donationSchema = z
  .object({
    donor_name: z
      .string()
      .trim()
      .min(2, errors.required)
      .max(100),
    donor_email: z
      .string()
      .trim()
      .email(errors.invalidEmail)
      .max(255)
      .optional()
      .or(z.literal("")),
    donor_phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{6,20}$/, errors.invalidPhone)
      .optional()
      .or(z.literal("")),
    amount: z
      .number({ error: errors.invalidAmount })
      .int()
      .min(MIN_AMOUNT, errors.minAmount)
      .max(MAX_AMOUNT),
    message: z.string().trim().max(500).optional().or(z.literal("")),
    is_anonymous: z.boolean(),
    consent: z.literal(true, { error: errors.consent }),
  })
  .refine((d) => Boolean(d.donor_email || d.donor_phone), {
    message: errors.contactRequired,
    path: ["donor_email"],
  });

export type DonationInput = z.infer<typeof donationSchema>;

export const partnerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  logo_url: z.string().url().optional().or(z.literal("")),
  website_url: z.string().url().optional().or(z.literal("")),
  description: z.string().max(500).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).default(0),
});
export type PartnerInput = z.infer<typeof partnerSchema>;

export const newsSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "slug: a-z, 0-9, -")
    .min(1)
    .max(120),
  title: z.string().trim().min(1).max(200),
  content: z.string().min(1),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});
export type NewsInput = z.infer<typeof newsSchema>;

export const campaignSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().min(1),
  story: z.string().min(1),
  goals: z.array(z.string().min(1)).default([]),
  advantages: z.array(z.string().min(1)).default([]),
  goal_amount: z.number().int().positive(),
  bank_account_info: z
    .object({
      bank_name: z.string().min(1),
      account_number: z.string().min(1),
      account_holder: z.string().min(1),
      currency: z.string().optional(),
    })
    .nullable(),
});
export type CampaignInput = z.infer<typeof campaignSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
