import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendThankYouEmail } from "@/lib/email/send-thank-you";
import { site } from "@/lib/content";

type Donation = {
  id: string;
  email: string;
  name: string;
  amount: number;
};

/**
 * Sends the thank-you email exactly once per donation, regardless of which
 * confirmation path flips it to paid first — the QPay webhook or the donor's
 * in-modal "check payment" pull (which can race, and in local dev with no
 * public webhook is the only path).
 *
 * Claims `thank_you_sent_at` with a conditional update (`is null`) so two
 * concurrent callers can't double-send: only the writer that flips it from
 * null proceeds. On send failure the claim is released so a later trigger can
 * retry. Requires the service-role client (anon has no UPDATE on donations).
 */
export async function sendDonationThankYou(
  admin: SupabaseClient,
  donation: Donation,
): Promise<void> {
  const { data: claimed, error: claimError } = await admin
    .from("donations")
    .update({ thank_you_sent_at: new Date().toISOString() })
    .eq("id", donation.id)
    .is("thank_you_sent_at", null)
    .select("id")
    .maybeSingle();

  if (claimError) {
    console.error("sendDonationThankYou claim", claimError);
    return;
  }
  if (!claimed) return; // already sent (or being sent) by the other path

  try {
    await sendThankYouEmail({
      to: donation.email,
      name: donation.name,
      amount: donation.amount,
      willShipCharm: donation.amount >= site.unitPrice,
    });
  } catch (err) {
    console.error("sendDonationThankYou send failed", err);
    // Release the claim so a later webhook/manual check can retry the send.
    await admin
      .from("donations")
      .update({ thank_you_sent_at: null })
      .eq("id", donation.id);
  }
}
