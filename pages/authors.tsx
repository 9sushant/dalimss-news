import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import { authorSlug } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Author {
  name: string;
  articleCount: number;
}

interface AuthorsProps {
  authors: Author[];
}

export default function Authors({ authors }: AuthorsProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Head>
        <title>Authors & Reporters | Dalimss News</title>
        <meta
          name="description"
          content="Meet the editorial team, reporters, and authors behind Dalimss News. Explore their published articles and coverage beats."
        />
        <link rel="canonical" href="https://dalimss.news/authors" />
      </Head>

      <Nav />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Our Authors & Reporters</h1>
        
        <p className="text-lg text-gray-700 mb-10 leading-relaxed">
          Dalimss News is powered by a dedicated team of journalists, reporters, and editors committed to bringing you accurate, fast, and verified news. Meet the team that drives our Varanasi-born, India-focused reporting.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authors.map((author) => (
            <Link
              key={author.name}
              href={`/author/${authorSlug(author.name)}`}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {author.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Reporter / Editor
              </p>
              <div className="text-blue-600 font-medium text-sm">
                View {author.articleCount} published article{author.articleCount !== 1 ? 's' : ''} &rarr;
              </div>
            </Link>
          ))}
          {authors.length === 0 && (
            <p className="text-gray-500">No authors found.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const articles = await prisma.article.findMany({
    select: {
      customAuthor: true,
    },
    where: {
      customAuthor: { not: null, notIn: [""] },
    },
  });

  const authorCounts: Record<string, number> = {};
  articles.forEach((a) => {
    if (a.customAuthor && a.customAuthor.trim()) {
      const name = a.customAuthor.trim();
      authorCounts[name] = (authorCounts[name] || 0) + 1;
    }
  });

  const authorsList = Object.entries(authorCounts).map(([name, count]) => ({
    name,
    articleCount: count,
  })).sort((a, b) => b.articleCount - a.articleCount);

  return {
    props: {
      authors: authorsList,
    },
  };
};
