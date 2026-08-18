import type { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { SITE_URL, absoluteImageUrl, absoluteUrl } from "@/lib/seo";
import { xmlEscape } from "@/lib/xml";

const VideoSitemap = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const episodes = await prisma.podcastEpisode.findMany({
    where: {
      published: true,
      mediaType: "video",
      videoUrl: { not: null },
    },
    select: {
      slug: true,
      title: true,
      description: true,
      coverImage: true,
      videoUrl: true,
      duration: true,
      publishedAt: true,
      updatedAt: true,
      explicit: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const urls = episodes
    .map((episode) => {
      const watchUrl = `${SITE_URL}/ott/${episode.slug}`;
      const contentUrl = absoluteUrl(episode.videoUrl);
      if (!contentUrl) return "";

      return `
  <url>
    <loc>${xmlEscape(watchUrl)}</loc>
    <lastmod>${new Date(episode.updatedAt).toISOString()}</lastmod>
    <video:video>
      <video:thumbnail_loc>${xmlEscape(absoluteImageUrl(episode.coverImage))}</video:thumbnail_loc>
      <video:title>${xmlEscape(episode.title)}</video:title>
      <video:description>${xmlEscape(episode.description.slice(0, 2048))}</video:description>
      <video:content_loc>${xmlEscape(contentUrl)}</video:content_loc>
      <video:publication_date>${new Date(episode.publishedAt).toISOString()}</video:publication_date>
      ${episode.duration ? `<video:duration>${Math.round(episode.duration)}</video:duration>` : ""}
      <video:family_friendly>${episode.explicit ? "no" : "yes"}</video:family_friendly>
    </video:video>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=1200"
  );
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default VideoSitemap;
