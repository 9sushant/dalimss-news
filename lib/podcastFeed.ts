import prisma from "@/lib/prisma";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { cdata, xmlEscape } from "@/lib/xml";
import { formatDuration } from "@/lib/podcasts";

export async function buildPodcastFeed() {
  const episodes = await prisma.podcastEpisode.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 200,
  });

  const items = episodes
    .filter((episode) => episode.audioUrl || episode.videoUrl)
    .map((episode) => {
      const episodeUrl = `${SITE_URL}/ott/${episode.slug}`;
      const mediaUrl = episode.audioUrl || episode.videoUrl || "";
      const mediaType =
        episode.mediaMimeType ||
        (episode.mediaType === "video" ? "video/mp4" : "audio/mpeg");

      return `
    <item>
      <title>${xmlEscape(episode.title)}</title>
      <link>${episodeUrl}</link>
      <guid isPermaLink="true">${episodeUrl}</guid>
      <pubDate>${episode.publishedAt.toUTCString()}</pubDate>
      <description>${cdata(episode.description)}</description>
      <content:encoded>${cdata(`<p>${xmlEscape(episode.description)}</p>`)}</content:encoded>
      <enclosure url="${xmlEscape(mediaUrl)}" length="${xmlEscape(
        episode.mediaBytes || "0"
      )}" type="${xmlEscape(mediaType)}" />
      <itunes:title>${xmlEscape(episode.title)}</itunes:title>
      <itunes:author>${xmlEscape(episode.hostName)}</itunes:author>
      <itunes:summary>${cdata(episode.description)}</itunes:summary>
      <itunes:image href="${xmlEscape(episode.coverImage)}" />
      <itunes:duration>${
        episode.duration ? formatDuration(episode.duration) : "0:00"
      }</itunes:duration>
      <itunes:explicit>${episode.explicit ? "true" : "false"}</itunes:explicit>
      <itunes:episodeType>full</itunes:episodeType>
      ${
        episode.episodeNumber
          ? `<itunes:episode>${episode.episodeNumber}</itunes:episode>`
          : ""
      }
      ${
        episode.seasonNumber
          ? `<itunes:season>${episode.seasonNumber}</itunes:season>`
          : ""
      }
    </item>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title>Dalimss News Podcasts</title>
    <link>${SITE_URL}/ott</link>
    <description>Original interviews, explainers and on-ground stories from ${SITE_NAME}.</description>
    <language>hi-IN</language>
    <copyright>© ${new Date().getFullYear()} ${SITE_NAME}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/ott/feed.xml" rel="self" type="application/rss+xml" />
    <itunes:author>${SITE_NAME}</itunes:author>
    <itunes:summary>Original conversations, explainers and stories from Varanasi and beyond.</itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${SITE_URL}/logo-square.png" />
    <itunes:owner>
      <itunes:name>${SITE_NAME}</itunes:name>
      <itunes:email>dalimssnews@gmail.com</itunes:email>
    </itunes:owner>
    <itunes:category text="News">
      <itunes:category text="Daily News" />
    </itunes:category>
    ${items}
  </channel>
</rss>`;
}
