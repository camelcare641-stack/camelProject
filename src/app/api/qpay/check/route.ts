import { NextResponse, type NextRequest } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { checkPayment } from "@/lib/qpay/client";

export const runtime = "nodejs";

/**
 * GET /api/qpay/check?invoiceId=...
 *
 * Client-driven payment status poll. The donor's invoice page calls this
 * after they scan the QR. The webhook is the source of truth; this route
 * gives the client a way to refresh sooner without waiting for QPay's
 * callback to fire.
 *
 * Returns the current status from the donations table (not directly from
 * QPay) so admins, the webhook, and the client all agree.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const invoiceId = url.searchParams.get("invoiceId");
  if (!invoiceId) {
    return NextResponse.json({ error: "missing_invoice_id" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Pull the current donation status first.
  const { data: row } = await admin
    .from("donations")
    .select("id, status, amount, qpay_payment_id")
    .eq("qpay_invoice_id", invoiceId)
    .maybeSingle();

  if (!row) {
    return NextResponse.json({ error: "unknown_invoice" }, { status: 404 });
  }

  if (row.status === "paid") {
    return NextResponse.json({ status: "paid" });
  }

  // Optimistically re-check with QPay. If paid, perform the same idempotent
  // update as the callback so a slow webhook doesn't keep the UI stuck.
  let check;
  try {
    check = await checkPayment(invoiceId);
  } catch (e) {
    console.error("[qpay/check] checkPayment failed", e);
    return NextResponse.json({ status: row.status });
  }

  const paidRow = check.rows.find((r) => r.payment_status === "PAID");
  if (!paidRow) {
    return NextResponse.json({ status: row.status });
  }

  await admin
    .from("donations")
    .update({
      status: "paid",
      qpay_payment_id: paidRow.payment_id,
      paid_at: paidRow.payment_date ?? new Date().toISOString(),
    })
    .eq("id", row.id)
    .eq("status", "pending");

  return NextResponse.json({ status: "paid" });
}
