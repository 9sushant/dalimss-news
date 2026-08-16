import { upload } from "@vercel/blob/client";

export type ArticleMediaKind = "image" | "video";

function safeFilename(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "media";
}

export async function uploadArticleMedia(
  file: File,
  kind: ArticleMediaKind,
  onProgress?: (percentage: number) => void
) {
  const blob = await upload(
    `dalimss-news/articles/${kind}/${Date.now()}-${safeFilename(file.name)}`,
    file,
    {
      access: "public",
      handleUploadUrl: "/api/articles/blob-upload",
      clientPayload: JSON.stringify({ kind }),
      contentType: file.type,
      multipart: kind === "video",
      onUploadProgress: ({ percentage }) => onProgress?.(percentage),
    }
  );

  return blob.url;
}
