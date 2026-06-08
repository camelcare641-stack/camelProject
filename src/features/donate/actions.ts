"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createInvoice, checkInvoicePayment } from "@/lib/qpay/client";
import {
  donorSchema,
  donationSchema,
  type DonorInput,
  type DonationInput,
} from "@/lib/validations";
import type { ActionResult } from "@/lib/types";
import { site } from "@/lib/content";

export async function submitDonor(input: DonorInput): Promise<ActionResult> {
  const parsed = donorSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Алдаа гарлаа.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("donors").insert({
    name: parsed.data.name,
    amount: parsed.data.amount,
  });
  if (error) {
    console.error("submitDonor", error);
    return { ok: false, message: "Бүртгэхэд алдаа гарлаа." };
  }

  revalidatePath("/");
  return {
    ok: true,
    message:
      "Бүртгэгдлээ. Гүйлгээ хийсний дараа нэрс нь хандивлагчдын жагсаалтад харагдана.",
  };
}

type CreateInvoiceResult =
  | {
      ok: true;
      donationId: string;
      qpayInvoiceId: string;
      qrImage: string;
      qrText: string;
      shortUrl: string;
      // Per-bank deep links (khanbank://…, tdbbank://… etc). Tapping one on a
      // phone hands off to that bank app with the payment pre-filled.
      bankApps: { name: string; description: string; logo: string; link: string }[];
    }
  | { ok: false; message: string };

export async function createDonationInvoice(
  input: DonationInput,
): Promise<CreateInvoiceResult> {
  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Алдаа гарлаа.",
    };
  }
  const data = parsed.data;
  const willShipCharm = data.amount >= site.unitPrice;

  const supabase = await createClient();
  const { data: donationRow, error: insertError } = await supabase
    .from("donations")
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      anonymous: data.anonymous,
      amount: data.amount,
      shipping_status: willShipCharm ? "pending_address" : "none",
    })
    .select("id")
    .single();

  if (insertError || !donationRow) {
    console.error("createDonationInvoice insert", insertError);
    return { ok: false, message: "Хандивыг үүсгэхэд алдаа гарлаа." };
  }

  // The anon role can INSERT a pending donation (RLS insert policy) but has no
  // UPDATE policy on `donations` — an anon update is silently denied (0 rows,
  // no error). Persist the invoice id and any failure state through the
  // service-role client, which bypasses RLS. Without this the callback never
  // sees a qpay_invoice_id and every payment stays pending forever.
  const admin = createAdminClient();

  try {
    const invoice = await createInvoice({
      invoiceCode: process.env.QPAY_INVOICE_CODE!,
      senderInvoiceNo: donationRow.id,
      invoiceReceiverCode: data.email,
      description: `${site.name} — хандив`,
      amount: data.amount,
      callbackUrl: `${process.env.QPAY_CALLBACK_URL}?donation_id=${donationRow.id}`,
    });

    const { error: updateError } = await admin
      .from("donations")
      .update({ qpay_invoice_id: invoice.invoice_id })
      .eq("id", donationRow.id);
    if (updateError) {
      console.error("createDonationInvoice qpay_invoice_id update", updateError);
      return { ok: false, message: "Хандивыг үүсгэхэд алдаа гарлаа." };
    }

    return {
      ok: true,
      donationId: donationRow.id,
      qpayInvoiceId: invoice.invoice_id,
      qrImage: invoice.qr_image,
      qrText: invoice.qr_text,
      shortUrl: invoice.qPay_shortUrl,
      bankApps: invoice.urls ?? [],
    };
  } catch (err) {
    console.error("createDonationInvoice qpay", err);
    // Mark the row as failed so it doesn't sit as pending forever.
    // Service-role client: anon has no UPDATE policy on donations.
    await admin
      .from("donations")
      .update({ status: "failed" })
      .eq("id", donationRow.id);
    return {
      ok: false,
      message: "QPay-тай холбогдоход алдаа гарлаа. Дансаар шилжүүлэх боломжтой.",
    };
  }
}

// Manual "check payment" — donor-triggered pull, mirrors the callback's flip
// logic so a missed/delayed webhook doesn't strand the donation in `pending`.
// Idempotent via `.eq("status", "pending")`. No thank-you email here; the
// callback path owns email side-effects to avoid double-sends.
export async function checkDonationPayment(
  donationId: string,
): Promise<
  | { ok: true; status: "paid" | "pending" }
  | { ok: false; message: string }
> {
  const admin = createAdminClient();

  const { data: donation, error: fetchError } = await admin
    .from("donations")
    .select("id, status, amount, name, qpay_invoice_id, anonymous")
    .eq("id", donationId)
    .single();

  if (fetchError || !donation) {
    return { ok: false, message: "Хандив олдсонгүй." };
  }
  if (donation.status === "paid") return { ok: true, status: "paid" };
  if (donation.status !== "pending") {
    return { ok: false, message: "Хандивыг шалгах боломжгүй." };
  }
  if (!donation.qpay_invoice_id) {
    return { ok: false, message: "Нэхэмжлэх алга." };
  }

  let payment;
  try {
    const check = await checkInvoicePayment(donation.qpay_invoice_id);
    payment = check.rows.find((r) => r.payment_status === "PAID");
  } catch (err) {
    console.error("checkDonationPayment", err);
    return { ok: false, message: "QPay-аас баталгаажуулж чадсангүй." };
  }
  if (!payment) return { ok: true, status: "pending" };

  const { data: updated, error: updateError } = await admin
    .from("donations")
    .update({
      status: "paid",
      qpay_payment_id: payment.payment_id,
      paid_at: payment.payment_date ?? new Date().toISOString(),
    })
    .eq("id", donation.id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("checkDonationPayment update", updateError);
    return { ok: false, message: "Бүртгэхэд алдаа гарлаа." };
  }

  if (updated) {
    const displayName = donation.anonymous ? "Анонимоор хандивласан" : donation.name;
    const { error: donorError } = await admin
      .from("donors")
      .insert({ name: displayName, amount: donation.amount });
    if (donorError) {
      console.error("checkDonationPayment donors mirror", donorError);
      // Non-fatal; donation is still marked paid.
    }
  }

  return { ok: true, status: "paid" };
}
