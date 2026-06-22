import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import slugify from "slugify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { slug, newSlug, title, content, mediaUrl, mediaType, mediaItems, customAuthor, category, metaTitle, metaDescription, focusKeyword, tags, imageAltText, sourceUrl } = req.body;

  if (!slug || !title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { authorId: true },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const user = session.user as any;
    if (article.authorId !== user.id && user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: You do not own this article" });
    }

      const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title,
        content,
        slug: newSlug || undefined,
        sourceUrl: sourceUrl || null,
        mediaUrl,
        mediaType,
        mediaItems: mediaItems || undefined,
        customAuthor,
        category: category || undefined,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        focusKeyword: focusKeyword || null,
        tags: tags || null,
        imageAltText: imageAltText || null,
      },
    });

    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
