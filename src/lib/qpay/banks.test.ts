import { describe, it, expect } from "vitest";
import { prioritizeBankApps, MAX_BANK_APPS, type BankApp } from "@/lib/qpay/banks";

const app = (name: string, link: string): BankApp => ({
  name,
  description: name,
  logo: "",
  link,
});

// A representative QPay `urls` payload: top banks interleaved with the long
// tail and a couple of e-wallets, in QPay's arbitrary order.
const QPAY_URLS: BankApp[] = [
  app("qPay wallet", "qpaywallet://q.qpay.mn/..."),
  app("Xac bank", "xacbank://q.qpay.mn/..."),
  app("Trade and Development bank", "tdbbank://q.qpay.mn/..."),
  app("Most money", "mostmoney://q.qpay.mn/..."),
  app("Khan bank", "khanbank://q.qpay.mn/..."),
  app("Golomt bank", "golomtbank://q.qpay.mn/..."),
  app("Bogd bank", "bogdbank://q.qpay.mn/..."),
  app("State bank", "statebank://q.qpay.mn/..."),
  app("Capitron bank", "capitronbank://q.qpay.mn/..."),
];

describe("prioritizeBankApps", () => {
  it("caps the list at MAX_BANK_APPS", () => {
    expect(prioritizeBankApps(QPAY_URLS)).toHaveLength(MAX_BANK_APPS);
  });

  it("keeps the five most-used banks in priority order", () => {
    expect(prioritizeBankApps(QPAY_URLS).map((a) => a.name)).toEqual([
      "Khan bank",
      "State bank",
      "Trade and Development bank",
      "Golomt bank",
      "Xac bank",
    ]);
  });

  it("drops the long tail and e-wallets when top banks fill the cap", () => {
    const names = prioritizeBankApps(QPAY_URLS).map((a) => a.name);
    expect(names).not.toContain("qPay wallet");
    expect(names).not.toContain("Bogd bank");
  });

  it("pads with other apps (QPay order) when fewer than five top banks exist", () => {
    const sparse = [
      app("qPay wallet", "qpaywallet://..."),
      app("Khan bank", "khanbank://..."),
      app("Most money", "mostmoney://..."),
    ];
    expect(prioritizeBankApps(sparse).map((a) => a.name)).toEqual([
      "Khan bank", // ranked top floats up
      "qPay wallet", // unranked tail keeps original order
      "Most money",
    ]);
  });

  it("matches Cyrillic display names too", () => {
    const cyrillic = [app("Голомт банк", "golomtbank://..."), app("Хас банк", "xacbank://...")];
    // Both resolve via either the Cyrillic token or the English scheme.
    expect(prioritizeBankApps(cyrillic).map((a) => a.name)).toEqual([
      "Голомт банк",
      "Хас банк",
    ]);
  });

  it("returns an empty list unchanged", () => {
    expect(prioritizeBankApps([])).toEqual([]);
  });
});
