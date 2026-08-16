import type { NextApiRequest, NextApiResponse } from "next";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const EDITOR_EMAILS = new Set([
  "admin@dalimss.com",
  "sushantgaurav@dalimss.com",
  "dalimsssushant@gmail.com",
]);

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/mpeg",
  "video/x-msvideo",
  "video/x-m4v",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  const role = session?.user?.role;
  const email = session?.user?.email || "";
  const isAuthorized =
    role === "admin" || role === "editor" || EDITOR_EMAILS.has(email);

  if (!session?.user || !isAuthorized) {
    return res.status(403).json({ error: "Editors only" });
  }
  const editorId = session.user.id || null;

  try {
    const jsonResponse = await handleUpload({
      request: req,
      body: req.body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("dalimss-news/articles/")) {
          throw new Error("Invalid upload destination");
        }

        const payload = clientPayload
          ? (JSON.parse(clientPayload) as { kind?: string })
          : {};
        const kind = payload.kind;
        if (kind !== "image" && kind !== "video") {
          throw new Error("Invalid media type");
        }

        return {
          allowedContentTypes: kind === "image" ? IMAGE_TYPES : VIDEO_TYPES,
          maximumSizeInBytes:
            kind === "image" ? 10 * 1024 * 1024 : 2 * 1024 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 31 * 24 * 60 * 60,
          tokenPayload: JSON.stringify({
            kind,
            editorId,
          }),
        };
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Article Blob upload authorization failed:", error);
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "Unable to authorize upload",
    });
  }
}
