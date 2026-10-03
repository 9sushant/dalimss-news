import React from "react";
import Image from "next/image";
import ImageWithFallback from "./ImageWithFallback";
import { isOptimizableImageSrc } from "@/lib/optimizableImage";

interface ArticleMediaPreviewProps {
  src: string;
  mediaType?: "image" | "video" | string | null;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export default function ArticleMediaPreview({
  src,
  mediaType,
  alt,
  className = "h-full w-full object-cover",
  loading = "lazy",
  priority = false,
  sizes = "100vw",
  quality = 70,
}: ArticleMediaPreviewProps) {
  if (mediaType === "video") {
    return (
      <div className="relative h-full w-full bg-black">
        <video
          src={`${src}#t=0.1`}
          aria-label={alt}
          className={className}
          muted
          playsInline
          preload="metadata"
        />
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10"
          aria-hidden="true"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-black/60 text-2xl text-white shadow-lg">
            ▶
          </span>
        </div>
      </div>
    );
  }

  if (isOptimizableImageSrc(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        className={className}
        {...(priority ? { priority: true } : { loading })}
      />
    );
  }

  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : loading}
    />
  );
}
