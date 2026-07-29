import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import { getCategoryBySlug, getCategoryByDbValue } from "@/lib/categories";
import { articleUrl, submitIndexNow } from "@/lib/indexnow";
import { createUniqueArticleSlug } from "@/lib/articleSlugs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ----------- CREATE ARTICLE (POST) -----------
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { role, email } = session.user;
    const isAuthorized = role === "admin" || role === "editor" || email === "admin@dalimss.com" || email === "sushantgaurav@dalimss.com" || email === "dalimsssushant@gmail.com";

    if (!isAuthorized) {
       return res.status(403).json({ error: "Forbidden: Admins or Editors only" });
    }

    const { title, content, mediaUrl, mediaType, mediaItems, category, customAuthor, metaTitle, metaDescription, focusKeyword, tags, imageAltText, slug, sourceUrl } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({ error: "Content is too short" });
    }

    try {
      const finalSlug = await createUniqueArticleSlug(slug || title);

      const article = await prisma.article.create({
        data: {
          title,
          content,
          slug: finalSlug,
          sourceUrl,
          mediaUrl,
          mediaType,
          mediaItems: mediaItems || undefined,
          category, // ✅ Added Category
          customAuthor, // ✅ Added Custom Author
          metaTitle,
          metaDescription,
          focusKeyword,
          tags,
          imageAltText,
          readTimeInMinutes: Math.max(1, Math.ceil(content.length / 500)), // 🔥 FIXED required field
          authorId: session.user.id ?? null,
        },
      });

      await submitIndexNow([articleUrl(article.slug)]);

      return res.status(200).json(article);
    } catch (err) {
      console.error("Create failed:", err);
      return res.status(500).json({ error: "Create failed" });
    }
  }

  // ----------- GET ALL ARTICLES -----------
  const { category, search, page, limit } = req.query;
  const where: any = {};

  if (category) {
    const matchedCategory = getCategoryBySlug(String(category)) || getCategoryByDbValue(String(category));
    if (matchedCategory) {
      where.OR = matchedCategory.dbValues.map((val) => ({
        category: { contains: val, mode: "insensitive" as const },
      }));
    } else {
      where.category = {
        contains: String(category),
        mode: "insensitive" as const,
      };
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } }, 
      { content: { contains: String(search), mode: 'insensitive' } },
      { focusKeyword: { contains: String(search), mode: 'insensitive' } },
      { metaTitle: { contains: String(search), mode: 'insensitive' } },
      { metaDescription: { contains: String(search), mode: 'insensitive' } },
      { category: { contains: String(search), mode: 'insensitive' } },
      { customAuthor: { contains: String(search), mode: 'insensitive' } },
      { author: { name: { contains: String(search), mode: 'insensitive' } } },
    ];
  }

  // Pagination logic
  const pageInt = parseInt(page as string) || 1;
  const limitInt = parseInt(limit as string); 
  
  const queryOptions: any = {
    where,
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" } // Tie-breaker for stable pagination
    ],
  };

  if (limitInt) {
    queryOptions.take = limitInt;
    queryOptions.skip = (pageInt - 1) * limitInt;
  }

  console.log(`Fetching articles: page=${pageInt}, limit=${limitInt}, skip=${queryOptions.skip}, take=${queryOptions.take}`);

  const articles = await prisma.article.findMany(queryOptions);

  return res.json(articles);
}
