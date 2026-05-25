import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInvoicePayment } from "@/lib/qpay/client";
import { sendThankYouEmail } from "@/lib/email/send-thank-you";
import { site } from "@/lib/content";

// QPay v2 calls this URL after a payment. We treat the callback as a notice
// only — the source of truth is checkInvoicePayment, which we call before
// flipping the donation to `paid`. Idempotent via `.eq("status", "pending")`.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const donationId = searchParams.get("donation_id");

  if (!donationId) {
    return NextResponse.json({ ok: false, error: "missing donation_id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: donation, error: fetchError } = await supabase
    .from("donations")
    .select("id, status, amount, email, name, qpay_invoice_id, anonymous")
    .eq("id", donationId)
    .single();

  if (fetchError || !donation) {
    console.error("qpay callback: donation not found", donationId, fetchError);
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 });
  }

  if (donation.status !== "pending") {
    // Already processed — idempotent no-op.
    return NextResponse.json({ ok: true, already: true });
  }

  if (!donation.qpay_invoice_id) {
    return NextResponse.json({ ok: false, error: "no invoice id" }, { status: 400 });
  }

  // Verify with QPay before trusting the callback.
  let payment;
  try {
    const check = await checkInvoicePayment(donation.qpay_invoice_id);
    payment = check.rows.find((r) => r.payment_status === "PAID");
    if (!payment) {
      return NextResponse.json({ ok: false, error: "no paid payment" }, { status: 200 });
    }
  } catch (err) {
    console.error("qpay callback: checkInvoicePayment failed", err);
    return NextResponse.json({ ok: false, error: "verify failed" }, { status: 500 });
  }

  const paidAmount = Number(payment.payment_amount);
  if (paidAmount < donation.amount) {
    console.warn(
      `qpay callback: underpaid donation ${donation.id} — expected ${donation.amount}, got ${paidAmount}`,
    );
    // Continue anyway; the operator can reconcile manually.
  }

  // Idempotent update: only one writer can flip status away from 'pending'.
  const { data: updated, error: updateError } = await supabase
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
    console.error("qpay callback: update failed", updateError);
    return NextResponse.json({ ok: false, error: "update failed" }, { status: 500 });
  }

  if (!updated) {
    // Someone else already flipped it. No-op.
    return NextResponse.json({ ok: true, already: true });
  }

  // Mirror into `donors` so the marquee + SupportBar pick it up immediately.
  // We use the display name (or "Анонимоор хандивласан" when anonymous).
  const displayName = donation.anonymous ? "Анонимоор хандивласан" : donation.name;
  const { error: donorError } = await supabase
    .from("donors")
    .insert({ name: displayName, amount: donation.amount });
  if (donorError) {
    console.error("qpay callback: failed to mirror to donors", donorError);
    // Non-fatal.
  }

  // Send thank-you email. Non-fatal if it fails.
  try {
    await sendThankYouEmail({
      to: donation.email,
      name: donation.name,
      amount: donation.amount,
      willShipCharm: donation.amount >= site.unitPrice,
    });
    await supabase
      .from("donations")
      .update({ thank_you_sent_at: new Date().toISOString() })
      .eq("id", donation.id);
  } catch (err) {
    console.error("qpay callback: email send failed", err);
  }

  return NextResponse.json({ ok: true });
}

// QPay may also POST. Treat the same way.
export async function POST(req: Request) {
  return GET(req);
}
