import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Missing slug" });
  }

  // GET single story
  if (req.method === "GET") {
    const story = await (prisma as any).webStory.findUnique({
      where: { slug },
      include: { pages: { orderBy: { order: "asc" } } },
    });

    if (!story) {
      return res.status(404).json({ error: "Story not found" });
    }

    return res.json(story);
  }

  // Auth check for PUT and DELETE
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { role, email } = session.user;
  const isAuthorized = role === "admin" || role === "editor" || email === "admin@dalimss.com" || email === "sushantgaurav@dalimss.com" || email === "dalimsssushant@gmail.com";

  if (!isAuthorized) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // PUT update story
  if (req.method === "PUT") {
    const { title, coverImage, pages } = req.body;

    try {
      // Delete existing pages
      await (prisma as any).webStoryPage.deleteMany({
        where: { story: { slug } },
      });

      // Update story with new pages
      const story = await (prisma as any).webStory.update({
        where: { slug },
        data: {
          title,
          coverImage,
          pages: {
            create: pages.map((page: any, idx: number) => ({
              imageUrl: page.imageUrl,
              heading: page.heading || null,
              text: page.text || null,
              order: idx,
            })),
          },
        },
        include: { pages: true },
      });

      return res.json(story);
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update story" });
    }
  }

  // DELETE story
  if (req.method === "DELETE") {
    try {
      await (prisma as any).webStory.delete({
        where: { slug },
      });

      return res.json({ success: true });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Failed to delete story" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
