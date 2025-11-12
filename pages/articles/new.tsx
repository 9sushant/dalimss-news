import React, { useState } from "react";
import { useRouter } from "next/router";

const NewArticle: React.FC = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  const [loading, setLoading] = useState(false);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setMediaType(file.type.startsWith("video") ? "video" : "image");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedMediaUrl: string | null = null;
      let finalMediaType: "image" | "video" | null = null;

      // ✅ Upload media file (if any)
      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);

        const uploadResp = await fetch("/api/articles/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResp.ok) throw new Error("Image/Video Upload Failed");

        const uploadJson = await uploadResp.json();
        uploadedMediaUrl = uploadJson.url;
        finalMediaType = mediaType;
      }

      // ✅ Save article metadata to JSON (SQLite or DB later)
      const resp = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          mediaUrl: uploadedMediaUrl,
          mediaType: finalMediaType,
        }),
      });

      if (!resp.ok) throw new Error("Failed to publish article");

      const article = await resp.json();
      router.push(`/articles/${article.slug}`);
    } catch (err) {
      console.error("❌ Publish error:", err);
      alert("Error while publishing article.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-semibold mb-6">Create New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          placeholder="Title..."
          className="w-full p-3 rounded bg-slate-900 border border-slate-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write markdown content..."
          rows={15}
          className="w-full p-3 rounded bg-slate-900 border border-slate-700 font-serif"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* Upload button */}
        <label className="flex items-center justify-center w-60 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl cursor-pointer transition-all">
          <span className="text-sm font-semibold text-blue-300">📤 Upload Image / Video</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleMediaSelect}
          />
        </label>

        {/* Preview media */}
        {mediaPreview && (
          <div className="mt-4">
            {mediaType === "image" ? (
              <img src={mediaPreview} className="rounded max-h-64" />
            ) : (
              <video src={mediaPreview} controls className="rounded max-h-64" />
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded text-white mt-4"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default NewArticle;
