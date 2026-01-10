import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// This API generates a signature for direct browser-to-Cloudinary upload
// This bypasses Vercel's 4.5MB body size limit
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Generate signature for direct upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: "dalimss-news",
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: "dalimss-news",
    });
  } catch (err: any) {
    console.error("❌ Signature generation failed:", err);
    return res.status(500).json({ error: "Failed to generate upload signature" });
  }
}
