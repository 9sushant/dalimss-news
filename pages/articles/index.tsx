// pages/articles/index.tsx

import Link from "next/link";
import { GetServerSideProps } from "next";

interface Article {
  id: number;
  title: string;
  slug: string;
  mediaUrl?: string | null;
  createdAt: string;
}

interface Props {
  articles: Article[];
}

export default function AllArticlesPage({ articles }: Props) {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 px-4 py-10">

      {/* LEFT SIDEBAR */}
      <div className="hidden md:block md:col-span-3 space-y-6">
        {articles.slice(1, 5).map((a) => (
          <div key={a.id} className="border-b border-slate-700 pb-4">
            <p className="text-sm font-semibold text-red-500">News</p>
            <Link href={`/articles/${a.slug}`}>
              <p className="text-white hover:underline">{a.title}</p>
            </Link>
            <p className="text-xs text-gray-400">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN CENTER */}
      <div className="md:col-span-6 space-y-6">
        <h1 className="text-3xl font-bold text-white mb-4">All Articles</h1>

        {articles.map((a) => (
          <div
            key={a.id}
            className="border border-slate-700 p-5 rounded-xl bg-slate-900 cursor-pointer hover:border-blue-500 transition"
          >
            <Link href={`/articles/${a.slug}`}>
              <p className="text-xl font-semibold text-white mb-1">{a.title}</p>
            </Link>

            <p className="text-xs text-gray-400 mb-3">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>

            {a.mediaUrl && (
              <img
                src={a.mediaUrl}
                className="w-full h-56 object-cover rounded-lg"
                alt=""
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
        ))}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden md:block md:col-span-3 space-y-6">
        <h2 className="text-xl font-semibold text-white">Featured</h2>

        {articles.slice(6, 10).map((a) => (
          <div key={a.id} className="space-y-2">
            {a.mediaUrl && (
              <img
                src={a.mediaUrl}
                className="w-full h-40 object-cover rounded-lg"
                alt=""
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}

            <Link href={`/articles/${a.slug}`}>
              <p className="text-white text-sm hover:underline">{a.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


// FETCH ARTICLES (with filtering)
export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const apiUrl = `${baseUrl}/api/articles`;
  const res = await fetch(apiUrl);
  let articles = await res.json();

  // ✅ Remove corrupted articles
  articles = articles.filter(
    (a: Article) =>
      a.title &&
      a.slug &&
      a.mediaUrl &&                   // must have media
      typeof a.mediaUrl === "string" &&
      a.mediaUrl.startsWith("http")   // must be a valid URL
  );

  return { props: { articles } };
};
