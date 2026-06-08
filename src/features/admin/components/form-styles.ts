// Shared Tailwind class strings for admin form fields. Kept in one place so the
// label/input look stays consistent across every admin form. Forms that need a
// fixed input height compose `inputClass` with a height utility (e.g. login).

export const labelClass =
  "text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-muted";

export const inputClass =
  "rounded-none border-border bg-white text-base focus-visible:border-clay focus-visible:ring-0";
