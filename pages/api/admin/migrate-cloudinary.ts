import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

/**
 * Admin-only migration endpoint.
 * Finds all articles & web stories still using Cloudinary URLs,
 * downloads each image, re-uploads to Vercel Blob, and updates the DB.
 *
 * Usage: POST /api/admin/migrate-cloudinary
 * Optional body: { "dryRun": true } to preview without making changes
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Auth check – admin only
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const isAdmin =
    (session.user as any).role === "admin" ||
    session.user.email === "admin@dalimss.com" ||
    session.user.email === "sushantgaurav@dalimss.com" ||
    session.user.email === "dalimsssushant@gmail.com";

  if (!isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  const dryRun = req.body?.dryRun === true;

  const results = {
    articles: { found: 0, migrated: 0, failed: [] as any[] },
    webStoryPages: { found: 0, migrated: 0, failed: [] as any[] },
    webStoryCovers: { found: 0, migrated: 0, failed: [] as any[] },
    dryRun,
  };

  try {
    // ─── 1. Migrate Article mediaUrls ───────────────────────────
    const articles = await prisma.article.findMany({
      where: {
        mediaUrl: { contains: "cloudinary" },
      },
      select: { id: true, title: true, mediaUrl: true },
    });

    results.articles.found = articles.length;

    for (const article of articles) {
      if (!article.mediaUrl) continue;

      try {
        if (dryRun) {
          results.articles.migrated++;
          continue;
        }

        const newUrl = await downloadAndReupload(article.mediaUrl, "dalimss-news");

        await prisma.article.update({
          where: { id: article.id },
          data: { mediaUrl: newUrl },
        });

        results.articles.migrated++;
        console.log(`✅ Article #${article.id} migrated: ${article.mediaUrl} → ${newUrl}`);
      } catch (err: any) {
        results.articles.failed.push({
          id: article.id,
          title: article.title,
          url: article.mediaUrl,
          error: err.message,
        });
        console.error(`❌ Article #${article.id} failed:`, err.message);
      }
    }

    // ─── 2. Migrate WebStory cover images ───────────────────────
    const webStories = await prisma.webStory.findMany({
      where: {
        coverImage: { contains: "cloudinary" },
      },
      select: { id: true, title: true, coverImage: true },
    });

    results.webStoryCovers.found = webStories.length;

    for (const story of webStories) {
      try {
        if (dryRun) {
          results.webStoryCovers.migrated++;
          continue;
        }

        const newUrl = await downloadAndReupload(story.coverImage, "web-stories");

        await prisma.webStory.update({
          where: { id: story.id },
          data: { coverImage: newUrl },
        });

        results.webStoryCovers.migrated++;
        console.log(`✅ WebStory #${story.id} cover migrated`);
      } catch (err: any) {
        results.webStoryCovers.failed.push({
          id: story.id,
          title: story.title,
          url: story.coverImage,
          error: err.message,
        });
      }
    }

    // ─── 3. Migrate WebStoryPage images ─────────────────────────
    const storyPages = await prisma.webStoryPage.findMany({
      where: {
        imageUrl: { contains: "cloudinary" },
      },
      select: { id: true, storyId: true, imageUrl: true },
    });

    results.webStoryPages.found = storyPages.length;

    for (const page of storyPages) {
      try {
        if (dryRun) {
          results.webStoryPages.migrated++;
          continue;
        }

        const newUrl = await downloadAndReupload(page.imageUrl, "web-stories");

        await prisma.webStoryPage.update({
          where: { id: page.id },
          data: { imageUrl: newUrl },
        });

        results.webStoryPages.migrated++;
        console.log(`✅ StoryPage #${page.id} migrated`);
      } catch (err: any) {
        results.webStoryPages.failed.push({
          id: page.id,
          storyId: page.storyId,
          url: page.imageUrl,
          error: err.message,
        });
      }
    }

    return res.status(200).json({
      message: dryRun ? "Dry run complete – no changes made" : "Migration complete",
      ...results,
    });
  } catch (err: any) {
    console.error("❌ Migration error:", err);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * Downloads an image from a URL and re-uploads it to Vercel Blob.
 */
async function downloadAndReupload(sourceUrl: string, folder: string): Promise<string> {
  // Download the image
  const response = await fetch(sourceUrl);

  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status} for ${sourceUrl}`);
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const buffer = Buffer.from(await response.arrayBuffer());

  // Determine extension from content type
  const extMap: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
  };
  const ext = extMap[contentType] || "png";

  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

  const blob = await put(filename, buffer, {
    access: "public",
    contentType,
  });

  return blob.url;
}
