import Image from "next/image";
import { isOptimizableImageSrc } from "@/lib/optimizableImage";

interface ArticleLeadImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Article lead image. Dimensions are not stored. Most files are 3:2
 * (1536x1024), so the image fills that box. object-contain keeps the
 * whole photo visible, and the fixed box does not shift when it loads.
 */
export default function ArticleLeadImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 768px",
}: ArticleLeadImageProps) {
  return (
    <div
      className="relative aspect-[3/2] w-full overflow-hidden rounded-md bg-neutral-100"
      style={{ aspectRatio: "3 / 2" }}
    >
      {isOptimizableImageSrc(src) ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={70}
          className="object-contain"
          {...(priority ? { priority: true } : { loading: "lazy" as const })}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          className="h-full w-full object-contain"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
    </div>
  );
}
