import React from "react";
import Link from "next/link";
import { Article } from "../types";

interface HomeProps {
  articles?: Article[];
}

const HomePage: React.FC<HomeProps> = ({ articles = [] }) => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 px-4 py-8">

      {/* LEFT SIDEBAR */}
      <div className="hidden md:block md:col-span-3 space-y-6">
        {articles.slice(1, 5).map((a) => (
          <div key={a.id} className="border-b border-slate-700 pb-4">
            <p className="text-sm font-semibold text-red-500">News</p>
            <Link href={`/articles/${a.slug}`}>
              <p className="text-white font-medium hover:underline">{a.title}</p>
            </Link>
          </div>
        ))}
      </div>

      {/* MAIN CENTER FEATURE */}
      <div className="md:col-span-6 space-y-6">
        {articles.length > 0 ? (
          <div>
            {/* HERO MAIN ARTICLE */}
            <Link href={`/articles/${articles[0].slug}`}>
              <div className="cursor-pointer">
                {articles[0].mediaUrl && (
                  <img
                    src={articles[0].mediaUrl}
                    className="w-full h-72 object-cover rounded-lg"
                    alt=""
                  />
                )}
                <h1 className="mt-4 text-3xl font-bold text-white leading-snug">
                  {articles[0].title}
                </h1>
              </div>
            </Link>

            {/* More Articles */}
            <div className="mt-6 space-y-6">
              {articles.slice(1, 6).map((a) => (
                <div key={a.id} className="flex gap-4 border-b border-slate-700 pb-4">
                  {a.mediaUrl && (
                    <img
                      src={a.mediaUrl}
                      className="w-32 h-24 rounded object-cover"
                      alt=""
                    />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-red-500">News</p>
                    <Link href={`/articles/${a.slug}`}>
                      <p className="text-white font-medium hover:underline">
                        {a.title}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 px-4 text-white">
            <h3 className="mt-4 text-2xl font-semibold">Your feed is empty</h3>
            <p className="mt-2 text-slate-400">
              Be the first to publish a story on NextGen News.
            </p>
            <Link
              href="/articles/new"
              className="mt-6 inline-block bg-blue-600 px-5 py-2.5 rounded-full text-white hover:bg-blue-700"
            >
              Start Writing
            </Link>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="hidden md:block md:col-span-3 space-y-6">
        <h2 className="text-xl font-semibold text-white">Featured Videos</h2>

        {articles.slice(6, 10).map((a) => (
          <div key={a.id} className="space-y-2">
            {a.mediaUrl && (
              <img
                src={a.mediaUrl}
                className="w-full h-40 rounded object-cover"
                alt=""
              />
            )}
            <Link href={`/articles/${a.slug}`}>
              <p className="text-white font-medium hover:underline">{a.title}</p>
            </Link>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HomePage;
