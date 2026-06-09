import { createAdminClient } from "@/lib/supabase/admin";
import { checkInvoicePayment } from "@/lib/qpay/client";
import { sendDonationThankYou } from "@/features/donate/thank-you";

// QPay v2 requires the callback response to be exactly HTTP 200 with body
// "SUCCESS" — any other shape is treated as a failed delivery and retried.
// The actual paid/not-paid truth comes from checkInvoicePayment below, so we
// always ACK to QPay and log internal errors instead of surfacing them.
const ok = () => new Response("SUCCESS", { status: 200 });

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const donationId = searchParams.get("donation_id");

  if (!donationId) {
    console.error("qpay callback: missing donation_id");
    return ok();
  }

  const supabase = createAdminClient();

  const { data: donation, error: fetchError } = await supabase
    .from("donations")
    .select("id, status, amount, email, name, qpay_invoice_id, anonymous")
    .eq("id", donationId)
    .single();

  if (fetchError || !donation) {
    console.error("qpay callback: donation not found", donationId, fetchError);
    return ok();
  }

  if (donation.status !== "pending") {
    // Already processed — idempotent no-op.
    return ok();
  }

  if (!donation.qpay_invoice_id) {
    console.error("qpay callback: no invoice id", donationId);
    return ok();
  }

  // Verify with QPay before trusting the callback.
  let payment;
  try {
    const check = await checkInvoicePayment(donation.qpay_invoice_id);
    payment = check.rows.find((r) => r.payment_status === "PAID");
    if (!payment) {
      return ok();
    }
  } catch (err) {
    console.error("qpay callback: checkInvoicePayment failed", err);
    return ok();
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
    return ok();
  }

  if (!updated) {
    // Someone else already flipped it. No-op.
    return ok();
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

  // Send thank-you email (idempotent across the webhook + manual-check paths).
  await sendDonationThankYou(supabase, {
    id: donation.id,
    email: donation.email,
    name: donation.name,
    amount: donation.amount,
  });

  return ok();
}

// QPay may also POST. Treat the same way.
export async function POST(req: Request) {
  return GET(req);
}
