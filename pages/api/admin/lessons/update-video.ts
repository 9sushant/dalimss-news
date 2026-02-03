import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
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
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || (session.user as any)?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { lessonId, videoUrl, duration } = req.body;

    if (!lessonId || !videoUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Update lesson
    const lesson = await (prisma as any).lesson.update({
      where: { id: parseInt(lessonId) },
      data: {
        videoUrl,
        duration: duration ? parseInt(duration) : null,
      },
    });

    console.log("Lesson video updated:", lesson.id);

    return res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error: any) {
    console.error("Update lesson error:", error);
    return res.status(500).json({
      error: "Failed to update lesson",
      details: error.message,
    });
  }
}
