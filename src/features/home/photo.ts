// Legacy AI-rendered / mismatched assets that the redesign retires. A
// site_settings value still pointing at one of these is treated as "no photo"
// so the brand-illustration fallback renders instead. A genuine admin upload
// (e.g. a Supabase storage URL) passes through untouched and fills the frame.
const LEGACY_ASSETS = ["/camel-charm.png", "/bagCamel-bg.png"];

/** Returns a usable real-photo URL, or undefined when blank/legacy. */
export function realPhoto(src: string | null | undefined): string | undefined {
  if (!src) return undefined;
  const trimmed = src.trim();
  if (!trimmed) return undefined;
  if (LEGACY_ASSETS.includes(trimmed)) return undefined;
  return trimmed;
}
