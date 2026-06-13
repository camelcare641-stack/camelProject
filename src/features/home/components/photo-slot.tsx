import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Framed photo slot with a tasteful brand-illustration fallback. A real photo
 * drops in later via `src` with ZERO layout change — same frame, same aspect,
 * same caption. When `src` is empty the provided `fallback` (a brand SVG such
 * as CamelLineArt / CamelCharm) renders inside the same frame instead of a gray
 * placeholder. White card frame, subtle border, caption in the accent font.
 */
export function PhotoSlot({
  src,
  alt,
  caption,
  fallback,
  aspect = "aspect-4/5",
  sizes = "(min-width: 1024px) 420px, 100vw",
  className,
  preload = false,
}: {
  src?: string;
  alt: string;
  caption?: string;
  fallback: React.ReactNode;
  aspect?: string;
  sizes?: string;
  className?: string;
  preload?: boolean;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-white p-2 shadow-[0_1px_0_rgba(46,42,38,0.04),0_12px_30px_-18px_rgba(46,42,38,0.25)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-md bg-clay-tint",
          aspect,
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
            preload={preload}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-clay">
            {fallback}
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="px-2 pb-1 pt-3 text-center font-accent text-lg leading-tight text-charcoal-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
