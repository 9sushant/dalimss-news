import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check authentication
    const session = await getSession({ req });
    
    if (!session || (session.user as any)?.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: "Missing course ID" });
    }

    // Delete course (cascade will delete modules, lessons, enrollments, and user progress)
    await (prisma as any).course.delete({
      where: { id: parseInt(courseId) },
    });

    console.log("Course deleted:", courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      error: "Failed to delete course",
      details: error.message,
    });
  }
}
