import { cn } from "@/lib/utils";

/**
 * Outline illustration of the leather camel charm product — a small camel
 * silhouette charm hanging from a strap loop with a binding ring, as it would
 * appear as a keyring / bag charm. `stroke="currentColor"`, no fills except the
 * binding rivet dot. Color via `text-*` (clay).
 */
export function CamelCharm({
  className,
  strokeWidth = 1.8,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 96 128"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-hidden="true"
    >
      {/* Strap loop at the top. */}
      <path d="M48 6 C40 6 35 11 35 18 C35 24 39 28 44 30" />
      <path d="M48 6 C56 6 61 11 61 18 C61 24 57 28 52 30" />
      {/* Strap tails feeding into the binding ring. */}
      <path d="M44 30 L45 40 M52 30 L51 40" />
      {/* Binding ring / collar holding the charm. */}
      <rect x="40" y="40" width="16" height="9" rx="3" />
      {/* Rivet. */}
      <path d="M48 44.5 h0.01" />
      {/* The leather camel charm body, hanging below the ring. */}
      {/* Back over two humps + neck + head. */}
      <path d="M30 86 C28 80 30 74 34 72 C36 71 38 73 38 76 C40 72 44 72 46 76 C49 72 53 72 55 76 C57 72 61 72 63 76 C65 71 70 71 72 76 C74 73 77 74 77 79 C78 84 76 88 73 90" />
      {/* Head raised to the left from the neck. */}
      <path d="M34 72 C32 65 31 58 33 53 C34 50 37 49 39 51 C41 53 40 57 39 60 C38 64 38 68 38 72" />
      {/* Muzzle. */}
      <path d="M33 55 C30 56 29 59 31 61" />
      {/* Belly + legs of the charm. */}
      <path d="M30 86 C30 92 32 98 36 102 C46 106 60 106 70 102 C72 98 73 94 73 90" />
      <path d="M40 104 L39 116 M50 105 L50 117 M62 104 L63 115 M70 100 L72 110" />
      {/* Decorative stitch line along the charm back. */}
      <path d="M40 80 C50 86 64 86 72 80" strokeDasharray="2 3" />
    </svg>
  );
}
