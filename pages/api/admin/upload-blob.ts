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
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Only allow admins
  const isAdmin =
    (session.user as any).role === "admin" ||
    (session.user as any).role === "editor" ||
    session.user.email === "admin@dalimss.com" ||
    session.user.email === "sushantgaurav@dalimss.com" ||
    session.user.email === "dalimsssushant@gmail.com";

  if (!isAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const form = formidable({
    multiples: false,
    maxFileSize: 500 * 1024 * 1024, // 500MB for course videos
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Upload parse error:", err);
      if (err.code === "LIMIT_FILE_SIZE" || err.message?.includes("maxFileSize")) {
        return res.status(400).json({ error: "File too large. Maximum size is 500MB." });
      }
      return res.status(500).json({ error: "Error parsing file: " + err.message });
    }

    const uploaded = files.file;
    if (!uploaded) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
    const folder = Array.isArray(fields.folder) ? fields.folder[0] : fields.folder || "courses";

    try {
      const fileBuffer = fs.readFileSync(file.filepath);

      const ext = file.originalFilename?.split(".").pop() || "bin";
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const blob = await put(filename, fileBuffer, {
        access: "public",
        contentType: file.mimetype || undefined,
      });

      console.log("✅ Admin upload success:", blob.url);

      // Return extra info for video uploads
      return res.status(200).json({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
      });
    } catch (uploadErr: any) {
      console.error("❌ Vercel Blob upload failed:", uploadErr);
      return res.status(500).json({
        error: uploadErr.message || "Upload failed",
      });
    }
  });
}
