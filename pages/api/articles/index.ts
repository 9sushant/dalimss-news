// pages/api/articles/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(articles);
    }

    if (req.method === "POST") {
      const { title, content, mediaUrl, mediaType } = req.body || {};

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content required" });
      }

      const baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const article = await prisma.article.create({
        data: {
          slug,
          title,
          content,
          mediaUrl,
          mediaType,
          readTimeInMinutes: Math.max(
            1,
            Math.round(content.split(/\s+/).length / 200)
          ),
        },
      });

      return res.status(201).json(article);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });

  } catch (error: any) {
    console.error("🔥 API ERROR (/api/articles):", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
