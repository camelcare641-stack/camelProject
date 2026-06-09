import type { QPayInvoiceResponse } from "./types";

export type BankApp = QPayInvoiceResponse["urls"][number];

// Most-used Mongolian retail banks, in descending order of customer reach.
// QPay returns ~15-20 bank-app deep links per invoice; on a phone the donor
// only needs their own bank, so we surface the top few and drop the long tail.
// Matched case-insensitively against each entry's name + link, so a rename on
// QPay's side (or a Cyrillic display name) still resolves as long as one token
// hits — the English scheme tokens (khanbank://, golomtbank://, …) are stable.
const BANK_PRIORITY: readonly (readonly string[])[] = [
  ["khan"], // Хаан банк
  ["state", "төрийн"], // Төрийн банк
  ["tdb", "trade and development"], // Худалдаа хөгжлийн банк
  ["golomt"], // Голомт банк
  ["xac", "хас"], // Хас банк
];

export const MAX_BANK_APPS = 5;

function rank(app: BankApp): number {
  const hay = `${app.name} ${app.link}`.toLowerCase();
  const i = BANK_PRIORITY.findIndex((tokens) => tokens.some((t) => hay.includes(t)));
  return i === -1 ? BANK_PRIORITY.length : i;
}

/**
 * Keep at most {@link MAX_BANK_APPS} bank apps, floating the most-used Mongolian
 * banks to the front. Ties (including the unranked long tail) preserve QPay's
 * original order, so the slice is deterministic.
 */
export function prioritizeBankApps(apps: BankApp[]): BankApp[] {
  return apps
    .map((app, i) => ({ app, i, r: rank(app) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .slice(0, MAX_BANK_APPS)
    .map((x) => x.app);
}
