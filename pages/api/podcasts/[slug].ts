import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

const EDITOR_EMAILS = new Set([
  "admin@dalimss.com",
  "sushantgaurav@dalimss.com",
  "dalimsssushant@gmail.com",
]);

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
      return res.status(404).json({ error: "Episode not found" });
    }
    return res.status(200).json(episode);
  }

  if (req.method !== "DELETE") {
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

  try {
    const episode = await prisma.podcastEpisode.findUnique({
      where: { slug },
      select: { coverImage: true, audioUrl: true, videoUrl: true },
    });
    if (!episode) {
      return res.status(404).json({ error: "Episode not found" });
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
    return res.status(500).json({ error: "Unable to delete this episode" });
  }
}
