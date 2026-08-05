import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });
import SeoEditor from "@/components/SeoEditor";
import { CATEGORIES } from "@/lib/categories";
import { signIn, useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import prisma from "../../../lib/prisma";
import { compressImage } from "@/utils/compressImage";
import {
  editorTextToSources,
  normalizeArticleSources,
  sourcesToEditorText,
} from "@/lib/articleSources";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  mediaUrl?: string | null;
  mediaType?: "image" | "video" | null;
  mediaItems?: MediaItem[] | null;
  customAuthor?: string | null;
  category?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  reportingBasis?: string | null;
  language?: string | null;
  sourceUrls?: unknown;
  imageCaption?: string | null;
}

interface Props {
  article: Article | null;
}

const EditArticle: React.FC<Props> = ({ article }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [slugEdited, setSlugEdited] = useState(false);
  const [content, setContent] = useState(article?.content || "");
  const [customAuthor, setCustomAuthor] = useState(article?.customAuthor || "");
  const getInitialCategories = (): string[] => {
    if (!article?.category) return ["India"];
    return article.category.split(",").map(c => c.trim()).filter(Boolean);
  };
  const [selectedCategories, setSelectedCategories] = useState<string[]>(getInitialCategories());
  const [sourceUrl, setSourceUrl] = useState((article as any)?.sourceUrl || "");
  const [sourceLinks, setSourceLinks] = useState(
    sourcesToEditorText(article?.sourceUrls)
  );
  const [reportingBasis, setReportingBasis] = useState(
    article?.reportingBasis || ""
  );
  const [language, setLanguage] = useState<"en" | "hi">(
    article?.language === "hi" ? "hi" : "en"
  );
  const [seoData, setSeoData] = useState({
    metaTitle: article?.metaTitle || "",
    metaDescription: article?.metaDescription || "",
    focusKeyword: article?.focusKeyword || "",
    tags: (article as any)?.tags || "",
    imageAltText: (article as any)?.imageAltText || "",
    imageCaption: article?.imageCaption || "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Initialize media items from existing data
  const getInitialMediaItems = (): MediaItem[] => {
    if (article?.mediaItems && Array.isArray(article.mediaItems) && article.mediaItems.length > 0) {
      return article.mediaItems;
    }
    // Fallback: use legacy single mediaUrl
    if (article?.mediaUrl) {
      return [{ url: article.mediaUrl, type: article.mediaType || "image" }];
    }
    return [];
  };

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(getInitialMediaItems());
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string; type: "image" | "video" }[]>([]);

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

  const handleMediaSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!title || title.trim().length < 3) {
      alert("Please enter a title BEFORE uploading media.");
      e.target.value = "";
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setCompressing(true);
    const newEntries: { file: File; preview: string; type: "image" | "video" }[] = [];

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

    setNewFiles((prev) => [...prev, ...newEntries]);
    setCompressing(false);
    e.target.value = "";
  };

  const removeExistingMedia = (index: number) => {
    setMediaItems((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce publication constraints: Title, content, customAuthor, media, metaDescription
    if (!title.trim() || title.trim().length < 3) {
      alert("Please provide a valid article title (at least 3 characters).");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      alert("Please provide valid article content.");
      return;
    }
    if (!customAuthor.trim()) {
      alert("Please provide the author name.");
      return;
    }
    if (reportingBasis.trim().length < 30) {
      alert(
        "Please describe the specific reporting basis (at least 30 characters). Name the document, interview, location, data, or response used."
      );
      return;
    }
    const totalMediaItems = mediaItems.length + newFiles.length;
    if (totalMediaItems === 0) {
      alert("Please upload at least one image or video for the article.");
      return;
    }
    if (seoData.metaDescription.trim().length < 50) {
      alert("Please provide a plain-language editorial summary of at least 50 characters.");
      return;
    }
    const leadMediaType =
      mediaItems[0]?.type || newFiles[0]?.type || article.mediaType;
    if (leadMediaType === "image" && !seoData.imageAltText.trim()) {
      alert("Please provide descriptive alt text for the lead image.");
      return;
    }
    const sourceLineCount = sourceLinks
      .split("\n")
      .filter((line) => line.trim()).length;
    const parsedSources = editorTextToSources(sourceLinks);
    if (
      sourceLineCount > 0 &&
      (parsedSources.length !== sourceLineCount ||
        normalizeArticleSources(parsedSources).length !== parsedSources.length)
    ) {
      alert(
        "Each additional source must use: descriptive label | complete HTTP(S) URL."
      );
      return;
    }
    if (leadMediaType === "image" && !seoData.imageCaption.trim()) {
      alert("Please provide a factual caption for the lead image.");
      return;
    }

    setLoading(true);

    try {
      // Upload all new files
      const uploadedNewItems: MediaItem[] = [];

      if (newFiles.length > 0) {
        setUploadingMedia(true);
        for (const entry of newFiles) {
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
          uploadedNewItems.push({ url: uploadResult.url, type: entry.type });
          console.log("✅ Media uploaded:", uploadResult.url);
        }
        setUploadingMedia(false);
      }

      // Combine existing + newly uploaded
      const allMediaItems = [...mediaItems, ...uploadedNewItems];

      // For backward compatibility, set primary mediaUrl/mediaType
      const primaryMedia = allMediaItems[0] || null;

      const resp = await fetch("/api/articles/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: article.slug,
          title,
          content,
          mediaUrl: primaryMedia?.url || null,
          mediaType: primaryMedia?.type || null,
          mediaItems: allMediaItems,
          customAuthor,
          category: selectedCategories.join(", "),
          sourceUrl,
          sourceUrls: parsedSources,
          reportingBasis,
          language,
          newSlug: slugEdited ? slug : undefined,
          ...seoData,
        }),
      });

      const respText = await resp.text();
      let updatedData;
      try { updatedData = JSON.parse(respText); } catch {
        if (resp.status === 413) throw new Error("Article content is too large. Please shorten the content or remove embedded media.");
        throw new Error(`Server error (${resp.status}): ${respText.slice(0, 100)}`);
      }

      if (!resp.ok) {
        throw new Error(updatedData.error || "Failed to update article");
      }

      router.push(`/articles/${updatedData.slug}`);
    } catch (err: any) {
      console.error("❌ Update error:", err);
      alert(err.message || "Error while updating article.");
    } finally {
      setLoading(false);
      setUploadingMedia(false);
    }
  };

  const totalMedia = mediaItems.length + newFiles.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-900">
      <h1 className="text-3xl font-semibold mb-6">Edit Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Title..."
          className="w-full p-3 rounded bg-white border border-gray-300 text-gray-900 font-bold text-xl"
          value={title}
          onChange={(e) => {
             setTitle(e.target.value);
             if (!slugEdited) {
               setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
             }
          }}
          required
        />

        <div className="flex flex-col sm:flex-row gap-4">
           <div className="flex-1">
             <label className="block text-sm text-gray-600 mb-1">URL Slug</label>
             <input
               type="text"
               placeholder="custom-url-slug"
               className="w-full p-2 rounded bg-gray-50 border border-gray-300 text-gray-900"
               value={slug}
               onChange={(e) => {
                 setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                 setSlugEdited(true);
               }}
               required
             />
           </div>
           <div className="flex-1">
             <label className="block text-sm text-gray-600 mb-1">Primary Source URL (Optional)</label>
             <input
               type="url"
               placeholder="Official order, statement, notice or document URL"
               className="w-full p-2 rounded bg-gray-50 border border-gray-300 text-gray-900"
               value={sourceUrl}
               onChange={(e) => setSourceUrl(e.target.value)}
             />
             <p className="mt-1 text-xs text-gray-500">
               Add government notices, court records, police statements, press
               releases or other primary material when available.
             </p>
           </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Additional source links (Optional)
          </label>
          <textarea
            className="w-full min-h-28 p-3 rounded bg-white border border-gray-300 text-gray-900"
            value={sourceLinks}
            onChange={(e) => setSourceLinks(e.target.value)}
            placeholder={"Official statement | https://example.gov/statement\nInstitutional notification | https://example.edu/notice"}
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter one source per line as: descriptive label | complete URL.
          </p>
        </div>

        <input
          type="text"
          placeholder="Author Name"
          className="w-full p-3 rounded bg-white border border-gray-300 text-gray-900"
          value={customAuthor}
          onChange={(e) => setCustomAuthor(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Reporting basis
          </label>
          <textarea
            className="w-full min-h-28 p-3 rounded bg-white border border-gray-300 text-gray-900"
            value={reportingBasis}
            onChange={(e) => setReportingBasis(e.target.value)}
            placeholder="Name the official document, interview, reporting location, data, or response used for this report."
            minLength={30}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Describe what Dalimss News independently reviewed, observed or
            verified. Include names, designations, dates and contact attempts
            where relevant.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Article language
          </label>
          <select
            className="w-full p-3 rounded bg-white border border-gray-300 text-gray-900"
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            required
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            This controls the language declared in article structured data and
            the Google News sitemap.
          </p>
        </div>

        {/* Category Multi-Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Categories (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.name);
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      if (selectedCategories.length > 1) {
                        setSelectedCategories(selectedCategories.filter((c) => c !== cat.name));
                      } else {
                        alert("An article must belong to at least one category.");
                      }
                    } else {
                      setSelectedCategories([...selectedCategories, cat.name]);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    isSelected
                      ? "bg-red-600 border-red-600 text-white shadow-sm scale-105"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write your article content here..."
        />

        {/* Media Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Media ({totalMedia} {totalMedia === 1 ? "file" : "files"})
            </h3>
            <label className="flex items-center justify-center px-5 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer transition-all">
              <span className="text-sm font-semibold text-blue-600">
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
            <p className="text-sm text-yellow-600 animate-pulse">
              🗜️ Compressing images...
            </p>
          )}

          {/* Existing media grid */}
          {(mediaItems.length > 0 || newFiles.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Existing uploaded media */}
              {mediaItems.map((item, index) => (
                <div key={`existing-${index}`} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {item.type === "image" ? (
                    <img src={item.url} className="w-full h-40 object-cover" alt={`media-${index}`} />
                  ) : (
                    <video src={item.url} className="w-full h-40 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                  <button
                    type="button"
                    onClick={() => removeExistingMedia(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                    {item.type === "video" ? "🎬 Video" : "📷 Image"}
                  </div>
                </div>
              ))}

              {/* New files (not yet uploaded) */}
              {newFiles.map((entry, index) => (
                <div key={`new-${index}`} className="relative group rounded-lg overflow-hidden border-2 border-dashed border-blue-300 bg-blue-50">
                  {entry.type === "image" ? (
                    <img src={entry.preview} className="w-full h-40 object-cover" alt={`new-${index}`} />
                  ) : (
                    <video src={entry.preview} className="w-full h-40 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="Remove"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600/80 text-white text-xs px-2 py-1">
                    {entry.type === "video" ? "🎬 New Video" : "📷 New Image"} (pending upload)
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalMedia === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400">
              <p className="text-lg mb-1">No media attached</p>
              <p className="text-sm">Click &quot;+ Add Photos / Videos&quot; to upload</p>
            </div>
          )}
        </div>

        <SeoEditor 
            title={title} 
            description={content}
            articleSlug={article.slug}
            initialMetaTitle={article.metaTitle}
            initialMetaDescription={article.metaDescription}
            initialFocusKeyword={article.focusKeyword}
            initialTags={(article as any)?.tags}
            initialImageAltText={(article as any)?.imageAltText}
            initialImageCaption={article.imageCaption}
            onUpdate={setSeoData}
        />

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 px-6 py-2 rounded text-white mt-4 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? uploadingMedia
                ? "Uploading media..."
                : "Updating..."
              : "Update Article"}
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
