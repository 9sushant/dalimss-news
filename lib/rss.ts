import prisma from "@/lib/prisma";
import { getCategoryBySlug, getCategoryByDbValue } from "@/lib/categories";
import {
  SITE_NAME,
  SITE_URL,
  absoluteImageUrl,
  canonicalArticleSlug,
  stripForMeta,
} from "@/lib/seo";
import { cdata, xmlEscape } from "@/lib/xml";

type FeedArticle = {
  slug: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  customAuthor: string | null;
  mediaUrl: string | null;
  category: string | null;
  metaDescription: string | null;
};

function contentToHtml(content: string): string {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/!\[.*?\]\(.*?\)/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/[#*`_~]/g, "")
        .trim()
    )
    .filter(Boolean)
    .map((paragraph) => `<p>${xmlEscape(paragraph)}</p>`)
    .join("");
}

export async function buildRssFeed(options?: {
  categorySlug?: string;
  title?: string;
  description?: string;
  selfPath?: string;
}) {
  const category = options?.categorySlug
    ? getCategoryBySlug(options.categorySlug)
    : undefined;

  const articles = await prisma.article.findMany({
    where: category
      ? {
          OR: category.dbValues.map((value) => ({
            category: { contains: value, mode: "insensitive" as const },
          })),
        }
      : undefined,
    take: 50,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      slug: true,
      title: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      customAuthor: true,
      mediaUrl: true,
      category: true,
      metaDescription: true,
    },
  });

  const feedTitle = options?.title || SITE_NAME;
  const feedDescription =
    options?.description ||
    "Latest verified reports from Dalimss News covering Varanasi, Gurugram, Uttar Pradesh, education, technology and public-interest news.";
  const selfPath = options?.selfPath || "/feed.xml";

  const items = (articles as FeedArticle[])
    .map((article) => {
      const articleUrl = `${SITE_URL}/articles/${canonicalArticleSlug(article.slug)}`;
      const author = article.customAuthor || "Dalimss News Desk";
      const section =
        getCategoryByDbValue(article.category || "")?.name ||
        article.category ||
        "News";
      const description =
        article.metaDescription || stripForMeta(article.content || "", 250);
      const imageUrl = article.mediaUrl ? absoluteImageUrl(article.mediaUrl) : "";

      return `
    <item>
      <title>${xmlEscape(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
      <atom:updated>${new Date(article.updatedAt).toISOString()}</atom:updated>
      <dc:creator>${cdata(author)}</dc:creator>
      <category>${xmlEscape(section)}</category>
      <description>${cdata(description)}</description>
      <content:encoded>${cdata(contentToHtml(article.content || ""))}</content:encoded>
      ${
        imageUrl
          ? `<media:content url="${xmlEscape(imageUrl)}" medium="image" />`
          : ""
      }
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(feedTitle)}</title>
    <link>${SITE_URL}</link>
    <description>${xmlEscape(feedDescription)}</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}${selfPath}" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/logo-square.png</url>
      <title>${xmlEscape(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;
}
