import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { articleUrl, submitIndexNow } from "@/lib/indexnow";
import { createUniqueArticleSlug } from "@/lib/articleSlugs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { slug, newSlug, title, content, mediaUrl, mediaType, mediaItems, customAuthor, category, metaTitle, metaDescription, focusKeyword, tags, imageAltText, sourceUrl, reportingBasis, language } = req.body;

  if (!slug || !title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!reportingBasis || reportingBasis.trim().length < 30) {
    return res.status(400).json({
      error:
        "A specific reporting basis is required (official document, interview, on-ground reporting, data or named statement).",
    });
  }

  if (!["en", "hi"].includes(language)) {
    return res.status(400).json({ error: "Article language must be English or Hindi" });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { authorId: true, slug: true },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const user = session.user as any;
    if (article.authorId !== user.id && user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: You do not own this article" });
    }

    const finalSlug = newSlug
      ? await createUniqueArticleSlug(newSlug, { ignoreSlug: article.slug })
      : undefined;

    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title,
        content,
        slug: finalSlug,
        sourceUrl: sourceUrl || null,
        reportingBasis: reportingBasis.trim(),
        language,
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

    await submitIndexNow([articleUrl(article.slug), articleUrl(updatedArticle.slug)]);

    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
