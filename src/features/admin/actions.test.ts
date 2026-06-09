import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { makeFakeClient, findCall, type FakeConfig } from "@/test/fake-supabase";

// Characterizes the admin CRUD actions before the makeCrudActions() factory
// extraction: the requireAdmin gate, validation, success/error messages, and
// revalidation. News now follows the same requireAdmin + service-role pattern
// as the rest (authz normalization #6).

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn(), notFound: vi.fn() }));

import { createFaq, deleteFaq, createNews } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const serverMock = createClient as unknown as Mock;
const adminMock = createAdminClient as unknown as Mock;
const revalidateMock = revalidatePath as unknown as Mock;

/** requireAdmin() calls the server client's auth.getUser(). */
function authAs(user: unknown) {
  serverMock.mockResolvedValue(makeFakeClient({}, { user }).client);
}

function adminDb(config: FakeConfig) {
  const fake = makeFakeClient(config);
  adminMock.mockReturnValue(fake.client);
  return fake;
}

const VALID_FAQ = { question: "Яаж хандивлах вэ?", answer: "QPay-ээр.", sort_order: 0 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createFaq", () => {
  it("rejects an unauthenticated caller without touching the admin DB", async () => {
    authAs(null);
    const result = await createFaq(VALID_FAQ);
    expect(result).toEqual({ ok: false, message: "Эрх хүрэлцэхгүй байна." });
    expect(adminMock).not.toHaveBeenCalled();
  });

  it("rejects invalid input with the first validation message", async () => {
    authAs({ id: "admin" });
    const fake = adminDb({});
    const result = await createFaq({ ...VALID_FAQ, question: "ab" });
    expect(result.ok).toBe(false);
    expect(findCall(fake.calls, "faqs", "insert")).toBeUndefined();
  });

  it("inserts and revalidates on success", async () => {
    authAs({ id: "admin" });
    const fake = adminDb({ faqs: { write: { data: null, error: null } } });

    const result = await createFaq(VALID_FAQ);

    expect(result).toEqual({ ok: true, message: "Асуулт нэмэгдлээ." });
    expect(findCall(fake.calls, "faqs", "insert")!.payload).toEqual(VALID_FAQ);
    const paths = revalidateMock.mock.calls.map((c) => c[0]);
    expect(paths).toContain("/contact");
    expect(paths).toContain("/admin/faqs");
  });

  it("surfaces a generic save error on a DB failure", async () => {
    authAs({ id: "admin" });
    adminDb({ faqs: { write: { data: null, error: { message: "boom" } } } });
    const result = await createFaq(VALID_FAQ);
    expect(result).toEqual({ ok: false, message: "Хадгалахад алдаа гарлаа." });
  });
});

describe("deleteFaq", () => {
  it("requires authentication", async () => {
    authAs(null);
    expect(await deleteFaq("f1")).toEqual({
      ok: false,
      message: "Эрх хүрэлцэхгүй байна.",
    });
  });

  it("deletes by id on success", async () => {
    authAs({ id: "admin" });
    const fake = adminDb({ faqs: { write: { data: null, error: null } } });
    const result = await deleteFaq("f1");
    expect(result).toEqual({ ok: true, message: "Устгагдлаа." });
    const del = findCall(fake.calls, "faqs", "delete")!;
    expect(del.eq).toContainEqual(["id", "f1"]);
  });
});

describe("createNews", () => {
  const VALID_NEWS = {
    title: "Шинэ мэдээ",
    slug: "shine-medee",
    summary: "",
    content: "",
    image_url: "",
    published_at: "2026-06-07",
  };

  it("rejects an unauthenticated caller without touching the admin DB", async () => {
    authAs(null);
    const result = await createNews(VALID_NEWS);
    expect(result).toEqual({ ok: false, message: "Эрх хүрэлцэхгүй байна." });
    expect(adminMock).not.toHaveBeenCalled();
  });

  it("inserts via the service-role client and revalidates on success", async () => {
    authAs({ id: "admin" });
    const fake = adminDb({ news: { write: { data: null, error: null } } });

    const result = await createNews(VALID_NEWS);

    expect(result).toEqual({ ok: true, message: "Мэдээ нэмэгдлээ." });
    expect(findCall(fake.calls, "news", "insert")).toBeDefined();
    const paths = revalidateMock.mock.calls.map((c) => c[0]);
    expect(paths).toContain("/news");
    expect(paths).toContain("/");
  });

  it("maps a unique-violation (23505) to a slug-collision message", async () => {
    authAs({ id: "admin" });
    adminDb({
      news: { write: { data: null, error: { code: "23505", message: "dup" } } },
    });

    const result = await createNews({ ...VALID_NEWS, slug: "duplicate" });
    expect(result).toEqual({
      ok: false,
      message: "Slug давхцаж байна. Өөр утга оруулна уу.",
    });
  });
});
