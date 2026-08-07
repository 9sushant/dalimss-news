import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { createUniquePodcastSlug } from "@/lib/podcastSlugs";
import { normalizeOttContentType } from "@/lib/podcasts";
import { submitIndexNow } from "@/lib/indexnow";
import { SITE_URL } from "@/lib/seo";
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
  if (req.method === "GET") {
    const episodes = await prisma.podcastEpisode.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return res.status(200).json(episodes);
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  const role = session?.user?.role;
  const email = session?.user?.email || "";
  const isAuthorized =
    role === "admin" || role === "editor" || EDITOR_EMAILS.has(email);

  if (!session?.user || !isAuthorized) {
    return res.status(403).json({ error: "Editors only" });
  }

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
  if (
    typeof description !== "string" ||
    description.trim().length < 30
  ) {
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
    const slug = await createUniquePodcastSlug(title);
    const episode = await prisma.podcastEpisode.create({
      data: {
        slug,
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
        authorId: session.user.id || null,
      },
    });

    await submitIndexNow([`${SITE_URL}/ott/${episode.slug}`]);

    return res.status(201).json(episode);
  } catch (error) {
    console.error("Podcast create failed:", error);
    return res.status(500).json({ error: "Unable to publish this OTT release" });
  }
}
