import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

interface StoryPageInput {
  imageUrl: string;
  imageFile: File | null;
  heading: string;
  text: string;
}

export default function CreateStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pages, setPages] = useState<StoryPageInput[]>([
    { imageUrl: "", imageFile: null, heading: "", text: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to create stories.</p>
      </div>
    );
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/articles/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const handlePageFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const updated = [...pages];
      updated[index].imageFile = file;
      updated[index].imageUrl = URL.createObjectURL(file);
      setPages(updated);
    }
  };

  const addPage = () => {
    setPages([...pages, { imageUrl: "", imageFile: null, heading: "", text: "" }]);
  };

  const removePage = (index: number) => {
    if (pages.length > 1) {
      setPages(pages.filter((_, i) => i !== index));
    }
  };

  const updatePage = (index: number, field: "heading" | "text", value: string) => {
    const updated = [...pages];
    updated[index][field] = value;
    setPages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title) {
      setError("Please enter a title.");
      setLoading(false);
      return;
    }

    if (!coverFile && !coverImage) {
      setError("Please upload a cover image.");
      setLoading(false);
      return;
    }

    if (pages.some(p => !p.imageFile && !p.imageUrl)) {
      setError("Please upload an image for each page.");
      setLoading(false);
      return;
    }

    try {
      // Upload cover image
      setUploadProgress("Uploading cover image...");
      let finalCoverUrl = coverImage;
      if (coverFile) {
        finalCoverUrl = await uploadImage(coverFile);
      }

      // Upload page images
      const uploadedPages = [];
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        setUploadProgress(`Uploading page ${i + 1} of ${pages.length}...`);
        
        let pageImageUrl = page.imageUrl;
        if (page.imageFile) {
          pageImageUrl = await uploadImage(page.imageFile);
        }

        uploadedPages.push({
          imageUrl: pageImageUrl,
          heading: page.heading,
          text: page.text,
        });
      }

      // Create story
      setUploadProgress("Creating story...");
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          coverImage: finalCoverUrl, 
          pages: uploadedPages 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create story");
      }

      const story = await res.json();
      router.push(`/stories/${story.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Web Story</h1>
          <Link href="/" className="text-red-600 hover:underline">← Back</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}

          {uploadProgress && (
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {uploadProgress}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 bg-gray-50 transition-colors">
              {coverImage ? (
                <img src={coverImage} alt="Cover preview" className="h-full w-full object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Click to upload cover image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFileChange}
              />
            </label>
          </div>

          {/* Story Pages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Story Pages</label>
              <button
                type="button"
                onClick={addPage}
                className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-red-700 font-medium"
              >
                + Add Page
              </button>
            </div>

            <div className="space-y-4">
              {pages.map((page, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-600">Page {idx + 1}</span>
                    {pages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePage(idx)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Page Image Upload */}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 bg-white transition-colors">
                      {page.imageUrl ? (
                        <img src={page.imageUrl} alt="" className="h-full w-full object-cover rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <p className="text-xs text-gray-500 mt-1">Upload page image</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePageFileChange(idx, e)}
                      />
                    </label>

                    <input
                      type="text"
                      value={page.heading}
                      onChange={(e) => updatePage(idx, "heading", e.target.value)}
                      placeholder="Heading (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <textarea
                      value={page.text}
                      onChange={(e) => updatePage(idx, "text", e.target.value)}
                      placeholder="Description text (optional)"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Story"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
