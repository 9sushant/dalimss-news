import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import prisma from "../../../lib/prisma";

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
}

interface Props {
  article: Article | null;
}

const EditArticle: React.FC<Props> = ({ article }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState(article?.title || "");
  const [content, setContent] = useState(article?.content || "");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(article?.mediaUrl || null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(article?.mediaType || null);
  const [loading, setLoading] = useState(false);

  // 🟡 1. Handle loading and auth states INSIDE the component
  if (status === "loading") {
    return <p className="text-center mt-10 text-gray-900">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="text-center text-gray-900 mt-20">
        <p>You must be logged in to edit an article.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 px-6 py-2 rounded mt-4 text-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!article) {
      return <div className="text-center mt-20 text-gray-900">Article not found.</div>;
  }

  // 🟢 2. If logged in, show the form
  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!title || title.trim().length < 3) {
      alert("Please enter a title BEFORE uploading media.");
      e.target.value = "";
      return;
    }
  
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
      let uploadedMediaUrl: string | null = article.mediaUrl || null;
      let finalMediaType: "image" | "video" | null = article.mediaType || null;

      // ✅ Upload media (if exists)
      if (mediaFile) {
        const formData = new FormData();
        formData.append("file", mediaFile);

        const uploadResp = await fetch("/api/articles/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResp.ok) throw new Error("Upload failed");
        const uploadJson = await uploadResp.json();
        uploadedMediaUrl = uploadJson.url;
        finalMediaType = mediaType;
      }

      // ✅ Update article
      const resp = await fetch("/api/articles/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: article.slug,
          title,
          content,
          mediaUrl: uploadedMediaUrl,
          mediaType: finalMediaType,
        }),
      });

      if (!resp.ok) throw new Error("Failed to update article");
      const updatedArticle = await resp.json();

      router.push(`/articles/${updatedArticle.slug}`);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Error while updating article. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-900">
      <h1 className="text-3xl font-semibold mb-6">Edit Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title..."
          className="w-full p-3 rounded bg-white border border-gray-300 text-gray-900"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Write markdown content..."
          rows={15}
          className="w-full p-3 rounded bg-white border border-gray-300 font-serif text-gray-900"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* Upload */}
        <label className="flex items-center justify-center w-60 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl cursor-pointer transition-all">
          <span className="text-sm font-semibold text-blue-600">
            📤 Change Image / Video
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleMediaSelect}
          />
        </label>

        {mediaPreview && (
          <div className="mt-4">
            {mediaType === "image" ? (
              <img src={mediaPreview} className="rounded max-h-64" alt="preview" />
            ) : (
              <video src={mediaPreview} controls className="rounded max-h-64" />
            )}
          </div>
        )}

        <div className="flex gap-4">
            <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 px-6 py-2 rounded text-white mt-4 hover:bg-blue-700"
            >
            {loading ? "Updating..." : "Update Article"}
            </button>
            <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-500 px-6 py-2 rounded text-white mt-4 hover:bg-gray-600"
            >
                Cancel
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const slug = String(params?.slug || "");
  
    const article = await prisma.article.findUnique({
      where: { slug },
    });
  
    return {
      props: {
        article: article ? JSON.parse(JSON.stringify(article)) : null,
      },
    };
  };
