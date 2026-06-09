import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { makeFakeClient, findCall } from "@/test/fake-supabase";

// Covers the idempotency contract of sendDonationThankYou: the email fires only
// for the caller that claims `thank_you_sent_at` (flips it from null), so the
// webhook and the manual "check payment" path can't double-send.

vi.mock("@/lib/email/send-thank-you", () => ({ sendThankYouEmail: vi.fn() }));

import { sendDonationThankYou } from "./thank-you";
import { sendThankYouEmail } from "@/lib/email/send-thank-you";

const sendMock = sendThankYouEmail as unknown as Mock;

const DONATION = { id: "d1", email: "donor@example.mn", name: "Бат", amount: 25000 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sendDonationThankYou", () => {
  it("claims thank_you_sent_at and sends when the claim succeeds", async () => {
    const fake = makeFakeClient({
      donations: { write: { data: { id: "d1" }, error: null } },
    });

    await sendDonationThankYou(fake.client as never, DONATION);

    const claim = findCall(fake.calls, "donations", "update")!;
    expect(claim.payload).toHaveProperty("thank_you_sent_at");
    expect(claim.eq).toContainEqual(["id", "d1"]);
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock.mock.calls[0][0]).toMatchObject({
      to: "donor@example.mn",
      amount: 25000,
      willShipCharm: true, // 25000 >= unitPrice
    });
  });

  it("does NOT send when the claim matches no row (already sent)", async () => {
    const fake = makeFakeClient({
      donations: { write: { data: null, error: null } },
    });

    await sendDonationThankYou(fake.client as never, DONATION);

    expect(sendMock).not.toHaveBeenCalled();
  });

  it("releases the claim when the email send fails, so it can retry later", async () => {
    sendMock.mockRejectedValueOnce(new Error("smtp down"));
    const fake = makeFakeClient({
      donations: { write: { data: { id: "d1" }, error: null } },
    });

    await sendDonationThankYou(fake.client as never, DONATION);

    const updates = fake.calls.filter(
      (c) => c.table === "donations" && c.op === "update",
    );
    // First update claims the slot, second releases it back to null.
    expect(updates).toHaveLength(2);
    expect(updates[1].payload).toEqual({ thank_you_sent_at: null });
  });
});
