import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ---------------- POST (Create Article) ----------------
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, content, mediaUrl, mediaType } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: "Content is too short" });
    }

    try {
      const slug =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "") +
        "-" +
        Date.now();

      const article = await prisma.article.create({
        data: {
          title,
          content,
          slug,
          mediaUrl,
          mediaType,
          authorId: (session.user as any).id ?? null,
        },
      });

      return res.status(200).json(article);

    } catch (err) {
      console.error("Create failed:", err);
      return res.status(500).json({ error: "Create failed" });
    }
  }

  // ---------------- GET ARTICLES ----------------
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
  });

  return res.json(articles);
}
