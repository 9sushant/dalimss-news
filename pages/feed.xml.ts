// pages/feed.xml.ts
// Dynamic RSS 2.0 Feed for Google News and search crawlers

import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { SITE_URL, stripForMeta, absoluteImageUrl } from "@/lib/seo";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Convert markdown to clean, basic HTML paragraphs for RSS feed readers
function mdToHtml(md: string): string {
  if (!md) return "";
  // Split by double newlines to form paragraphs
  const paragraphs = md
    .split(/\n\s*\n/)
    .map((p) => {
      let clean = p
        .replace(/<[^>]+>/g, "") // Strip HTML tags
        .replace(/[#*`_~]/g, "") // Strip simple Markdown chars
        .replace(/!\[.*?\]\(.*?\)/g, "") // Strip Markdown images
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Keep only link text, strip URL
        .trim();
      
      if (!clean) return "";
      return `<p>${xmlEscape(clean)}</p>`;
    })
    .filter(Boolean)
    .join("");
  return paragraphs;
}

const Feed = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const articles = await prisma.article.findMany({
    take: 50,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      slug: true,
      title: true,
      content: true,
      createdAt: true,
      customAuthor: true,
      mediaUrl: true,
      metaDescription: true,
    },
  });

  const lastBuildDate = new Date().toUTCString();

  const items = articles
    .map((article) => {
      const articleUrl = `${SITE_URL}/articles/${article.slug}`;
      const pubDate = new Date(article.createdAt).toUTCString();
      const author = article.customAuthor || "Dalimss News Desk";
      const description = article.metaDescription || stripForMeta(article.content || "", 250);
      const imageUrl = article.mediaUrl ? absoluteImageUrl(article.mediaUrl) : null;
      const htmlContent = mdToHtml(article.content || "");

      let mediaContent = "";
      if (imageUrl) {
        mediaContent = `<media:content url="${xmlEscape(imageUrl)}" medium="image" type="image/jpeg" />`;
      }

      return `
    <item>
      <title>${xmlEscape(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${author}]]></dc:creator>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${htmlContent}]]></content:encoded>
      ${mediaContent}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dalimss News</title>
    <link>${SITE_URL}</link>
    <description>Varanasi's fastest growing digital news platform. वाराणसी, पूर्वांचल और उत्तर प्रदेश की ताज़ा खबरें।</description>
    <image>
      <url>${SITE_URL}/logo-square.png</url>
      <title>Dalimss News</title>
      <link>${SITE_URL}</link>
    </image>
    <language>hi</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=1200"
  );
  res.write(rss);
  res.end();

  return { props: {} };
};

export default Feed;
