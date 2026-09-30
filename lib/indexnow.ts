import { getCategoriesByDbValue } from "@/lib/categories";
import { SITE_URL, authorSlug, canonicalArticleSlug } from "@/lib/seo";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_TIMEOUT_MS = 4000;
const HOST = "dalimss.news";

export function articleUrl(slug: string): string {
  return `${SITE_URL}/articles/${canonicalArticleSlug(slug)}`;
}

/** Article URL plus the homepage, article index, and its category and author pages. */
export function indexNowUrlsForArticle(article: {
  slug: string;
  category?: string | null;
  customAuthor?: string | null;
}): string[] {
  const urls = [articleUrl(article.slug), `${SITE_URL}/`, `${SITE_URL}/articles`];
  getCategoriesByDbValue(article.category).forEach((category) => {
    urls.push(`${SITE_URL}/category/${category.slug}`);
  });
  const author = article.customAuthor ? authorSlug(article.customAuthor) : "";
  if (author) urls.push(`${SITE_URL}/author/${author}`);
  return urls;
}

/**
 * POST the URL list to IndexNow.
 * Runs only when INDEXNOW_ENABLED=true and VERCEL_ENV=production.
 * Never throws. Uses a short timeout so a slow IndexNow response cannot hang a caller.
 */
export async function submitIndexNow(urls: string[]): Promise<void> {
  try {
    if (process.env.INDEXNOW_ENABLED !== "true") return;
    if (process.env.VERCEL_ENV !== "production") return;

    const key = process.env.INDEXNOW_KEY;
    const urlList = Array.from(
      new Set(
        urls.filter(
          (url) => typeof url === "string" && url.startsWith(`https://${HOST}/`)
        )
      )
    );
    if (!key || urlList.length === 0) return;

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation: `https://${HOST}/${key}.txt`,
        urlList: urlList.slice(0, 10000),
      }),
      signal: AbortSignal.timeout(INDEXNOW_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(`IndexNow submission failed: ${response.status}`);
    }
  } catch {
    console.warn("IndexNow submission failed");
  }
}

/** Fire-and-forget. Saving an article does not wait on IndexNow. */
export function notifyIndexNow(urls: string[]): void {
  void submitIndexNow(urls).catch(() => {
    console.warn("IndexNow submission failed");
  });
}
