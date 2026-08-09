const MUX_API_BASE = "https://api.mux.com/video/v1";

interface MuxApiResponse<T> {
  data: T;
}

export interface MuxPlaybackId {
  id: string;
  policy: "public" | "signed" | "drm";
}

export interface MuxAsset {
  id: string;
  status: "preparing" | "ready" | "errored";
  duration?: number;
  playback_ids?: MuxPlaybackId[];
  errors?: { messages?: string[] };
}

interface MuxDirectUpload {
  id: string;
  url: string;
  status: "waiting" | "asset_created" | "errored" | "timed_out";
  asset_id?: string;
  error?: { message?: string };
}

function getMuxAuthorization() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error(
      "Mux is not configured. Add MUX_TOKEN_ID and MUX_TOKEN_SECRET."
    );
  }
  return `Basic ${Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64")}`;
}

async function muxRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${MUX_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: getMuxAuthorization(),
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      payload?.error?.messages?.join?.(" ") ||
      payload?.error?.message ||
      `Mux request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  const payload = (await response.json()) as MuxApiResponse<T>;
  return payload.data;
}

const assetSettings = {
  playback_policies: ["public"],
  video_quality: "basic",
  max_resolution_tier: "2160p",
} as const;

export function createMuxDirectUpload(corsOrigin: string) {
  return muxRequest<MuxDirectUpload>("/uploads", {
    method: "POST",
    body: JSON.stringify({
      new_asset_settings: assetSettings,
      cors_origin: corsOrigin,
    }),
  });
}

export function createMuxAssetFromUrl(sourceUrl: string) {
  return muxRequest<MuxAsset>("/assets", {
    method: "POST",
    body: JSON.stringify({
      inputs: [{ url: sourceUrl }],
      ...assetSettings,
    }),
  });
}

export function getMuxDirectUpload(uploadId: string) {
  return muxRequest<MuxDirectUpload>(`/uploads/${encodeURIComponent(uploadId)}`);
}

export function getMuxAsset(assetId: string) {
  return muxRequest<MuxAsset>(`/assets/${encodeURIComponent(assetId)}`);
}

export function deleteMuxAsset(assetId: string) {
  return muxRequest<void>(`/assets/${encodeURIComponent(assetId)}`, {
    method: "DELETE",
  });
}

export function getPublicMuxPlaybackId(asset: MuxAsset) {
  return asset.playback_ids?.find((playback) => playback.policy === "public")
    ?.id;
}

export function getMuxPlaybackUrl(playbackId: string) {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}
