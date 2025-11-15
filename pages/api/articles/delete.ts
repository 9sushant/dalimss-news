import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get logged-in user session
  const session = await getServerSession(req, res, authOptions);

  // IMPORTANT: FULL TYPE-SAFE CHECK
  if (!session || !session.user || (session.user as any).role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Missing article ID" });
  }

  try {
    await prisma.article.delete({
      where: { id: Number(id) },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE FAILED:", err);
    return res.status(500).json({ error: "Delete failed", details: err });
  }
}
