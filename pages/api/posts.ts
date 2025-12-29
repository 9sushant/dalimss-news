
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Validations
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check for Secret Key Authentication
  const secret = req.headers["x-api-key"] || req.query.key;
  // NOTE: User must set PIPELINE_SECRET in .env
  if (secret !== process.env.PIPELINE_SECRET) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }

  const { title, content, category, author, source_url, image_url, image_type } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Missing title or content" });
  }

  try {
    // Generate slug
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now();

    // Determine basic logic for media type if not provided
    let mediaType = image_type || "image";
    if (image_url && !image_type) {
        if (image_url.includes("youtube") || image_url.includes("mp4")) {
            mediaType = "video";
        }
    }

    // Create Article
    const article = await prisma.article.create({
      data: {
        title,
        content,
        slug,
        category: category || "General News",
        sourceUrl: source_url,
        mediaUrl: image_url,
        mediaType: mediaType,
        customAuthor: author || "AI News Bot",
        readTimeInMinutes: Math.max(1, Math.ceil(content.length / 500)),
        // We do not link authorId here, relying on customAuthor for display 
        // if the frontend supports it.
      },
    });

    return res.status(200).json({ success: true, article });
  } catch (error) {
    console.error("Pipeline Publish Error:", error);
    return res.status(500).json({ error: "Internal Server Error", details: (error as any).message });
  }
}
