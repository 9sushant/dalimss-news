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

    const {
      title,
      description,
      shortDesc,
      instructor,
      price,
      duration,
      level,
      language,
      highlights,
      requirements,
      whatYouLearn,
    } = req.body;

    if (!title || !description || !price || !duration || !level) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create course
    const course = await (prisma as any).course.create({
      data: {
        slug,
        title,
        description,
        shortDesc: shortDesc || description.substring(0, 150) + '...',
        instructor: instructor || "Dalimss Academy",
        price: parseFloat(price),
        duration,
        level,
        language: language || "English",
        students: 0,
        rating: 0,
        highlights: JSON.stringify(highlights || []),
        requirements: JSON.stringify(requirements || []),
        whatYouLearn: JSON.stringify(whatYouLearn || []),
      },
    });

    console.log("Course created:", course.id);

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    console.error("Create course error:", error);
    return res.status(500).json({
      error: "Failed to create course",
      details: error.message,
    });
  }
}
