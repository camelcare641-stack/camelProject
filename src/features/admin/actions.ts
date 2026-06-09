"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/types";
import {
  adminLoginSchema,
  newsSchema,
  partnerSchema,
  testimonialSchema,
  donorAdminSchema,
  donationUpdateSchema,
  siteSettingsSchema,
  homeContentSchema,
  faqSchema,
  programSchema,
  aboutItemSchema,
  type AdminLoginInput,
  type NewsInput,
  type PartnerInput,
  type TestimonialInput,
  type DonorAdminInput,
  type DonationUpdateInput,
  type SiteSettingsInput,
  type HomeContentInput,
  type FaqInput,
  type ProgramInput,
  type AboutItemInput,
} from "@/lib/validations";

/**
 * Authorizes the caller as a logged-in admin. New admin mutations run through
 * the service-role client (bypasses RLS), so this session check is the gate
 * that authorizes the request. Returns the user, or an error result to bail.
 */
async function requireAdmin(): Promise<
  { ok: true } | { ok: false; result: ActionResult }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, result: { ok: false, message: "Эрх хүрэлцэхгүй байна." } };
  }
  return { ok: true };
}

/** Maps a zod parse failure to the first message. */
function firstIssue(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Алдаа гарлаа.";
}

export async function signIn(input: AdminLoginInput): Promise<ActionResult> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Алдаа гарлаа.",
    };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, message: "И-мэйл эсвэл нууц үг буруу." };
  }
  return { ok: true, message: "Нэвтэрлээ." };
}

export async function signOut(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createNews(input: NewsInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = newsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Алдаа гарлаа.",
    };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("news").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    summary: parsed.data.summary || null,
    content: parsed.data.content || null,
    image_url: parsed.data.image_url || null,
    published_at: parsed.data.published_at,
  });
  if (error) {
    console.error("createNews", error);
    if (error.code === "23505") {
      return { ok: false, message: "Slug давхцаж байна. Өөр утга оруулна уу." };
    }
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: "Мэдээ нэмэгдлээ." };
}

export async function updateNews(
  id: string,
  input: NewsInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = newsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Алдаа гарлаа.",
    };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("news")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary || null,
      content: parsed.data.content || null,
      image_url: parsed.data.image_url || null,
      published_at: parsed.data.published_at,
    })
    .eq("id", id);
  if (error) {
    console.error("updateNews", error);
    if (error.code === "23505") {
      return { ok: false, message: "Slug давхцаж байна." };
    }
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/news");
  revalidatePath(`/news/${parsed.data.slug}`);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: "Шинэчлэгдлээ." };
}

export async function deleteNews(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) {
    console.error("deleteNews", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, message: "Устгагдлаа." };
}

// ── Site settings (bank / contact / org strings) ─────────────────────────────

export async function updateSiteSettings(
  input: SiteSettingsInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  // Upsert every known key so blanks are persisted as blanks (empty-means-empty).
  const rows = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value: value ?? "",
    updated_at: new Date().toISOString(),
  }));

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) {
    console.error("updateSiteSettings", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/donate");
  revalidatePath("/admin/settings");
  return { ok: true, message: "Шинэчлэгдлээ." };
}

// ── Home-page content (headings / body / images) ─────────────────────────────

export async function updateHomeContent(
  input: HomeContentInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = homeContentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  // Upsert every known key so blanks are persisted as blanks (empty-means-empty).
  const rows = Object.entries(parsed.data).map(([key, value]) => ({
    key,
    value: value ?? "",
    updated_at: new Date().toISOString(),
  }));

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) {
    console.error("updateHomeContent", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/");
  revalidatePath("/admin/home");
  return { ok: true, message: "Шинэчлэгдлээ." };
}

// ── FAQ ──────────────────────────────────────────────────────────────────────

function revalidateFaqs() {
  revalidatePath("/contact");
  revalidatePath("/admin/faqs");
}

export async function createFaq(input: FaqInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase.from("faqs").insert({
    question: parsed.data.question,
    answer: parsed.data.answer,
    sort_order: parsed.data.sort_order,
  });
  if (error) {
    console.error("createFaq", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidateFaqs();
  return { ok: true, message: "Асуулт нэмэгдлээ." };
}

export async function updateFaq(
  id: string,
  input: FaqInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("faqs")
    .update({
      question: parsed.data.question,
      answer: parsed.data.answer,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", id);
  if (error) {
    console.error("updateFaq", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidateFaqs();
  return { ok: true, message: "Шинэчлэгдлээ." };
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) {
    console.error("deleteFaq", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidateFaqs();
  return { ok: true, message: "Устгагдлаа." };
}

// ── Programs (activities) ────────────────────────────────────────────────────

function revalidatePrograms() {
  revalidatePath("/activities");
  revalidatePath("/admin/programs");
}

export async function createProgram(input: ProgramInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = programSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase.from("programs").insert({
    code: parsed.data.code,
    title: parsed.data.title,
    items: parsed.data.items,
    sort_order: parsed.data.sort_order,
  });
  if (error) {
    console.error("createProgram", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePrograms();
  return { ok: true, message: "Хөтөлбөр нэмэгдлээ." };
}

export async function updateProgram(
  id: string,
  input: ProgramInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = programSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("programs")
    .update({
      code: parsed.data.code,
      title: parsed.data.title,
      items: parsed.data.items,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", id);
  if (error) {
    console.error("updateProgram", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePrograms();
  return { ok: true, message: "Шинэчлэгдлээ." };
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) {
    console.error("deleteProgram", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidatePrograms();
  return { ok: true, message: "Устгагдлаа." };
}

// ── About items (goals / targets / outcomes / camel points) ──────────────────

function revalidateAboutItems() {
  revalidatePath("/about");
  revalidatePath("/"); // home camel-section reads camel points
  revalidatePath("/admin/about");
}

export async function createAboutItem(
  input: AboutItemInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = aboutItemSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase.from("about_items").insert({
    kind: parsed.data.kind,
    title: parsed.data.title || null,
    body: parsed.data.body,
    sort_order: parsed.data.sort_order,
  });
  if (error) {
    console.error("createAboutItem", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidateAboutItems();
  return { ok: true, message: "Нэмэгдлээ." };
}

export async function updateAboutItem(
  id: string,
  input: AboutItemInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = aboutItemSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("about_items")
    .update({
      kind: parsed.data.kind,
      title: parsed.data.title || null,
      body: parsed.data.body,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", id);
  if (error) {
    console.error("updateAboutItem", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidateAboutItems();
  return { ok: true, message: "Шинэчлэгдлээ." };
}

export async function deleteAboutItem(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("about_items").delete().eq("id", id);
  if (error) {
    console.error("deleteAboutItem", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidateAboutItems();
  return { ok: true, message: "Устгагдлаа." };
}

// ── Partners ─────────────────────────────────────────────────────────────────

function revalidatePartners() {
  revalidatePath("/about");
  revalidatePath("/");
  revalidatePath("/admin/partners");
}

export async function createPartner(input: PartnerInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = partnerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase.from("partners").insert({
    name: parsed.data.name,
    logo_url: parsed.data.logo_url || null,
    website_url: parsed.data.website_url || null,
    sort_order: parsed.data.sort_order,
  });
  if (error) {
    console.error("createPartner", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePartners();
  return { ok: true, message: "Хамтрагч нэмэгдлээ." };
}

export async function updatePartner(
  id: string,
  input: PartnerInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = partnerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("partners")
    .update({
      name: parsed.data.name,
      logo_url: parsed.data.logo_url || null,
      website_url: parsed.data.website_url || null,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", id);
  if (error) {
    console.error("updatePartner", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePartners();
  return { ok: true, message: "Шинэчлэгдлээ." };
}

export async function deletePartner(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) {
    console.error("deletePartner", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidatePartners();
  return { ok: true, message: "Устгагдлаа." };
}

// ── Testimonials ─────────────────────────────────────────────────────────────

function revalidateTestimonials() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/testimonials");
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").insert({
    author: parsed.data.author,
    role: parsed.data.role || null,
    body: parsed.data.body,
    photo_url: parsed.data.photo_url || null,
    sort_order: parsed.data.sort_order,
  });
  if (error) {
    console.error("createTestimonial", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidateTestimonials();
  return { ok: true, message: "Сэтгэгдэл нэмэгдлээ." };
}

export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("testimonials")
    .update({
      author: parsed.data.author,
      role: parsed.data.role || null,
      body: parsed.data.body,
      photo_url: parsed.data.photo_url || null,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", id);
  if (error) {
    console.error("updateTestimonial", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidateTestimonials();
  return { ok: true, message: "Шинэчлэгдлээ." };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    console.error("deleteTestimonial", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidateTestimonials();
  return { ok: true, message: "Устгагдлаа." };
}

// ── Donors (manual entry for the public roll + total) ────────────────────────

export async function createDonor(input: DonorAdminInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = donorAdminSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("donors")
    .insert({ name: parsed.data.name, amount: parsed.data.amount });
  if (error) {
    console.error("createDonor", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }
  revalidatePath("/");
  revalidatePath("/admin/donors");
  return { ok: true, message: "Хандивлагч нэмэгдлээ." };
}

export async function deleteDonor(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("donors").delete().eq("id", id);
  if (error) {
    console.error("deleteDonor", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidatePath("/");
  revalidatePath("/admin/donors");
  return { ok: true, message: "Устгагдлаа." };
}

// ── Messages (inbound contact form — read/delete only) ───────────────────────

export async function deleteMessage(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const supabase = createAdminClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) {
    console.error("deleteMessage", error);
    return { ok: false, message: "Устгахад алдаа гарлаа." };
  }
  revalidatePath("/admin/messages");
  return { ok: true, message: "Устгагдлаа." };
}

// ── Donations (manage status + shipping fulfillment) ─────────────────────────

export async function updateDonation(
  id: string,
  input: DonationUpdateInput,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.result;
  const parsed = donationUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error) };

  const supabase = createAdminClient();

  // Read current state so we mirror into the public `donors` roll only on the
  // pending→paid transition (matches the webhook + manual-check paths) instead
  // of duplicating a donor every time the operator edits shipping status.
  const { data: current, error: fetchError } = await supabase
    .from("donations")
    .select("status, name, amount, anonymous, paid_at")
    .eq("id", id)
    .single();
  if (fetchError || !current) {
    console.error("updateDonation fetch", fetchError);
    return { ok: false, message: "Хандив олдсонгүй." };
  }

  const becomingPaid =
    parsed.data.status === "paid" && current.status !== "paid";

  const { error } = await supabase
    .from("donations")
    .update({
      status: parsed.data.status,
      shipping_status: parsed.data.shipping_status,
      ...(becomingPaid && !current.paid_at
        ? { paid_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", id);
  if (error) {
    console.error("updateDonation", error);
    return { ok: false, message: "Хадгалахад алдаа гарлаа." };
  }

  if (becomingPaid) {
    const displayName = current.anonymous
      ? "Анонимоор хандивласан"
      : current.name;
    const { error: donorError } = await supabase
      .from("donors")
      .insert({ name: displayName, amount: current.amount });
    if (donorError) {
      console.error("updateDonation donors mirror", donorError);
      // Non-fatal; the donation status was still updated.
    }
  }

  revalidatePath("/admin/donations");
  if (becomingPaid) revalidatePath("/"); // public roll + raised total
  return { ok: true, message: "Шинэчлэгдлээ." };
}
