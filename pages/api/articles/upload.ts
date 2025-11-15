import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
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

  const form = formidable({ multiples: false });

  form.parse(req, async (err, _fields, files) => {
    if (err) {
      console.error("❌ Upload parse error:", err);
      return res.status(500).json({ error: "Error parsing file" });
    }

    const uploaded = files.file;
    if (!uploaded) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    try {
      const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
        folder: "dalimss-news",
        resource_type: "auto",
      });

      return res.status(200).json({ url: uploadResponse.secure_url });
    } catch (uploadErr) {
      console.error("❌ Cloudinary upload failed:", uploadErr);
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  });
}
