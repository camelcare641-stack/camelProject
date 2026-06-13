import { cn } from "@/lib/utils";

/**
 * Program icons for the three pillars (Боловсрол · Сэтгэлзүй · Халамж).
 * 24px grid, single stroke weight matching lucide style (currentColor stroke,
 * no fills). Color via `text-*`.
 */

type IconProps = {
  className?: string;
  strokeWidth?: number;
};

function iconProps(strokeWidth: number, className?: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: cn("size-6", className),
    role: "img" as const,
    "aria-hidden": true,
  };
}

/** Education — an open book. */
export function EducationIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...iconProps(strokeWidth, className)}>
      <path d="M12 6.5C10.4 5 8 4.5 4 4.8 v12.4 C8 16.9 10.4 17.4 12 19" />
      <path d="M12 6.5C13.6 5 16 4.5 20 4.8 v12.4 C16 16.9 13.6 17.4 12 19" />
      <path d="M12 6.5 V19" />
    </svg>
  );
}

/** Psychology — a heart cradled in an open hand. */
export function PsychologyIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...iconProps(strokeWidth, className)}>
      {/* Heart. */}
      <path d="M12 9.2 C11.2 7.6 9.6 7 8.3 7.7 C6.9 8.4 6.6 10.2 7.6 11.6 C8.4 12.7 12 15.5 12 15.5 C12 15.5 15.6 12.7 16.4 11.6 C17.4 10.2 17.1 8.4 15.7 7.7 C14.4 7 12.8 7.6 12 9.2 Z" />
      {/* Cradling hand below. */}
      <path d="M4 16 C5.5 18.5 8.5 20 12 20 C15.5 20 18.5 18.5 20 16" />
    </svg>
  );
}

/** Care — sheltering hands forming a roof / yurt over a small figure. */
export function CareIcon({ className, strokeWidth = 1.75 }: IconProps) {
  return (
    <svg {...iconProps(strokeWidth, className)}>
      {/* Sheltering roof formed by two hands meeting at the apex. */}
      <path d="M12 4 L4 10.5 C4 10.5 5.5 12 6.2 11.4 L12 6.8 L17.8 11.4 C18.5 12 20 10.5 20 10.5 Z" />
      {/* Small protected figure beneath. */}
      <circle cx="12" cy="14.5" r="1.6" />
      <path d="M9 20 C9 18 10.3 16.8 12 16.8 C13.7 16.8 15 18 15 20" />
    </svg>
  );
}
