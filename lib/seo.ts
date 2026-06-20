// lib/seo.ts
// SEO helper functions

export const SITE_URL = "https://dalimss.news";
export const SITE_NAME = "Dalimss News";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

/**
 * Generate a URL-safe slug from an author name
 */
export function authorSlug(name: string): string {
  return name
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
  return (
    content
      .replace(/<[^>]+>/g, "") // Strip HTML tags
      .replace(/[#*`_~\[\]]/g, "") // Strip Markdown chars
      .replace(/!\[.*?\]\(.*?\)/g, "") // Strip Markdown images
      .replace(/\[.*?\]\(.*?\)/g, "") // Strip Markdown links
      .replace(/\n+/g, " ") // Newlines to spaces
      .replace(/\s+/g, " ") // Collapse whitespace
      .trim()
      .slice(0, maxLength) + (content.length > maxLength ? "..." : "")
  );
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
 * Format ISO date string with India timezone
 */
export function toISOWithTZ(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString();
}
