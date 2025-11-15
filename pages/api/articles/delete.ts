import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, slug } = req.body;

    if (!id && !slug) {
      return res.status(400).json({ error: "Missing id or slug" });
    }

    const deleted = await prisma.article.deleteMany({
      where: {
        OR: [
          id ? { id: Number(id) } : {},
          slug ? { slug: String(slug) } : {},
        ],
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    return res.json({ success: true, deleted });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({ error: "Delete failed", details: err });
  }
}
