import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing article ID" });
  }

  try {
    await prisma.article.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed", details: err });
  }
}
