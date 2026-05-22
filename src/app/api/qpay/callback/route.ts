import { NextResponse, type NextRequest } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { checkPayment } from "@/lib/qpay/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/qpay/callback
 *
 * QPay hits this endpoint when an invoice is paid. The endpoint MUST be
 * idempotent — QPay can retry on network errors. We use qpay_payment_id as
 * the unique idempotency key (DB-level UNIQUE constraint on donations).
 *
 * Security:
 *  - Never trust the request body's `payment_status` / `amount` blindly.
 *    Always call back into QPay's check-payment endpoint with the
 *    `invoice_id` and verify the row in the response.
 *  - Treat this endpoint as PUBLIC; do not perform privileged actions
 *    without re-verifying with QPay first.
 *
 * TODO (you must finish): confirm the exact callback payload shape against
 * your merchant docs. The fields we read below (`object_id`, `payment_id`)
 * are the common QPay v2 shape but may differ for your contract.
 */
export async function POST(req: NextRequest) {
  // QPay v2 may pass identifiers via query OR JSON body; accept both.
  const url = new URL(req.url);
  const qpInvoiceId =
    url.searchParams.get("qpay_invoice_id") ??
    url.searchParams.get("object_id") ??
    null;

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // Some QPay deployments send an empty body — that's fine; we'll trust
    // the query string + re-verify with check-payment below.
  }

  const invoiceId =
    qpInvoiceId ?? (body.object_id as string) ?? (body.qpay_invoice_id as string);

  if (!invoiceId) {
    return NextResponse.json({ error: "missing_invoice_id" }, { status: 400 });
  }

  // 1) Re-verify the payment with QPay server-to-server.
  let check;
  try {
    check = await checkPayment(invoiceId);
  } catch (e) {
    console.error("[qpay/callback] checkPayment failed", e);
    return NextResponse.json({ error: "qpay_check_failed" }, { status: 502 });
  }

  const paidRow = check.rows.find((r) => r.payment_status === "PAID");
  if (!paidRow) {
    // Not paid yet (or refunded/failed). Acknowledge so QPay stops retrying;
    // status will be updated on a later callback or via /api/qpay/check.
    return NextResponse.json({ ok: true, status: "not_paid" });
  }

  const admin = createAdminClient();

  // 2) Idempotent update keyed on qpay_payment_id.
  // First try to upgrade an existing pending row whose payment_id we don't
  // know yet (qpay_payment_id IS NULL). If another callback already updated
  // it, the unique index on qpay_payment_id will block a duplicate.
  const { data: existingRow } = await admin
    .from("donations")
    .select("id, status, qpay_payment_id")
    .eq("qpay_invoice_id", invoiceId)
    .maybeSingle();

  const existing = existingRow as
    | { id: string; status: string; qpay_payment_id: string | null }
    | null;

  if (!existing) {
    console.warn("[qpay/callback] no donation for invoice", invoiceId);
    return NextResponse.json({ ok: true, status: "unknown_invoice" });
  }

  if (existing.qpay_payment_id === paidRow.payment_id) {
    // Already processed — short-circuit (idempotent).
    return NextResponse.json({ ok: true, status: "already_paid" });
  }

  // TODO: optionally also verify paidRow.payment_amount matches the
  // expected amount on `existing` (guard against tampered callbacks).

  const { error: updateError } = await admin
    .from("donations")
    .update({
      status: "paid",
      qpay_payment_id: paidRow.payment_id,
      paid_at: paidRow.payment_date ?? new Date().toISOString(),
    })
    .eq("id", existing.id)
    .eq("status", "pending"); // narrow update to avoid double-credit races

  if (updateError) {
    console.error("[qpay/callback] update failed", updateError);
    return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: "paid" });
}

// QPay sometimes sends GET pings as a healthcheck. Accept them.
export async function GET() {
  return NextResponse.json({ ok: true });
}
