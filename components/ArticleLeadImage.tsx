import Image from "next/image";
import { isOptimizableImageSrc } from "@/lib/optimizableImage";

interface ArticleLeadImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Article lead image. Dimensions are not stored, so the image fills a fixed
 * 16:9 box and cannot shift layout when the file arrives.
 */
export default function ArticleLeadImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 768px",
}: ArticleLeadImageProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-neutral-100">
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
          className="h-full w-full object-contain"
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}
