// lib/seo.ts
// SEO helper functions

export const SITE_URL = "https://dalimss.news";
export const SITE_NAME = "Dalimss News";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

export const ARTICLE_SLUG_REDIRECTS: Record<string, string> = {
  "what-is-artificial-intelligence-ai":
    "vda-cracks-down-on-illegal-constructions-in-zone-4-multiple-buildings-sealed",
};

const AUTHOR_NAME_CORRECTIONS: Record<string, string> = {
  "dalimss news desk": "Dalimss News Desk",
  "dalimss news desks": "Dalimss News Desk",
  "maahr madhok": "Maahir Madhok",
};

export function canonicalAuthorName(name: string): string {
  const normalizedName = name.trim().replace(/\s+/g, " ");
  return AUTHOR_NAME_CORRECTIONS[normalizedName.toLowerCase()] || normalizedName;
}

export function authorNameVariants(name: string): string[] {
  const canonicalName = canonicalAuthorName(name);
  const aliases = Object.entries(AUTHOR_NAME_CORRECTIONS)
    .filter(([, correctedName]) => correctedName === canonicalName)
    .map(([alias]) =>
      alias.replace(/\b\w/g, (character) => character.toUpperCase())
    );

  return Array.from(new Set([canonicalName, ...aliases]));
}

export function canonicalArticleSlug(slug: string): string {
  return ARTICLE_SLUG_REDIRECTS[slug] || slug;
}

/**
 * Generate a URL-safe slug from an author name
 */
export function authorSlug(name: string): string {
  return canonicalAuthorName(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/(^-|-$)/g, ""); // Trim hyphens
}

/**
 * Strip HTML tags and Markdown formatting from content
 * to produce a clean text string for meta descriptions
 */
export function stripForMeta(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, " $1 ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, " $1 ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/[#*`_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) return plainText;

  return `${plainText.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

/**
 * Get absolute image URL (handles relative and absolute URLs)
 */
export function absoluteImageUrl(
  url: string | null | undefined
): string {
  if (!url) return DEFAULT_OG_IMAGE;
  if (url.startsWith("http")) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Return a social-crawler-friendly version of an image.
 *
 * OTT artwork is stored efficiently as WebP, but some link-preview crawlers
 * (notably WhatsApp) do not reliably render WebP Open Graph images. Next's
 * image endpoint returns a widely supported PNG when the crawler does not
 * advertise WebP/AVIF support, while keeping the original artwork unchanged.
 */
export function socialPreviewImageUrl(
  url: string | null | undefined,
  version?: string | number | Date,
  width = 640
): string {
  let sourceUrl = absoluteImageUrl(url);
  if (version !== undefined) {
    const separator = sourceUrl.includes("?") ? "&" : "?";
    const versionValue =
      version instanceof Date ? version.getTime() : String(version);
    sourceUrl = `${sourceUrl}${separator}v=${encodeURIComponent(versionValue)}`;
  }
  return `${SITE_URL}/_next/image?url=${encodeURIComponent(
    sourceUrl
  )}&w=${width}&q=75`;
}

/** Resolve a site-hosted asset without substituting an image fallback. */
export function absoluteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Format a media duration in seconds as an ISO 8601 duration. */
export function toISO8601Duration(
  totalSeconds: number | null | undefined
): string | undefined {
  if (!Number.isFinite(totalSeconds) || Number(totalSeconds) <= 0) {
    return undefined;
  }

  return `PT${Math.round(Number(totalSeconds))}S`;
}

/**
 * Format ISO date string with India timezone
 */
export function toISOWithTZ(date: string | Date): string {
  const d = new Date(date);
  const indiaOffsetMs = 5.5 * 60 * 60 * 1000;
  return new Date(d.getTime() + indiaOffsetMs)
    .toISOString()
    .replace("Z", "+05:30");
}
