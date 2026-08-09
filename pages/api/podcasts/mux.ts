import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import {
  createMuxAssetFromUrl,
  createMuxDirectUpload,
  getMuxAsset,
  getMuxDirectUpload,
  getMuxPlaybackUrl,
  getPublicMuxPlaybackId,
  type MuxAsset,
} from "@/lib/mux";
import { SITE_URL } from "@/lib/seo";
import { authOptions } from "../auth/[...nextauth]";

const EDITOR_EMAILS = new Set([
  "admin@dalimss.com",
  "sushantgaurav@dalimss.com",
  "dalimsssushant@gmail.com",
]);

function isImportableBlobUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

function serializeAsset(asset: MuxAsset) {
  const playbackId = getPublicMuxPlaybackId(asset);
  const failed = asset.status === "errored";
  return {
    status: failed
      ? "errored"
      : asset.status === "ready"
        ? "ready"
        : "processing",
    assetId: asset.id,
    playbackId: playbackId || null,
    videoUrl: playbackId ? getMuxPlaybackUrl(playbackId) : null,
    duration: Number.isFinite(asset.duration)
      ? Math.round(asset.duration!)
      : null,
    error: failed
      ? asset.errors?.messages?.join(" ") || "Mux could not process this video."
      : null,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
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

  try {
    if (req.method === "POST") {
      if (req.body?.action === "import") {
        if (!isImportableBlobUrl(req.body.sourceUrl)) {
          return res
            .status(400)
            .json({ error: "A valid Vercel Blob video URL is required" });
        }
        const asset = await createMuxAssetFromUrl(req.body.sourceUrl);
        return res.status(201).json(serializeAsset(asset));
      }

      const requestOrigin =
        typeof req.headers.origin === "string" ? req.headers.origin : SITE_URL;
      const upload = await createMuxDirectUpload(requestOrigin);
      return res.status(201).json({ uploadId: upload.id, uploadUrl: upload.url });
    }

    const uploadId =
      typeof req.query.uploadId === "string" ? req.query.uploadId : "";
    let assetId =
      typeof req.query.assetId === "string" ? req.query.assetId : "";

    if (uploadId) {
      const upload = await getMuxDirectUpload(uploadId);
      if (upload.status === "errored" || upload.status === "timed_out") {
        return res.status(200).json({
          status: "errored",
          error: upload.error?.message || "Mux video upload failed.",
        });
      }
      assetId = upload.asset_id || "";
      if (!assetId) {
        return res.status(200).json({ status: "processing" });
      }
    }

    if (!assetId) {
      return res.status(400).json({ error: "An uploadId or assetId is required" });
    }

    const asset = await getMuxAsset(assetId);
    return res.status(200).json(serializeAsset(asset));
  } catch (error) {
    console.error("Mux video request failed:", error);
    return res.status(502).json({
      error: error instanceof Error ? error.message : "Mux video request failed",
    });
  }
}
