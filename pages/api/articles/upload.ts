import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
    const isVideo = file.mimetype?.startsWith("video/");

    try {
      // Upload to Cloudinary with extended timeout for videos
      const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
        folder: "dalimss-news",
        resource_type: "auto",
        timeout: 120000, // 2 minute timeout for large files
      });

      console.log("✅ Upload success:", uploadResponse.secure_url);
      return res.status(200).json({ url: uploadResponse.secure_url });
    } catch (uploadErr: any) {
      console.error("❌ Cloudinary upload failed:", uploadErr);
      
      // Return more specific error messages
      let errorMessage = "Upload failed";
      if (uploadErr.message?.includes("File size too large")) {
        errorMessage = "Video file is too large. Try compressing it or use a shorter clip.";
      } else if (uploadErr.message?.includes("Invalid")) {
        errorMessage = "Invalid file format. Please use MP4, MOV, or common image formats.";
      } else if (uploadErr.http_code === 401) {
        errorMessage = "Cloudinary authentication error. Please check API keys.";
      } else {
        errorMessage = uploadErr.message || "Cloudinary upload failed";
      }
      
      return res.status(500).json({ error: errorMessage });
    }
  });
}
