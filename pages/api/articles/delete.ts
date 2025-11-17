import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, force } = req.body || req.query;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  // Allow force delete WITHOUT ADMIN (temporary)
  if (!force) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
  }

  try {
    await prisma.article.delete({
      where: { slug: String(slug) }
    });

    return res.json({ success: true, deleted: slug });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed", details: err });
  }
}
