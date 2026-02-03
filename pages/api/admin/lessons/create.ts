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

    const { moduleId, title, description, duration, isFree, order } = req.body;

    if (!moduleId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get the current max order for this module
    const maxOrderLesson = await (prisma as any).lesson.findFirst({
      where: { moduleId: parseInt(moduleId) },
      orderBy: { order: 'desc' },
    });

    const nextOrder = order || (maxOrderLesson ? maxOrderLesson.order + 1 : 1);

    // Create lesson
    const lesson = await (prisma as any).lesson.create({
      data: {
        moduleId: parseInt(moduleId),
        title,
        description: description || null,
        duration: duration ? parseInt(duration) : null,
        isFree: isFree || false,
        order: nextOrder,
      },
    });

    console.log("Lesson created:", lesson.id);

    return res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error: any) {
    console.error("Create lesson error:", error);
    return res.status(500).json({
      error: "Failed to create lesson",
      details: error.message,
    });
  }
}
