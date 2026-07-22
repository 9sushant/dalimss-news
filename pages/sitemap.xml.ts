// pages/sitemap.xml.ts
// Comprehensive sitemap including all indexable pages

import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { CATEGORIES } from "@/lib/categories";
import { authorSlug } from "@/lib/seo";

const Sitemap = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = "https://dalimss.news";
  const now = new Date().toISOString();

  // Fetch all articles
  const articles = await prisma.article.findMany({
    select: {
      slug: true,
      createdAt: true,
      updatedAt: true,
      category: true,
      customAuthor: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch web stories
  const stories = await prisma.webStory.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Collect unique authors
  const authorSet = new Set<string>();
  articles.forEach((a) => {
    if (a.customAuthor && a.customAuthor.trim()) {
      authorSet.add(a.customAuthor.trim());
    }
  });

  // Static/trust pages
  const staticPages = [
    { path: "", priority: "1.0", freq: "hourly" },
    { path: "/articles", priority: "0.9", freq: "hourly" },
    { path: "/about", priority: "0.5", freq: "monthly" },
    { path: "/contact", priority: "0.5", freq: "monthly" },
    { path: "/privacy-policy", priority: "0.3", freq: "monthly" },
    { path: "/editorial-policy", priority: "0.5", freq: "monthly" },
    { path: "/corrections-policy", priority: "0.5", freq: "monthly" },
    { path: "/authors", priority: "0.5", freq: "weekly" },
    { path: "/terms-and-conditions", priority: "0.3", freq: "monthly" },
    { path: "/advertise-with-us", priority: "0.3", freq: "monthly" },
    { path: "/varanasi-news", priority: "0.9", freq: "hourly" },
    { path: "/gurgaon-news", priority: "0.9", freq: "hourly" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map(
          (page) => `
      <url>
        <loc>${baseUrl}${page.path}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>${page.freq}</changefreq>
        <priority>${page.priority}</priority>
      </url>`
        )
        .join("")}
      ${CATEGORIES.map(
        (cat) => `
      <url>
        <loc>${baseUrl}/category/${cat.slug}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>hourly</changefreq>
        <priority>${cat.priority}</priority>
      </url>`
      ).join("")}
      ${Array.from(authorSet)
        .map(
          (name) => `
      <url>
        <loc>${baseUrl}/author/${authorSlug(name)}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
      </url>`
        )
        .join("")}
      ${stories
        .map(
          (story) => `
      <url>
        <loc>${baseUrl}/stories/${story.slug}</loc>
        <lastmod>${new Date(story.updatedAt).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>`
        )
        .join("")}
      ${articles
        .map(
          (article) => `
      <url>
        <loc>${baseUrl}/articles/${article.slug}</loc>
        <lastmod>${new Date(article.updatedAt || article.createdAt).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>`
        )
        .join("")}
    </urlset>
  `;

  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=1200"
  );
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
