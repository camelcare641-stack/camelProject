import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { makeFakeClient, findCall, type FakeConfig } from "@/test/fake-supabase";

// These characterize the CURRENT webhook behavior so the planned extraction of
// a shared confirmDonationPayment() can be proven behavior-identical. The flip
// logic here is duplicated in features/donate/actions.ts (checkDonationPayment).

vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));
vi.mock("@/lib/qpay/client", () => ({ checkInvoicePayment: vi.fn() }));
vi.mock("@/lib/email/send-thank-you", () => ({ sendThankYouEmail: vi.fn() }));

import { GET } from "./route";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInvoicePayment } from "@/lib/qpay/client";
import { sendThankYouEmail } from "@/lib/email/send-thank-you";

const adminMock = createAdminClient as unknown as Mock;
const checkMock = checkInvoicePayment as unknown as Mock;
const emailMock = sendThankYouEmail as unknown as Mock;

function req(id?: string) {
  const url = id
    ? `http://x/api/qpay/callback?donation_id=${id}`
    : `http://x/api/qpay/callback`;
  return new Request(url);
}

const PAID_ROW = {
  payment_id: "pay_1",
  payment_status: "PAID",
  payment_amount: "25000",
  payment_date: "2026-06-07T00:00:00Z",
};

function setup(config: FakeConfig) {
  const fake = makeFakeClient(config);
  adminMock.mockReturnValue(fake.client);
  return fake;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("qpay callback GET", () => {
  it("always replies HTTP 200 'SUCCESS'", async () => {
    setup({ donations: { read: { data: pendingDonation(), error: null } } });
    checkMock.mockResolvedValue({ rows: [PAID_ROW] });
    const res = await GET(req("d1"));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("SUCCESS");
  });

  it("no-ops without a donation_id (never touches the DB)", async () => {
    await GET(req());
    expect(adminMock).not.toHaveBeenCalled();
  });

  it("no-ops when the donation is not found", async () => {
    const fake = setup({
      donations: { read: { data: null, error: { message: "no rows" } } },
    });
    await GET(req("d1"));
    expect(checkMock).not.toHaveBeenCalled();
    expect(findCall(fake.calls, "donors", "insert")).toBeUndefined();
  });

  it("is an idempotent no-op when already non-pending", async () => {
    const fake = setup({
      donations: { read: { data: { ...pendingDonation(), status: "paid" }, error: null } },
    });
    await GET(req("d1"));
    expect(checkMock).not.toHaveBeenCalled();
    expect(findCall(fake.calls, "donations", "update")).toBeUndefined();
    expect(findCall(fake.calls, "donors", "insert")).toBeUndefined();
    expect(emailMock).not.toHaveBeenCalled();
  });

  it("does not credit when QPay reports no PAID row", async () => {
    const fake = setup({ donations: { read: { data: pendingDonation(), error: null } } });
    checkMock.mockResolvedValue({ rows: [{ ...PAID_ROW, payment_status: "NEW" }] });
    await GET(req("d1"));
    expect(findCall(fake.calls, "donations", "update")).toBeUndefined();
    expect(findCall(fake.calls, "donors", "insert")).toBeUndefined();
    expect(emailMock).not.toHaveBeenCalled();
  });

  it("flips status, mirrors to donors, and emails on a verified payment", async () => {
    const fake = setup({
      donations: { read: { data: pendingDonation(), error: null }, write: { data: { id: "d1" }, error: null } },
      donors: { write: { data: null, error: null } },
    });
    checkMock.mockResolvedValue({ rows: [PAID_ROW] });

    await GET(req("d1"));

    const update = findCall(fake.calls, "donations", "update")!;
    expect(update.payload).toMatchObject({ status: "paid", qpay_payment_id: "pay_1" });
    // The idempotency guard: the flip is conditioned on status still 'pending'.
    expect(update.eq).toContainEqual(["status", "pending"]);

    const donor = findCall(fake.calls, "donors", "insert")!;
    expect(donor.payload).toEqual({ name: "Бат", amount: 25000 });

    expect(emailMock).toHaveBeenCalledOnce();
    expect(emailMock.mock.calls[0][0]).toMatchObject({
      to: "donor@example.mn",
      amount: 25000,
      willShipCharm: true,
    });
  });

  it("mirrors an anonymous donor under the anonymous label", async () => {
    const fake = setup({
      donations: { read: { data: { ...pendingDonation(), anonymous: true }, error: null }, write: { data: { id: "d1" }, error: null } },
      donors: { write: { data: null, error: null } },
    });
    checkMock.mockResolvedValue({ rows: [PAID_ROW] });
    await GET(req("d1"));
    expect(findCall(fake.calls, "donors", "insert")!.payload).toEqual({
      name: "Анонимоор хандивласан",
      amount: 25000,
    });
  });

  it("does not double-credit when another writer already flipped the row", async () => {
    const fake = setup({
      // Conditional update matches 0 rows -> data null -> 'updated' is falsy.
      donations: { read: { data: pendingDonation(), error: null }, write: { data: null, error: null } },
    });
    checkMock.mockResolvedValue({ rows: [PAID_ROW] });
    await GET(req("d1"));
    expect(findCall(fake.calls, "donors", "insert")).toBeUndefined();
    expect(emailMock).not.toHaveBeenCalled();
  });
});

function pendingDonation() {
  return {
    id: "d1",
    status: "pending",
    amount: 25000,
    email: "donor@example.mn",
    name: "Бат",
    qpay_invoice_id: "inv_1",
    anonymous: false,
  };
}
