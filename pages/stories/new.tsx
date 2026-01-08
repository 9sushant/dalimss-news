import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

interface StoryPageInput {
  imageUrl: string;
  heading: string;
  text: string;
}

export default function CreateStoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pages, setPages] = useState<StoryPageInput[]>([
    { imageUrl: "", heading: "", text: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const addPage = () => {
    setPages([...pages, { imageUrl: "", heading: "", text: "" }]);
  };

  const removePage = (index: number) => {
    if (pages.length > 1) {
      setPages(pages.filter((_, i) => i !== index));
    }
  };

  const updatePage = (index: number, field: keyof StoryPageInput, value: string) => {
    const updated = [...pages];
    updated[index][field] = value;
    setPages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title || !coverImage || pages.some(p => !p.imageUrl)) {
      setError("Please fill in title, cover image, and all page images.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, coverImage, pages }),
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

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900"
              required
            />
            {coverImage && (
              <img src={coverImage} alt="Cover preview" className="mt-2 h-32 object-cover rounded-lg" />
            )}
          </div>

          {/* Story Pages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Story Pages</label>
              <button
                type="button"
                onClick={addPage}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-gray-700"
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
                    <input
                      type="url"
                      value={page.imageUrl}
                      onChange={(e) => updatePage(idx, "imageUrl", e.target.value)}
                      placeholder="Image URL (required)"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900"
                      required
                    />
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
                    {page.imageUrl && (
                      <img src={page.imageUrl} alt="" className="h-24 object-cover rounded" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Story"}
          </button>
        </form>
      </div>
    </div>
  );
}
