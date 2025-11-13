// pages/api/articles/upload.ts

import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma"; // ✅ import prisma client

export const config = {
  api: {
    bodyParser: false, // Required for formidable to handle file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/public/uploads");

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filename: (_name, _ext, part) => {
      const timestamp = Date.now();
      const ext = path.extname(part.originalFilename || "");
      return `${timestamp}${ext}`;
    },
  });

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Upload error", error: err });
    }

    // ✅ Ensure correct file extraction for TypeScript
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${(file as File).newFilename}`; // ✅ URL used in frontend

    try {
      // ✅ Save file path to database (Article table with only media field)
      const uploadedMedia = await prisma.article.create({
        data: {
          title: "Untitled Upload", // temporary placeholder (will edit article later)
          slug: Date.now().toString(),
          content: "",
          mediaUrl: fileUrl,
          mediaType: "image",
          readTimeInMinutes: 1,
        },
      });

      return res.status(200).json({
        message: "File uploaded and stored in DB",
        url: fileUrl,
        savedRecord: uploadedMedia,
      });
    } catch (dbError) {
      console.error("DB Save Error:", dbError);
      return res.status(500).json({ message: "Failed to save in DB", error: dbError });
    }
  });
}
