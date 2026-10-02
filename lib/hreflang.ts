import { SITE_URL } from "@/lib/seo";

export type PageLanguage = "en" | "hi";

export interface HreflangLink {
  hrefLang: PageLanguage;
  href: string;
}

/**
 * A real English/Hindi translation of the same story.
 *
 * Paths are site pathnames such as /articles/city-budget. Do not put query
 * strings here. Register a pair only when both URLs exist and each page is
 * a translation of the other. No database column is required.
 *
 * When a pair is present, both URLs emit reciprocal hreflang alternates.
 * This file never emits x-default.
 */
export interface TranslationPair {
  en: string;
  hi: string;
}

/**
 * Known translation pairs. Empty on purpose: Hindi articles do not have an
 * English counterpart today, so Hindi pages emit only a self hreflang="hi"
 * alternate. Add a pair here later to turn on reciprocal links.
 */
export const TRANSLATION_PAIRS: TranslationPair[] = [];

function pathnameOf(path: string): string {
  const withoutQuery = (path.split("?")[0] || "/").trim();
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
}

function absolute(path: string): string {
  const normalized = pathnameOf(path);
  return normalized === "/" ? SITE_URL : `${SITE_URL}${normalized}`;
}

/**
 * hreflang alternates for one canonical URL.
 *
 * Hindi pages with no registered pair return a single self link:
 * rel="alternate" hreflang="hi". English pages with no pair return nothing,
 * so existing English articles stay unchanged. A registered pair returns
 * reciprocal en and hi links and still does not add x-default.
 */
export function hreflangLinks(input: {
  /** Canonical path, including ?page=N when the page is past 1. */
  path: string;
  language: PageLanguage;
}): HreflangLink[] {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const selfHref =
    pathnameOf(path) === "/" && !path.includes("?")
      ? SITE_URL
      : `${SITE_URL}${path}`;
  const pathname = pathnameOf(path);
  const pair = TRANSLATION_PAIRS.find(
    (entry) =>
      pathnameOf(entry.en) === pathname || pathnameOf(entry.hi) === pathname
  );

  if (!pair) {
    if (input.language !== "hi") return [];
    return [{ hrefLang: "hi", href: selfHref }];
  }

  return [
    { hrefLang: "en", href: absolute(pair.en) },
    { hrefLang: "hi", href: absolute(pair.hi) },
  ];
}
