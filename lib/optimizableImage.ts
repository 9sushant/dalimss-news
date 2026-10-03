const OPTIMIZABLE_HOSTS = new Set([
  "lh3.googleusercontent.com",
  "picsum.photos",
]);

/** True when next/image can optimize this src with the configured remotePatterns. */
export function isOptimizableImageSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  try {
    const url = new URL(src);
    if (url.protocol !== "https:") return false;
    if (OPTIMIZABLE_HOSTS.has(url.hostname)) return true;
    return url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}
