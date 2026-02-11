import type { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";
import formidable from "formidable";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Increase max file size to 100MB for videos
  const form = formidable({ 
    multiples: false,
    maxFileSize: 100 * 1024 * 1024, // 100MB
  });

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.error("❌ Upload parse error:", err);
      if (err.code === 'LIMIT_FILE_SIZE' || err.message?.includes('maxFileSize')) {
        return res.status(400).json({ error: "File too large. Maximum size is 100MB." });
      }
      return res.status(500).json({ error: "Error parsing file: " + err.message });
    }

    const uploaded = files.file;
    if (!uploaded) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    try {
      // Read the file into a buffer
      const fileBuffer = fs.readFileSync(file.filepath);
      
      // Generate a unique filename
      const ext = file.originalFilename?.split('.').pop() || 'bin';
      const filename = `dalimss-news/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      // Upload to Vercel Blob
      const blob = await put(filename, fileBuffer, {
        access: 'public',
        contentType: file.mimetype || undefined,
      });

      console.log("✅ Upload success:", blob.url);
      return res.status(200).json({ url: blob.url });
    } catch (uploadErr: any) {
      console.error("❌ Vercel Blob upload failed:", uploadErr);
      
      // Return more specific error messages
      let errorMessage = "Upload failed";
      if (uploadErr.message?.includes("File size too large")) {
        errorMessage = "Video file is too large. Try compressing it or use a shorter clip.";
      } else if (uploadErr.message?.includes("Invalid")) {
        errorMessage = "Invalid file format. Please use MP4, MOV, or common image formats.";
      } else {
        errorMessage = uploadErr.message || "Upload failed";
      }
      
      return res.status(500).json({ error: errorMessage });
    }
  });
}
