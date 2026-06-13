import { cn } from "@/lib/utils";

/**
 * Large decorative single-line Bactrian camel illustration for hero / section
 * use. Refined confident curves, two humps, four legs in a relaxed standing
 * stance, raised head, and a small saddle / charm-strap detail across the back.
 * `stroke="currentColor"`, no fills — color via `text-*` (clay or gold).
 */
export function CamelLineArt({
  className,
  strokeWidth = 1.6,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-hidden="true"
    >
      {/* Head, raised on the long neck (upper jaw, brow). */}
      <path d="M30 70 C26 58 24 46 27 38 C28 33 31 30 35 31 C39 32 40 37 39 42 C38 48 37 53 38 59" />
      {/* Lower jaw + muzzle. */}
      <path d="M27 41 C24 42 22 45 23 49 C24 52 28 53 31 51" />
      {/* Ear. */}
      <path d="M36 32 C37 28 39 27 41 28" />
      {/* Back: neck base over the two humps to the rump. */}
      <path d="M38 59 C41 56 45 55 49 57 C53 49 60 48 65 54 C70 44 80 43 85 52 C92 45 102 46 106 56 C112 49 121 50 124 60" />
      {/* Rump down to the hind leg start. */}
      <path d="M124 60 C128 70 127 80 122 88" />
      {/* Belly line from neck base to under the rump. */}
      <path d="M30 70 C28 80 30 90 35 96 C55 102 95 102 115 96 C119 93 121 91 122 88" />
      {/* Front legs (slightly offset for depth). */}
      <path d="M44 98 C43 110 43 122 42 132" />
      <path d="M54 99 C54 111 55 123 56 133" />
      {/* Hind legs. */}
      <path d="M104 99 C103 111 103 123 102 132" />
      <path d="M116 96 C117 108 118 120 119 131" />
      {/* Hooves. */}
      <path d="M40 132 h5 M54 133 h5 M100 132 h5 M117 131 h5" />
      {/* Tail with a tuft. */}
      <path d="M124 62 C130 64 134 70 132 78 C131 82 128 84 126 83" />
      {/* Saddle / charm-strap detail across the back between the humps. */}
      <path d="M70 56 C74 64 92 64 96 56" />
      <path d="M82 62 L82 70" />
      {/* Small hanging charm on the strap. */}
      <path d="M82 70 a3 3 0 1 0 0.01 0" />
      {/* Eye. */}
      <path d="M33 39 h0.01" />
    </svg>
  );
}
