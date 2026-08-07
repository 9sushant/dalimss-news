import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { submitIndexNow } from "@/lib/indexnow";
import { SITE_URL } from "@/lib/seo";
import { normalizeOttContentType } from "@/lib/podcasts";
import { authOptions } from "../auth/[...nextauth]";

const EDITOR_EMAILS = new Set([
  "admin@dalimss.com",
  "sushantgaurav@dalimss.com",
  "dalimsssushant@gmail.com",
]);

function isValidPublicUrl(value: unknown) {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = String(req.query.slug || "");

  if (req.method === "GET") {
    const episode = await prisma.podcastEpisode.findUnique({
      where: { slug },
    });
    if (!episode || !episode.published) {
      return res.status(404).json({ error: "OTT release not found" });
    }
    return res.status(200).json(episode);
  }

  if (req.method !== "PUT" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  const role = session?.user?.role;
  const email = session?.user?.email || "";
  const isAuthorized =
    role === "admin" || role === "editor" || EDITOR_EMAILS.has(email);

  if (!isAuthorized) {
    return res.status(403).json({ error: "Editors only" });
  }

  if (req.method === "PUT") {
    const {
      title,
      description,
      showName,
      hostName,
      guestNames,
      category,
      language,
      seasonNumber,
      episodeNumber,
      duration,
      coverImage,
      audioUrl,
      videoUrl,
      mediaBytes,
      mediaMimeType,
      mediaType,
      contentType,
      explicit,
      featured,
    } = req.body;

    if (typeof title !== "string" || title.trim().length < 3) {
      return res.status(400).json({ error: "A valid OTT title is required" });
    }
    if (typeof description !== "string" || description.trim().length < 30) {
      return res
        .status(400)
        .json({ error: "Add a description of at least 30 characters" });
    }
    if (typeof hostName !== "string" || hostName.trim().length < 2) {
      return res.status(400).json({ error: "Host name is required" });
    }
    if (!isValidPublicUrl(coverImage)) {
      return res.status(400).json({ error: "A valid cover image is required" });
    }

    const selectedMediaUrl = mediaType === "video" ? videoUrl : audioUrl;
    if (!isValidPublicUrl(selectedMediaUrl)) {
      return res
        .status(400)
        .json({ error: "A valid uploaded media file is required" });
    }

    try {
      const currentEpisode = await prisma.podcastEpisode.findUnique({
        where: { slug },
        select: { coverImage: true, audioUrl: true, videoUrl: true },
      });
      if (!currentEpisode) {
        return res.status(404).json({ error: "OTT release not found" });
      }

      const episode = await prisma.podcastEpisode.update({
        where: { slug },
        data: {
          title: title.trim(),
          description: description.trim(),
          showName:
            typeof showName === "string" && showName.trim()
              ? showName.trim()
              : "Dalimss News OTT",
          hostName: hostName.trim(),
          guestNames:
            typeof guestNames === "string" && guestNames.trim()
              ? guestNames.trim()
              : null,
          category:
            typeof category === "string" && category.trim()
              ? category.trim()
              : null,
          language:
            typeof language === "string" && language.trim()
              ? language.trim()
              : "Hindi",
          seasonNumber:
            Number.isInteger(Number(seasonNumber)) && Number(seasonNumber) > 0
              ? Number(seasonNumber)
              : null,
          episodeNumber:
            Number.isInteger(Number(episodeNumber)) && Number(episodeNumber) > 0
              ? Number(episodeNumber)
              : null,
          duration:
            Number.isFinite(Number(duration)) && Number(duration) > 0
              ? Math.round(Number(duration))
              : null,
          coverImage,
          audioUrl: mediaType === "audio" ? audioUrl : null,
          videoUrl: mediaType === "video" ? videoUrl : null,
          mediaBytes:
            Number.isFinite(Number(mediaBytes)) && Number(mediaBytes) > 0
              ? String(Math.round(Number(mediaBytes)))
              : null,
          mediaMimeType:
            typeof mediaMimeType === "string" && mediaMimeType.includes("/")
              ? mediaMimeType
              : null,
          mediaType: mediaType === "video" ? "video" : "audio",
          contentType: normalizeOttContentType(contentType),
          explicit: Boolean(explicit),
          featured: Boolean(featured),
        },
      });

      const retainedUrls = new Set([
        episode.coverImage,
        episode.audioUrl,
        episode.videoUrl,
      ]);
      const replacedUrls = [
        currentEpisode.coverImage,
        currentEpisode.audioUrl,
        currentEpisode.videoUrl,
      ].filter(
        (url): url is string => Boolean(url) && !retainedUrls.has(url)
      );
      if (replacedUrls.length > 0) {
        try {
          await del(replacedUrls);
        } catch (blobError) {
          console.warn("Podcast updated but old Blob cleanup failed:", blobError);
        }
      }

      await submitIndexNow([`${SITE_URL}/ott/${episode.slug}`]);
      return res.status(200).json(episode);
    } catch (error) {
      console.error("Podcast update failed:", error);
      return res.status(500).json({ error: "Unable to save this OTT release" });
    }
  }

  try {
    const episode = await prisma.podcastEpisode.findUnique({
      where: { slug },
      select: { coverImage: true, audioUrl: true, videoUrl: true },
    });
    if (!episode) {
      return res.status(404).json({ error: "OTT release not found" });
    }

    await prisma.podcastEpisode.delete({ where: { slug } });
    const mediaUrls = [
      episode.coverImage,
      episode.audioUrl,
      episode.videoUrl,
    ].filter((url): url is string => Boolean(url));
    try {
      await del(mediaUrls);
    } catch (blobError) {
      console.warn("Podcast deleted but Blob cleanup failed:", blobError);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Podcast delete failed:", error);
    return res.status(500).json({ error: "Unable to delete this OTT release" });
  }
}
