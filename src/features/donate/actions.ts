"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createInvoice } from "@/lib/qpay/client";
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

  try {
    const invoice = await createInvoice({
      invoiceCode: process.env.QPAY_INVOICE_CODE!,
      senderInvoiceNo: donationRow.id,
      invoiceReceiverCode: data.email,
      description: `${site.name} — хандив`,
      amount: data.amount,
      callbackUrl: `${process.env.QPAY_CALLBACK_URL}?donation_id=${donationRow.id}`,
    });

    await supabase
      .from("donations")
      .update({ qpay_invoice_id: invoice.invoice_id })
      .eq("id", donationRow.id);

    return {
      ok: true,
      donationId: donationRow.id,
      qpayInvoiceId: invoice.invoice_id,
      qrImage: invoice.qr_image,
      qrText: invoice.qr_text,
      shortUrl: invoice.qPay_shortUrl,
    };
  } catch (err) {
    console.error("createDonationInvoice qpay", err);
    // Mark the row as failed so it doesn't sit as pending forever.
    await supabase
      .from("donations")
      .update({ status: "failed" })
      .eq("id", donationRow.id);
    return {
      ok: false,
      message: "QPay-тай холбогдоход алдаа гарлаа. Дансаар шилжүүлэх боломжтой.",
    };
  }
}
