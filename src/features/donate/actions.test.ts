import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { makeFakeClient, findCall, type FakeConfig } from "@/test/fake-supabase";

// Characterizes checkDonationPayment — the donor-triggered "check my payment"
// path. It mirrors the webhook's flip-then-mirror logic but deliberately sends
// NO email (the callback owns email to avoid double-sends). Locks that contract
// before the shared confirmDonationPayment() extraction.

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));
vi.mock("@/lib/qpay/client", () => ({
  createInvoice: vi.fn(),
  checkInvoicePayment: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { checkDonationPayment } from "./actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkInvoicePayment } from "@/lib/qpay/client";

const adminMock = createAdminClient as unknown as Mock;
const checkMock = checkInvoicePayment as unknown as Mock;

const PAID_ROW = {
  payment_id: "pay_9",
  payment_status: "PAID",
  payment_amount: "25000",
  payment_date: "2026-06-07T00:00:00Z",
};

function setup(config: FakeConfig) {
  const fake = makeFakeClient(config);
  adminMock.mockReturnValue(fake.client);
  return fake;
}

function pending() {
  return {
    id: "d1",
    status: "pending",
    amount: 25000,
    name: "Бат",
    qpay_invoice_id: "inv_1",
    anonymous: false,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("checkDonationPayment", () => {
  it("returns an error when the donation does not exist", async () => {
    setup({ donations: { read: { data: null, error: { message: "no rows" } } } });
    expect(await checkDonationPayment("d1")).toEqual({
      ok: false,
      message: "Хандив олдсонгүй.",
    });
  });

  it("short-circuits to paid without re-checking QPay when already paid", async () => {
    const fake = setup({
      donations: { read: { data: { ...pending(), status: "paid" }, error: null } },
    });
    const result = await checkDonationPayment("d1");
    expect(result).toEqual({ ok: true, status: "paid" });
    expect(checkMock).not.toHaveBeenCalled();
    expect(findCall(fake.calls, "donors", "insert")).toBeUndefined();
  });

  it("rejects a donation in a non-pending, non-paid state", async () => {
    setup({ donations: { read: { data: { ...pending(), status: "expired" }, error: null } } });
    expect(await checkDonationPayment("d1")).toEqual({
      ok: false,
      message: "Хандивыг шалгах боломжгүй.",
    });
  });

  it("stays pending when QPay has no PAID row, without writing", async () => {
    const fake = setup({ donations: { read: { data: pending(), error: null } } });
    checkMock.mockResolvedValue({ rows: [{ ...PAID_ROW, payment_status: "NEW" }] });
    expect(await checkDonationPayment("d1")).toEqual({ ok: true, status: "pending" });
    expect(findCall(fake.calls, "donations", "update")).toBeUndefined();
  });

  it("flips status and mirrors to donors — but sends NO email", async () => {
    const fake = setup({
      donations: { read: { data: pending(), error: null }, write: { data: { id: "d1" }, error: null } },
      donors: { write: { data: null, error: null } },
    });
    checkMock.mockResolvedValue({ rows: [PAID_ROW] });

    const result = await checkDonationPayment("d1");
    expect(result).toEqual({ ok: true, status: "paid" });

    const update = findCall(fake.calls, "donations", "update")!;
    expect(update.payload).toMatchObject({ status: "paid", qpay_payment_id: "pay_9" });
    expect(update.eq).toContainEqual(["status", "pending"]);

    expect(findCall(fake.calls, "donors", "insert")!.payload).toEqual({
      name: "Бат",
      amount: 25000,
    });
    // This module never imports the email sender — the contract under test.
  });

  it("does not mirror a donor when the row was already flipped", async () => {
    const fake = setup({
      donations: { read: { data: pending(), error: null }, write: { data: null, error: null } },
    });
    checkMock.mockResolvedValue({ rows: [PAID_ROW] });
    const result = await checkDonationPayment("d1");
    expect(result).toEqual({ ok: true, status: "paid" });
    expect(findCall(fake.calls, "donors", "insert")).toBeUndefined();
  });
});
