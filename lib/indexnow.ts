import { SITE_URL, canonicalArticleSlug } from "@/lib/seo";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export function articleUrl(slug: string): string {
  return `${SITE_URL}/articles/${canonicalArticleSlug(slug)}`;
}

export async function submitIndexNow(urls: string[]) {
  const key = process.env.INDEXNOW_KEY;
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  if (!key || uniqueUrls.length === 0) {
    return;
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: uniqueUrls,
      }),
    });

    if (!response.ok) {
      console.warn(`IndexNow submission failed: ${response.status}`);
    }
  } catch (error) {
    console.warn("IndexNow submission failed:", error);
  }
}
