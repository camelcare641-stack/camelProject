import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import { createInvoice } from "@/lib/qpay/client";
import { donationSchema } from "@/lib/validations";

export const runtime = "nodejs";

/**
 * POST /api/qpay/invoice
 *
 * 1. Validate the donor's form input with zod.
 * 2. Insert a `pending` donation row via the service-role client (RLS denies
 *    public inserts, so this is the only place donations can be created).
 * 3. Ask QPay for an invoice and attach `qpay_invoice_id` to the row.
 * 4. Return { invoiceId } so the client can redirect to /donate/[invoiceId].
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const admin = createAdminClient();

  // 1) Create the pending donation row first so we have a stable id to use
  //    as QPay's `sender_invoice_no`.
  const { data: inserted, error: insertError } = await admin
    .from("donations")
    .insert({
      donor_name: input.donor_name,
      donor_email: input.donor_email || null,
      donor_phone: input.donor_phone || null,
      amount: input.amount,
      message: input.message || null,
      is_anonymous: input.is_anonymous,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[qpay/invoice] insert failed", insertError);
    return NextResponse.json({ error: "db_insert_failed" }, { status: 500 });
  }

  // 2) Create the QPay invoice.
  // TODO: confirm invoice_receiver_code semantics with your merchant docs —
  // it might be a customer id / email / phone, not a random uuid.
  let qpayResp;
  try {
    qpayResp = await createInvoice({
      sender_invoice_no: inserted.id,
      invoice_receiver_code: input.donor_phone || input.donor_email || randomUUID(),
      invoice_description: `Хандив #${inserted.id}`,
      amount: input.amount,
      callback_url: process.env.QPAY_CALLBACK_URL!,
    });
  } catch (e) {
    console.error("[qpay/invoice] createInvoice failed", e);
    // Roll the pending row to failed so it doesn't sit around forever.
    await admin
      .from("donations")
      .update({ status: "failed" })
      .eq("id", inserted.id);
    return NextResponse.json({ error: "qpay_failed" }, { status: 502 });
  }

  // 3) Attach the QPay invoice id to the row.
  const { error: updateError } = await admin
    .from("donations")
    .update({ qpay_invoice_id: qpayResp.invoice_id })
    .eq("id", inserted.id);
  if (updateError) {
    console.error("[qpay/invoice] update failed", updateError);
  }

  return NextResponse.json({
    invoiceId: qpayResp.invoice_id,
    donationId: inserted.id,
    qrText: qpayResp.qr_text,
    qrImage: qpayResp.qr_image,
    shortUrl: qpayResp.qPay_shortUrl,
    urls: qpayResp.urls,
  });
}
