import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check authentication
    const session = await getSession({ req });
    
    if (!session || (session.user as any)?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId, title, description, order } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get the current max order for this course
    const maxOrderModule = await (prisma as any).courseModule.findFirst({
      where: { courseId: parseInt(courseId) },
      orderBy: { order: 'desc' },
    });

    const nextOrder = order || (maxOrderModule ? maxOrderModule.order + 1 : 1);

    // Create module
    const module = await (prisma as any).courseModule.create({
      data: {
        courseId: parseInt(courseId),
        title,
        description: description || null,
        order: nextOrder,
      },
    });

    console.log("Module created:", module.id);

    return res.status(200).json({
      success: true,
      module,
    });
  } catch (error: any) {
    console.error("Create module error:", error);
    return res.status(500).json({
      error: "Failed to create module",
      details: error.message,
    });
  }
}
