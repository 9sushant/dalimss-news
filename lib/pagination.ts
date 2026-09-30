export const LISTING_PAGE_SIZE = 30;

/** Missing page is page 1. Any other value must be a positive integer. */
export function parsePageParam(
  value: string | string[] | undefined
): number | null {
  if (value === undefined) return 1;
  if (Array.isArray(value) || !/^[1-9]\d*$/.test(value)) return null;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

/** Page 1 keeps the existing path. Later pages use a crawlable query. */
export function listingPath(pathname: string, page: number): string {
  return page > 1 ? `${pathname}?page=${page}` : pathname;
}

/** Short plain-text excerpt so listing HTML does not include full articles. */
export function listingExcerpt(
  content: string | null | undefined,
  maxLength = 180
): string {
  if (!content) return "";
  return content
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
