import type { NextApiRequest, NextApiResponse } from "next";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { MAX_OTT_MEDIA_SIZE_BYTES } from "@/lib/ottUpload";
import { authOptions } from "../auth/[...nextauth]";

const EDITOR_EMAILS = new Set([
  "admin@dalimss.com",
  "sushantgaurav@dalimss.com",
  "dalimsssushant@gmail.com",
]);

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

  if (!isAuthorized) {
    return res.status(403).json({ error: "Editors only" });
  }

  try {
    const jsonResponse = await handleUpload({
      request: req,
      body: req.body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("dalimss-podcasts/")) {
          throw new Error("Invalid upload destination");
        }

        const payload = clientPayload
          ? (JSON.parse(clientPayload) as { kind?: string })
          : {};
        const isCover = payload.kind === "cover";

        return {
          allowedContentTypes: isCover
            ? ["image/jpeg", "image/png", "image/webp", "image/avif"]
            : [
                "audio/mpeg",
                "audio/mp4",
                "audio/x-m4a",
                "audio/wav",
                "audio/ogg",
                "video/mp4",
                "video/quicktime",
                "video/webm",
              ],
          maximumSizeInBytes: isCover
            ? 10 * 1024 * 1024
            : MAX_OTT_MEDIA_SIZE_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 31 * 24 * 60 * 60,
          tokenPayload: JSON.stringify({
            kind: isCover ? "cover" : "episode",
            editorId: session?.user?.id || null,
          }),
        };
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Podcast upload authorization failed:", error);
    return res.status(400).json({
      error:
        error instanceof Error ? error.message : "Unable to authorize upload",
    });
  }
}
