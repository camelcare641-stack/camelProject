import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BandVariant = "neutral" | "brand" | "confirm" | "highlight" | "white";

const bandClass: Record<BandVariant, string> = {
  neutral: "band-neutral",
  brand: "band-brand",
  confirm: "band-confirm",
  highlight: "band-highlight",
  white: "bg-white",
};

/**
 * Shared inner-page hero. Two modes:
 *
 * - No `image` (default): a tinted band (`variant`) with a subtle paper-grain
 *   texture and charcoal text, so each page reads as a distinct member of one
 *   family rather than an ad-hoc one-off header.
 * - With `image`: the photo fills the band behind a charcoal scrim and the
 *   eyebrow / title / lead flip to white so they stay legible over any photo.
 *
 * Pages pass `image={null}` today (band-color fallback) and can drop in a URL
 * later — e.g. `image={settings.aboutHeroUrl}` — with no other changes.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  variant = "brand",
  image,
  imageAlt = "",
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  variant?: BandVariant;
  image?: string | null;
  imageAlt?: string;
  children?: ReactNode;
}) {
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        "relative border-b border-border",
        hasImage ? "bg-charcoal" : cn(bandClass[variant], "texture-grain"),
      )}
    >
      {hasImage && (
        <>
          <Image
            src={image as string}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Charcoal scrim keeps white text legible over any photo. */}
          <div aria-hidden className="absolute inset-0 bg-charcoal/55" />
        </>
      )}

      <div
        className={cn(
          "relative mx-auto max-w-4xl px-4 text-center sm:px-6",
          hasImage ? "py-24 sm:py-28" : "pt-16 pb-14 sm:pt-20",
        )}
      >
        <p className={cn("eyebrow", hasImage && "text-white/80")}>{eyebrow}</p>
        <h1
          className={cn(
            "mt-4 font-display text-4xl font-bold text-balance sm:text-6xl",
            hasImage ? "text-white" : "text-charcoal",
          )}
        >
          {title}
        </h1>
        {lead && (
          <p
            className={cn(
              "mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg",
              hasImage ? "text-white/85" : "text-charcoal-muted",
            )}
          >
            {lead}
          </p>
        )}
        {children}
        <div className={cn("ornament-divider mt-10", hasImage && "text-white/70")}>
          <span className="ornament-diamond" aria-hidden />
        </div>
      </div>
    </section>
  );
}
