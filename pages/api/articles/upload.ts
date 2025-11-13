import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "20mb",
  },
};

// ⭐ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = formidable({
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ message: "Form parse error" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // ⭐ Upload to Cloudinary
      const uploaded = await cloudinary.uploader.upload(file.filepath, {
        folder: "dalimss_news",
      });

      // ⭐ Save in DB if needed
      const saved = await prisma.article.create({
        data: {
          title: "Untitled Upload",
          slug: Date.now().toString(),
          content: "",
          mediaUrl: uploaded.secure_url,
          mediaType: uploaded.resource_type === "video" ? "video" : "image",
          readTimeInMinutes: 1,
        },
      });

      return res.status(200).json({
        message: "Uploaded successfully",
        url: uploaded.secure_url,
        savedRecord: saved,
      });
    } catch (uploadError) {
      console.error("Cloudinary Upload Error:", uploadError);
      return res.status(500).json({ message: "Upload failed" });
    }
  });
}
