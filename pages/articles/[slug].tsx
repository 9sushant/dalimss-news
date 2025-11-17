import React from "react";
import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import * as RMarkdownModule from "react-markdown";
import * as rRawModule from "rehype-raw";

const getDefault = (m: any) =>
  m && typeof m.default === "function" ? m.default : null;

const ReactMarkdown = getDefault(RMarkdownModule);
const rehypeRaw = getDefault(rRawModule);

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  createdAt: string;
  mediaUrl?: string | null;
  mediaType?: string | null;
  readTimeInMinutes?: number | null;
}

interface Props {
  article?: Article | null;
}

const ArticlePage: React.FC<Props> = ({ article }) => {
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center text-xl text-white">
        Article not found or has been removed.
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString();

  return (
    <article className="max-w-3xl mx-auto py-8 px-6 text-white">

      {/* DELETE BUTTON */}
      <div className="flex justify-end mb-4">
        <button
        onClick={async () => {
          if (!confirm("Are you sure you want to delete this article?")) return;
      
          const res = await fetch("/api/articles/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: article.slug }),
          });
      
          const data = await res.json();
          if (data.success) {
            window.location.href = "/articles";
          } else {
            alert("Delete failed: " + data.error);
          }
        }}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Delete Article
      </button>

      </div>

      {/* HEADER */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-3">{article.title}</h1>
        <div className="text-sm text-slate-400">
          {formattedDate}
          {article.readTimeInMinutes
            ? ` • ${article.readTimeInMinutes} min read`
            : ""}
        </div>
      </header>

      {/* MEDIA RENDERER */}
      {article.mediaUrl ? (
        <div className="my-6">
          {(() => {
            try {
              if (article.mediaType === "video") {
                return (
                  <video
                    src={article.mediaUrl}
                    controls
                    className="rounded-md w-full max-h-[500px]"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                );
              }

              return (
                <img
                  src={article.mediaUrl}
                  className="rounded-md w-full"
                  alt="media"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              );
            } catch (err) {
              return (
                <p className="text-slate-500 italic">Unable to load media.</p>
              );
            }
          })()}
        </div>
      ) : (
        <p className="text-slate-500 italic my-6">No media included.</p>
      )}

      {/* CONTENT */}
      <div className="prose prose-invert max-w-none">
        {ReactMarkdown ? (
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {article.content || "No content available."}
          </ReactMarkdown>
        ) : (
          <pre>{article.content || "No content available."}</pre>
        )}
      </div>
    </article>
  );
};

export default ArticlePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = String(params?.slug || "");

  const whereClause: any = { OR: [{ slug }] };

  const numericId = Number(slug);
  if (!isNaN(numericId)) whereClause.OR.push({ id: numericId });

  let article = null;

  try {
    article = await prisma.article.findFirst({ where: whereClause });
  } catch (err) {
    console.error("DB ERROR:", err);
  }

  return {
    props: {
      article: article ? JSON.parse(JSON.stringify(article)) : null,
    },
  };
};
