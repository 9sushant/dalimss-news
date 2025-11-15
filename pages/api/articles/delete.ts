import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 🔐 Get logged-in user
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // 🔐 Check user role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== "admin") {
    return res.status(403).json({ error: "Access denied — Admins only" });
  }

  const { id } = req.body;

  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    await prisma.article.delete({ where: { id: Number(id) } });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed", details: err });
  }
}
