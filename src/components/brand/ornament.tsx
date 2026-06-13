import { cn } from "@/lib/utils";

/**
 * Small traditional Mongolian ulzii-knot-inspired geometric motif for dividers
 * and accents. Symmetric interlaced square knot drawn with a single stroke
 * weight. `stroke="currentColor"`, no fills — color via `text-*` (gold/clay).
 */
export function OrnamentMotif({
  className,
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4", className)}
      role="img"
      aria-hidden="true"
    >
      {/* Outer diamond frame. */}
      <path d="M16 3 L29 16 L16 29 L3 16 Z" />
      {/* Ulzii-style interlaced inner knot (four hooked arms around the center). */}
      <path d="M16 11 L16 16 L21 16" />
      <path d="M21 16 L16 16 L16 21" />
      <path d="M16 21 L16 16 L11 16" />
      <path d="M11 16 L16 16 L16 11" />
      {/* Hooked tips of each arm, rotationally symmetric. */}
      <path d="M16 11 L19 11 M21 16 L21 13 M16 21 L13 21 M11 16 L11 19" />
    </svg>
  );
}
