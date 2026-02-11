import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

// This API is kept for backward compatibility.
// With Vercel Blob, uploads go through /api/articles/upload directly.
// No signature is needed since Vercel Blob uses server-side auth via BLOB_READ_WRITE_TOKEN.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Return a simple auth confirmation - the actual upload now goes through /api/articles/upload
  return res.status(200).json({
    authorized: true,
    uploadEndpoint: "/api/articles/upload",
    message: "Upload files directly to /api/articles/upload. No signature needed with Vercel Blob.",
  });
}
