import { describe, it, expect } from "vitest";
import { cn, formatMNT, slugify, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("formatMNT", () => {
  // The exact grouping separator is ICU-locale-dependent, so assert on the
  // digits + currency mark rather than a hard-coded separator.
  it("keeps the underlying digits and appends ₮", () => {
    const out = formatMNT(25000);
    expect(out.endsWith("₮")).toBe(true);
    expect(out.replace(/\D/g, "")).toBe("25000");
  });

  it("handles zero", () => {
    expect(formatMNT(0)).toBe("0₮");
  });
});

describe("slugify", () => {
  it("transliterates Mongolian Cyrillic to ascii and dashes spaces", () => {
    expect(slugify("Тэмээ төсөл")).toBe("temee-tosol");
  });

  it("maps multi-character cyrillic letters", () => {
    // ё→yo, ц→ts, ч→ch, ш→sh, ю→yu, я→ya
    expect(slugify("ёцчшюя")).toBe("yotschshyuya");
  });

  it("drops the soft/hard signs (ъ, ь)", () => {
    expect(slugify("сурахъ")).toBe("surah");
  });

  it("collapses runs of punctuation/space into a single dash", () => {
    expect(slugify("a   b---c!!!d")).toBe("a-b-c-d");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("  -hello-  ")).toBe("hello");
  });

  it("lowercases latin input", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips diacritics via NFD normalization", () => {
    expect(slugify("Café")).toBe("cafe");
  });

  it("caps the slug at 80 characters", () => {
    expect(slugify("a".repeat(200)).length).toBe(80);
  });
});

describe("formatDate", () => {
  it("formats an ISO string as YYYY.MM.DD in UTC", () => {
    expect(formatDate("2026-06-07T00:00:00Z")).toBe("2026.06.07");
  });

  it("zero-pads single-digit months and days", () => {
    expect(formatDate("2026-01-03T12:00:00Z")).toBe("2026.01.03");
  });

  it("accepts a Date object", () => {
    expect(formatDate(new Date("2024-12-31T23:00:00Z"))).toBe("2024.12.31");
  });
});
