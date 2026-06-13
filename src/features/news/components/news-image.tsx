import Image from "next/image";
import { OrnamentMotif } from "@/components/brand/ornament";
import { cn } from "@/lib/utils";

/**
 * News thumbnail / cover with a *designed* fallback for rows that have no
 * image: a clay-tint band with a centered ornament motif, instead of the old
 * gray placeholder icon. Caller controls aspect ratio + sizing via className.
 */
export function NewsImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div
          aria-hidden
          className="band-brand texture-grain flex h-full w-full items-center justify-center"
        >
          <OrnamentMotif className="size-8 text-gold" />
        </div>
      )}
    </div>
  );
}
