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

export default function TOIStylePage({ articles }: Props) {
  const mainArticle = articles[0];
  const leftHeadlines = articles.slice(1, 6);
  const topStories = articles.slice(1, 10);
  const rightFeatured = articles.slice(6, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-12 gap-6">

      {/* LEFT COLUMN — SHORT HEADLINES */}
      <aside className="md:col-span-3 space-y-6">
        <h2 className="text-lg font-bold text-white mb-2 border-b border-slate-700 pb-2">
          Latest News
        </h2>

        {leftHeadlines.map((article) => (
          <div key={article.id} className="border-b border-slate-700 pb-4">
            <p className="text-red-400 text-xs font-bold">News</p>
            <Link href={`/articles/${article.slug}`}>
              <p className="text-white hover:underline text-sm leading-tight">
                {article.title}
              </p>
            </Link>
            <p className="text-gray-400 text-xs mt-1">
              {new Date(article.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </aside>

      {/* CENTER COLUMN — MAIN ARTICLE + TOP STORIES */}
      <main className="md:col-span-6 space-y-10">

        {/* MAIN BIG ARTICLE */}
        {mainArticle && (
          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
            {mainArticle.mediaUrl && (
              <img
                src={mainArticle.mediaUrl}
                className="w-full h-64 object-cover"
                alt=""
              />
            )}
            <div className="p-5">
              <Link href={`/articles/${mainArticle.slug}`}>
                <h1 className="text-2xl font-bold text-white hover:underline">
                  {mainArticle.title}
                </h1>
              </Link>
              <p className="text-gray-400 text-sm mt-2">
                {new Date(mainArticle.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {/* TOP STORIES LIST */}
        <h2 className="text-xl font-bold text-white mt-6">Top Stories</h2>

        <div className="space-y-6">
          {topStories.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700"
            >
              <div>
                <Link href={`/articles/${a.slug}`}>
                  <p className="text-lg font-semibold text-white hover:underline">
                    {a.title}
                  </p>
                </Link>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>

              {a.mediaUrl && (
                <img
                  src={a.mediaUrl}
                  className="w-full h-40 object-cover rounded-lg"
                  alt=""
                />
              )}
            </div>
          ))}
        </div>
      </main>

      {/* RIGHT COLUMN — FEATURED MEDIA */}
      <aside className="md:col-span-3 space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-slate-700 pb-2">
          Featured Media
        </h2>

        {rightFeatured.map((a) => (
          <div key={a.id} className="bg-slate-900 p-3 rounded-lg border border-slate-700">
            {a.mediaUrl && (
              <img
                src={a.mediaUrl}
                className="w-full h-36 object-cover rounded-md mb-2"
                alt=""
              />
            )}
            <Link href={`/articles/${a.slug}`}>
              <p className="text-sm text-white hover:underline">
                {a.title}
              </p>
            </Link>
          </div>
        ))}
      </aside>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/articles`);
  const articles = await res.json();

  return { props: { articles } };
};
