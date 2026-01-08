import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  // GET all stories
  if (req.method === "GET") {
    const stories = await (prisma as any).webStory.findMany({
      where: { published: true },
      include: { pages: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    });
    return res.json(stories);
  }

  // POST create new story
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { role, email } = session.user;
    const isAuthorized = role === "admin" || role === "editor" || email === "admin@dalimss.com" || email === "sushantgaurav@dalimss.com" || email === "dalimsssushant@gmail.com";

    if (!isAuthorized) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { title, coverImage, pages } = req.body;

    if (!title || !coverImage || !pages || pages.length === 0) {
      return res.status(400).json({ error: "Title, cover image, and at least one page are required" });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + "-" + Date.now();

    const story = await (prisma as any).webStory.create({
      data: {
        title,
        slug,
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

    return res.status(201).json(story);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
