import { cn } from "@/lib/utils";
import { LogoBadge } from "./Logo";

/** Official photo, or an elegant branded placeholder while the photo is awaiting assignment. */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  eager,
}: {
  src: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-lavender-mist", className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-lavender-fade p-6 text-center">
          <LogoBadge className="h-20 w-20 opacity-80 shadow-soft md:h-24 md:w-24" />
          <p className="font-display text-lg italic text-berry">{alt}</p>
          <p className="font-ui text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
            Photo officielle à venir
          </p>
        </div>
      )}
    </div>
  );
}
