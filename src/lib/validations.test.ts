import { describe, it, expect } from "vitest";
import {
  donationSchema,
  aboutItemSchema,
  newsSchema,
  partnerSchema,
  siteSettingsSchema,
  homeContentSchema,
  SITE_SETTINGS_KEYS,
  HOME_CONTENT_KEYS,
} from "@/lib/validations";

describe("donationSchema — phone required at the 25,000₮ threshold", () => {
  const base = {
    amount: 25_000,
    name: "Бат",
    email: "donor@example.mn",
    phone: "",
    message: "",
    anonymous: false,
  };

  it("rejects a 25,000₮ donation with no phone, flagging the phone field", () => {
    const result = donationSchema.safeParse(base);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["phone"]);
    }
  });

  it("rejects a phone shorter than 6 chars at the threshold", () => {
    const result = donationSchema.safeParse({ ...base, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("accepts a 25,000₮ donation with a valid phone", () => {
    const result = donationSchema.safeParse({ ...base, phone: "99112233" });
    expect(result.success).toBe(true);
  });

  it("accepts a sub-threshold donation without a phone", () => {
    const result = donationSchema.safeParse({ ...base, amount: 24_999 });
    expect(result.success).toBe(true);
  });

  it("rejects a non-integer amount", () => {
    const result = donationSchema.safeParse({ ...base, amount: 100.5, phone: "99112233" });
    expect(result.success).toBe(false);
  });
});

describe("aboutItemSchema — title required only for camel_point", () => {
  const base = { body: "Тэсвэр хатуужил", sort_order: 0 };

  it("rejects a camel_point without a title, flagging the title field", () => {
    const result = aboutItemSchema.safeParse({ ...base, kind: "camel_point", title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["title"]);
    }
  });

  it("accepts a camel_point with a title", () => {
    const result = aboutItemSchema.safeParse({ ...base, kind: "camel_point", title: "Тэвчээр" });
    expect(result.success).toBe(true);
  });

  it("accepts a non-camel_point kind without a title", () => {
    const result = aboutItemSchema.safeParse({ ...base, kind: "goal", title: "" });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown kind", () => {
    const result = aboutItemSchema.safeParse({ ...base, kind: "mystery", title: "x" });
    expect(result.success).toBe(false);
  });
});

describe("newsSchema — slug format", () => {
  const base = {
    title: "Шинэ мэдээ",
    summary: "",
    content: "",
    image_url: "",
    published_at: "2026-06-07",
  };

  it("accepts a lowercase-alphanumeric-dash slug", () => {
    expect(newsSchema.safeParse({ ...base, slug: "camel-2026-update" }).success).toBe(true);
  });

  it("rejects a slug with spaces or uppercase", () => {
    expect(newsSchema.safeParse({ ...base, slug: "Camel Update" }).success).toBe(false);
  });
});

describe("optional-url fields accept empty string but reject malformed urls", () => {
  const base = { name: "Түнш", sort_order: 0 };

  it("accepts an empty logo_url", () => {
    expect(partnerSchema.safeParse({ ...base, logo_url: "", website_url: "" }).success).toBe(true);
  });

  it("rejects a malformed logo_url", () => {
    expect(partnerSchema.safeParse({ ...base, logo_url: "not-a-url", website_url: "" }).success).toBe(false);
  });
});

describe("derived settings keys stay in sync with their schemas", () => {
  it("SITE_SETTINGS_KEYS matches the siteSettingsSchema shape", () => {
    expect(SITE_SETTINGS_KEYS).toEqual(Object.keys(siteSettingsSchema.shape));
    expect(SITE_SETTINGS_KEYS).toContain("bank_account");
  });

  it("HOME_CONTENT_KEYS matches the homeContentSchema shape", () => {
    expect(HOME_CONTENT_KEYS).toEqual(Object.keys(homeContentSchema.shape));
    expect(HOME_CONTENT_KEYS).toContain("home_hero_title");
  });
});
