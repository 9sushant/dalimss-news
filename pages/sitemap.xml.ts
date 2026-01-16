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
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>${baseUrl}/?category=Varanasi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
         <loc>${baseUrl}/?category=Uttar%20Pradesh</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>daily</changefreq>
         <priority>0.8</priority>
      </url>
       <url>
         <loc>${baseUrl}/?category=Education</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>daily</changefreq>
         <priority>0.8</priority>
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
              <changefreq>weekly</changefreq>
              <priority>0.7</priority>
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
