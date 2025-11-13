import React from "react";
import Link from "next/link";
import { Article } from "../types";

interface HomeProps {
  articles?: Article[];
}

export default function HomePage({ articles = [] }: HomeProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-40 text-white">
        <p>Your feed is empty.</p>
        <Link href="/articles/new" className="text-blue-400 underline">
          Start Writing
        </Link>
      </div>
    );
  }

  // Featured main story (center column big card)
  const mainArticle = articles[0];

  // Left column small list
  const leftArticles = articles.slice(1, 6);

  // Right column featured (e.g. videos)
  const rightArticles = articles.slice(6, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6">

      {/* LEFT COLUMN */}
      <div className="lg:col-span-3 space-y-6">
        {leftArticles.map((a) => (
          <Link key={a.id} href={`/articles/${a.slug}`} className="block">
            <div className="flex gap-4 border-b border-slate-700 pb-4">
              {a.mediaUrl && (
                <img
                  src={a.mediaUrl}
                  className="w-24 h-20 rounded object-cover"
                  alt=""
                />
              )}
              <div>
                <p className="text-sm font-semibold text-red-500">
                  {a.category || "News"}
                </p>
                <p className="text-sm text-white">{a.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CENTER MAIN ARTICLE */}
      <div className="lg:col-span-6">
        <Link href={`/articles/${mainArticle.slug}`}>
          <h1 className="text-3xl font-bold mb-4 text-white leading-tight hover:text-blue-300">
            {mainArticle.title}
          </h1>

          {mainArticle.mediaUrl && (
            <img
              src={mainArticle.mediaUrl}
              className="w-full h-72 rounded-lg object-cover"
              alt=""
            />
          )}
        </Link>

        <p className="mt-4 text-slate-300">
          {mainArticle.content?.substring(0, 200)}...
        </p>

        {/* Below the big article */}
        <div className="mt-6 space-y-4">
          {articles.slice(1, 4).map((a) => (
            <Link
              key={a.id}
              href={`/articles/${a.slug}`}
              className="flex gap-3 border-b border-slate-700 pb-3"
            >
              <img
                src={a.mediaUrl || "/placeholder.jpg"}
                className="w-28 h-20 rounded object-cover"
                alt=""
              />
              <div>
                <h3 className="text-white hover:text-blue-300">{a.title}</h3>
                <p className="text-sm text-slate-400">
                  {a.content.substring(0, 90)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-3 space-y-6">

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-3">
            Featured Videos
          </h2>

          {rightArticles.map((v) => (
            <Link key={v.id} href={`/articles/${v.slug}`}>
              <div className="mb-4">
                <img
                  src={v.mediaUrl}
                  className="w-full h-40 rounded-lg object-cover"
                  alt=""
                />
                <p className="mt-2 text-white hover:text-blue-300">{v.title}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}
