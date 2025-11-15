import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    const deleted = await prisma.article.delete({
      where: { slug: String(slug) },
    });

    return res.status(200).json({ success: true, deleted });
  } catch (err: any) {
    console.error("DELETE ERROR:", err);
    return res.status(500).json({
      error: "Delete failed",
      details: err.message || err,
    });
  }
}
