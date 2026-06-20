// pages/news-sitemap.xml.ts
// Google News sitemap — only articles from the last 2 days

import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const NewsSitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = "https://dalimss.news";
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const articles = await prisma.article.findMany({
    where: {
      createdAt: {
        gte: twoDaysAgo,
      },
    },
    select: {
      slug: true,
      title: true,
      createdAt: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const urls = articles
    .map(
      (article) => `
    <url>
      <loc>${baseUrl}/articles/${article.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>Dalimss News</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${new Date(article.createdAt).toISOString()}</news:publication_date>
        <news:title>${xmlEscape(article.title)}</news:title>
      </news:news>
    </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=300, stale-while-revalidate=600"
  );
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default NewsSitemap;
