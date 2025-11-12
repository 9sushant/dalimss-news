import Link from "next/link";
import { GetServerSideProps } from "next";

interface Article {
  id: number;
  title: string;
  createdAt: string;
}

interface Props {
  articles: Article[];
}

export default function AllArticles({ articles }: Props) {
  return (
    <div className="container mx-auto p-8 text-white">
      <h1 className="text-center text-4xl font-bold mb-10">All Articles</h1>

      {articles.length === 0 ? (
        <p className="text-center text-gray-400">No articles found.</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((a) => (
            <li key={a.id} className="p-4 bg-gray-900 rounded border border-gray-800 hover:border-blue-500">
              <Link href={`/articles/${a.id}`} className="text-xl font-semibold hover:text-blue-400">
                {a.title}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const apiUrl = `${baseUrl}/api/articles`;

  console.log("🔍 Calling:", apiUrl);

  const res = await fetch(apiUrl);
  const text = await res.text(); // Get raw text

  try {
    const articles = JSON.parse(text); // Try JSON
    return { props: { articles } };
  } catch (error) {
    console.error("❌ ERROR: API returned non-JSON:", text);
    return { props: { articles: [] } }; // Prevent crash
  }
};

