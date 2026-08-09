const CHUNK_SIZE_BYTES = 64 * 1024 * 1024;
const MAX_CHUNK_ATTEMPTS = 5;

interface MuxVideoResult {
  assetId: string;
  videoUrl: string;
  duration: number | null;
}

function uploadChunk(
  uploadUrl: string,
  file: File,
  start: number,
  end: number,
  onProgress: (uploadedBytes: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", uploadUrl);
    request.setRequestHeader(
      "Content-Range",
      `bytes ${start}-${end - 1}/${file.size}`
    );
    request.setRequestHeader(
      "Content-Type",
      file.type || "application/octet-stream"
    );
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(start + event.loaded);
    };
    request.onload = () => {
      if ([200, 201, 308].includes(request.status)) {
        onProgress(end);
        resolve();
      } else {
        reject(new Error(`Video upload failed with status ${request.status}.`));
      }
    };
    request.onerror = () =>
      reject(new Error("The video upload connection was interrupted."));
    request.onabort = () => reject(new Error("The video upload was cancelled."));
    request.send(file.slice(start, end));
  });
}

async function uploadChunkWithRetry(
  uploadUrl: string,
  file: File,
  start: number,
  end: number,
  onProgress: (uploadedBytes: number) => void
) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_CHUNK_ATTEMPTS; attempt += 1) {
    try {
      await uploadChunk(uploadUrl, file, start, end, onProgress);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_CHUNK_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  throw lastError;
}

export async function uploadVideoToMux(
  uploadUrl: string,
  file: File,
  onProgress: (percentage: number) => void
) {
  for (let start = 0; start < file.size; start += CHUNK_SIZE_BYTES) {
    const end = Math.min(start + CHUNK_SIZE_BYTES, file.size);
    await uploadChunkWithRetry(uploadUrl, file, start, end, (uploadedBytes) => {
      onProgress(Math.min(100, (uploadedBytes / file.size) * 100));
    });
  }
}

export async function waitForMuxVideo(
  query: { uploadId?: string; assetId?: string },
  onStatus?: () => void
): Promise<MuxVideoResult> {
  const startedAt = Date.now();
  const timeoutMs = 6 * 60 * 60 * 1000;

  while (Date.now() - startedAt < timeoutMs) {
    const params = new URLSearchParams();
    if (query.uploadId) params.set("uploadId", query.uploadId);
    if (query.assetId) params.set("assetId", query.assetId);
    const response = await fetch(`/api/podcasts/mux?${params}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to check video processing");
    }
    if (data.status === "errored") {
      throw new Error(data.error || "Mux could not process this video.");
    }
    if (data.status === "ready" && data.assetId && data.videoUrl) {
      return {
        assetId: data.assetId,
        videoUrl: data.videoUrl,
        duration: typeof data.duration === "number" ? data.duration : null,
      };
    }
    onStatus?.();
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error(
    "Video processing is taking longer than expected. Please try again later."
  );
}
