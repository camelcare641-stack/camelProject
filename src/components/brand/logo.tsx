import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Minimal line-art mark of a Bactrian (two-hump) camel. Single stroke weight,
 * `stroke="currentColor"` so callers control the color via `text-*`. No fills.
 * Drawn on a 64×48 grid: standing camel in profile, head raised left, two
 * distinct humps, four legs, suggested tail.
 */
export function BrandMark({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-8 w-auto", className)}
      role="img"
      aria-hidden="true"
    >
      {/* Body top line: neck up to head, then over the two humps to the rump. */}
      <path d="M9 21 C9 14 10 10 13 9 C15 8 16 10 16 12 C16 15 15 17 15 20 C18 17 21 17 24 20 C26 16 30 16 32 20 C35 17 39 17 41 21 C44 16 48 16 51 21 C53 18 56 19 56 24" />
      {/* Belly + rump back down to the hind leg. */}
      <path d="M9 21 C8 25 9 29 11 33" />
      <path d="M56 24 C57 29 56 33 53 36" />
      {/* Front legs. */}
      <path d="M14 33 L13 43" />
      <path d="M20 33 L21 43" />
      {/* Hind legs. */}
      <path d="M47 35 L46 43" />
      <path d="M53 36 L54 43" />
      {/* Underbelly connecting front to hind. */}
      <path d="M11 33 C20 36 38 36 47 35" />
      {/* Tail. */}
      <path d="M56 24 C59 25 60 28 59 31" />
      {/* Eye + brow detail on the head. */}
      <path d="M12 13 h0.01" />
    </svg>
  );
}

/**
 * Full logo lockup: the camel mark plus the "ТЭМЭЭ" wordmark in the display
 * font. The wordmark text is read from `site.name` (no hardcoded Cyrillic in
 * the component) but can be overridden via the `wordmark` prop.
 */
export function Logo({
  className,
  wordmark = site.name,
  markClassName,
  showWordmark = true,
}: {
  className?: string;
  wordmark?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-clay", className)}>
      <BrandMark className={cn("h-8 w-auto", markClassName)} />
      {showWordmark ? (
        <span className="font-display text-2xl font-bold tracking-tight">
          {wordmark}
        </span>
      ) : null}
    </span>
  );
}
