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

  const { slug, title, content, mediaUrl, mediaType, customAuthor } = req.body;

  if (!slug || !title || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Generate new slug if title changed (optional, but good practice if you want URLs to match titles)
    // For now, let's keep the slug stable to avoid broken links unless explicitly requested, 
    // OR we can just update the other fields. 
    // Let's just update the other fields for now to keep it simple.

    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title,
        content,
        mediaUrl,
        mediaType,
        customAuthor,
      },
    });

    return res.status(200).json(updatedArticle);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
