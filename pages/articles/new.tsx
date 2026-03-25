
import React, { useState } from "react";
import SeoEditor from "@/components/SeoEditor";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { compressImage } from "@/utils/compressImage";

interface MediaEntry {
  file: File;
  preview: string;
  type: "image" | "video";
}

const NewArticle: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaEntry[]>([]);
  const [category, setCategory] = useState("General");
  const [customAuthor, setCustomAuthor] = useState("");

  const [seoData, setSeoData] = useState({ metaTitle: "", metaDescription: "", focusKeyword: "" });
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [compressing, setCompressing] = useState(false);

  if (status === "loading") {
    return <p className="text-center mt-10 text-white">Loading...</p>;
  }

  if (!session) {
    return (
      <div className="text-center text-white mt-20">
        <p>You must be logged in to write an article.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 px-6 py-2 rounded mt-4"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!title || title.trim().length < 3) {
      alert("Please enter a title BEFORE uploading media.");
      e.target.value = "";
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setCompressing(true);
    const newEntries: MediaEntry[] = [];

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const isImage = file.type.startsWith("image");
      const isVideo = file.type.startsWith("video");

      if (!isImage && !isVideo) continue;

      // Auto-compress large images
      if (isImage && file.size > 500 * 1024) {
        try {
          file = await compressImage(file);
        } catch (err) {
          console.error("Compression failed, using original:", err);
        }
      }

      newEntries.push({
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? "video" : "image",
      });
    }

    setMediaFiles((prev) => [...prev, ...newEntries]);
    setCompressing(false);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload all media files
      const uploadedItems: { url: string; type: "image" | "video" }[] = [];

      if (mediaFiles.length > 0) {
        setUploadingMedia(true);
        for (const entry of mediaFiles) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", entry.file);

          const uploadResp = await fetch("/api/articles/upload", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResp.ok) {
            const text = await uploadResp.text();
            let errorMsg = "Upload failed";
            try { errorMsg = JSON.parse(text).error || errorMsg; } catch {}
            if (uploadResp.status === 413) errorMsg = "File is too large. Please compress or use a smaller image/video.";
            throw new Error(errorMsg);
          }

          const uploadResult = await uploadResp.json();
          uploadedItems.push({ url: uploadResult.url, type: entry.type });
          console.log("✅ Media uploaded:", uploadResult.url);
        }
        setUploadingMedia(false);
      }

      // Primary media for backward compatibility
      const primaryMedia = uploadedItems[0] || null;

      // Create article
      const resp = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          mediaUrl: primaryMedia?.url || null,
          mediaType: primaryMedia?.type || null,
          mediaItems: uploadedItems.length > 0 ? uploadedItems : undefined,
          category,
          customAuthor,
          ...seoData,
        }),
      });

      const respText = await resp.text();
      let articleData;
      try { articleData = JSON.parse(respText); } catch {
        if (resp.status === 413) throw new Error("Article content is too large. Please shorten the content or remove embedded media.");
        throw new Error(`Server error (${resp.status}): ${respText.slice(0, 100)}`);
      }

      if (!resp.ok) {
        throw new Error(articleData.error || "Failed to publish article");
      }

      router.push(`/articles/${articleData.slug}`);
    } catch (err: any) {
      console.error("❌ Publish error:", err);
      alert(err.message || "Error while publishing article.");
    } finally {
      setLoading(false);
      setUploadingMedia(false);
    }
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
        
        <input
          type="text"
          placeholder="Author Name (Optional)"
          className="w-full p-3 rounded bg-slate-900 border border-slate-700"
          value={customAuthor}
          onChange={(e) => setCustomAuthor(e.target.value)}
        />
        
        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded bg-slate-900 border border-slate-700 text-white"
        >
          <option value="General">General</option>
          <option value="Varanasi">Varanasi</option>
          <option value="India">India</option>
          <option value="Education">Education</option>
        </select>

        <textarea
          placeholder="Write markdown content..."
          rows={15}
          className="w-full p-3 rounded bg-slate-900 border border-slate-700 font-serif"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <p className="text-sm text-gray-400 mt-1">
          💡 <strong>Tip:</strong> To embed a <strong>YouTube video</strong> or <strong>Instagram Reel</strong>, simply paste the link on a new line!
        </p>

        {/* Media Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Media ({mediaFiles.length} {mediaFiles.length === 1 ? "file" : "files"})
            </h3>
            <label className="flex items-center justify-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl cursor-pointer transition-all">
              <span className="text-sm font-semibold text-blue-300">
                + Add Photos / Videos
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaSelect}
              />
            </label>
          </div>

          {compressing && (
            <p className="text-sm text-yellow-400 animate-pulse">
              🗜️ Compressing images...
            </p>
          )}

          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mediaFiles.map((entry, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-600 bg-slate-800">
                  {entry.type === "image" ? (
                    <img src={entry.preview} className="w-full h-40 object-cover" alt={`media-${index}`} />
                  ) : (
                    <video src={entry.preview} className="w-full h-40 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                    {entry.type === "video" ? "🎬 Video" : "📷 Image"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {mediaFiles.length === 0 && (
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center text-slate-400">
              <p className="text-lg mb-1">No media attached</p>
              <p className="text-sm">Click &quot;+ Add Photos / Videos&quot; to upload</p>
            </div>
          )}
        </div>

        <SeoEditor 
            title={title} 
            description={content}
            onUpdate={setSeoData}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded text-white mt-4 disabled:opacity-50"
        >
          {loading
            ? uploadingMedia
              ? "Uploading media..."
              : "Publishing..."
            : "Publish"}
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  const { getSession } = await import("next-auth/react");
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  
  // Admin Check
  const isAdmin = session.user?.role === "admin" || session.user?.role === "editor" || session.user?.email === "admin@dalimss.com" || session.user?.email === "sushantgaurav@dalimss.com" || session.user?.email === "dalimsssushant@gmail.com";

  if (!isAdmin) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default NewArticle;
