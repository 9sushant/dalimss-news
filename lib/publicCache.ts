import type { ServerResponse } from "http";

export const PUBLIC_PAGE_CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300";

export function setPublicPageCache(res: ServerResponse) {
  res.setHeader("Cache-Control", PUBLIC_PAGE_CACHE_CONTROL);
}
