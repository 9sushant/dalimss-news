import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = "https://dalimss.news";

  const articles = await prisma.article.findMany({
    select: {
      slug: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stories = await prisma.webStory.findMany({
      select: {
          slug: true,
          updatedAt: true,
      },
      orderBy: {
          updatedAt: "desc"
      }
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/varanasi-news</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/articles</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>0.9</priority>
      </url>
      ${stories
        .map((story) => {
            return `
            <url>
                <loc>${baseUrl}/stories/${story.slug}</loc>
                <lastmod>${new Date(story.updatedAt).toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.9</priority>
            </url>
            `;
        })
        .join("")}
      ${articles
        .map((article) => {
          return `
            <url>
              <loc>${baseUrl}/articles/${article.slug}</loc>
              <lastmod>${new Date(article.createdAt).toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.9</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
