import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Required for formidable to handle file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

  form.parse(req, (err, _fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Upload error", error: err });
    }

    // ✅ Important fix for TypeScript
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `/uploads/${(file as File).newFilename}`;

    return res.status(200).json({
      message: "Upload successful",
      url: fileUrl,
    });
  });
}
