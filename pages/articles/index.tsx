// FRONTEND PAGE — Articles Listing
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
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 px-4 py-10 bg-white text-black">

      {/* LEFT SIDEBAR */}
      <div className="hidden md:block md:col-span-3 space-y-6">
        <h2 className="text-xl font-semibold mb-3">Latest News</h2>

        {articles.slice(1, 6).map((a) => (
          <div key={a.id} className="border-b border-gray-300 pb-4">
            <p className="text-sm font-semibold text-red-600">News</p>

            <Link href={`/articles/${a.slug}`}>
              <p className="text-black hover:underline">{a.title}</p>
            </Link>

            <p className="text-xs text-gray-500">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN COLUMN */}
      <div className="md:col-span-6 space-y-6">
        <h1 className="text-3xl font-bold mb-4">All Articles</h1>

        {articles.map((a) => (
          <div
            key={a.id}
            className="border border-gray-300 p-5 rounded-xl bg-white hover:border-black transition"
          >
            <Link href={`/articles/${a.slug}`}>
              <p className="text-xl font-semibold mb-1">{a.title}</p>
            </Link>

            <p className="text-xs text-gray-500 mb-3">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>

            {a.mediaUrl && (
              <img
                src={a.mediaUrl}
                className="w-full h-56 object-cover rounded-lg"
                alt=""
              />
            )}
          </div>
        ))}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden md:block md:col-span-3 space-y-6">
        <h2 className="text-xl font-semibold">Featured Media</h2>

        {articles.slice(6, 12).map((a) => (
          <div key={a.id} className="space-y-2">
            {a.mediaUrl && (
              <img
                src={a.mediaUrl}
                className="w-full h-40 object-cover rounded-lg"
                alt=""
              />
            )}

            <Link href={`/articles/${a.slug}`}>
              <p className="text-black text-sm hover:underline">{a.title}</p>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
}

// Fetch articles
export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const apiUrl = `${baseUrl}/api/articles`;

  const res = await fetch(apiUrl);
  const articles = await res.json();

  return { props: { articles } };
};
