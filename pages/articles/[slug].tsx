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
  customAuthor?: string | null;
  category?: string | null;
  sourceUrl?: string | null;
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
    <article className="max-w-3xl mx-auto py-8 px-6 text-gray-900">

      {/* EDIT & DELETE BUTTONS */}
      <div className="flex justify-end mb-4 gap-4">
        <a
          href={`/articles/${article.slug}/edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Article
        </a>
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
        {article.category && (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mb-2">
            {article.category}
          </span>
        )}
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{article.title}</h1>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span>By {article.customAuthor || "Unknown Author"}</span>
          <span>•</span>
          <span>{formattedDate}</span>
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
                <p className="text-gray-500 italic">Unable to load media.</p>
              );
            }
          })()}
        </div>
      ) : (
        <p className="text-gray-500 italic my-6">No media included.</p>
      )}

      <div className="prose max-w-none text-gray-800">
        {ReactMarkdown ? (
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ children }: any) => {
                let text = "";
                if (typeof children === "string") {
                  text = children;
                } else if (
                  Array.isArray(children) &&
                  children.length === 1 &&
                  typeof children[0] === "string"
                ) {
                  text = children[0];
                }

                if (text) {
                  // YouTube Regex
                  const ytMatch = text
                    .trim()
                    .match(
                      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:&\S*)?$/
                    );
                  if (ytMatch && ytMatch[1]) {
                    return (
                      <div className="my-6 aspect-video w-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-lg shadow-md"
                        ></iframe>
                      </div>
                    );
                  }

                  // Instagram Regex
                  const igMatch = text
                    .trim()
                    .match(
                      /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([\w-]+)(?:\/?\S*)?$/
                    );
                  if (igMatch && igMatch[1]) {
                    return (
                      <div className="my-6 flex justify-center">
                        <iframe
                          src={`https://www.instagram.com/p/${igMatch[1]}/embed`}
                          width="400"
                          height="550"
                          frameBorder="0"
                          scrolling="no"
                          allowTransparency={true}
                          className="rounded-lg shadow-md bg-white border border-gray-200"
                        ></iframe>
                      </div>
                    );
                  }
                }

                return <p className="mb-4 whitespace-pre-line">{children}</p>;
              },
              // Make sure links also work if they are auto-linked
              a: ({ href, children }: any) => {
                const text = href || "";
                 // YouTube
                 const ytMatch = text
                 .trim()
                 .match(
                   /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:&\S*)?$/
                 );
               if (ytMatch && ytMatch[1]) {
                 return (
                   <div className="my-6 aspect-video w-full">
                     <iframe
                       src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                       title="YouTube video player"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                       className="w-full h-full rounded-lg shadow-md"
                     ></iframe>
                   </div>
                 );
               }

               // Instagram
               const igMatch = text
                 .trim()
                 .match(
                   /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([\w-]+)(?:\/?\S*)?$/
                 );
               if (igMatch && igMatch[1]) {
                 return (
                   <div className="my-6 flex justify-center">
                     <iframe
                       src={`https://www.instagram.com/p/${igMatch[1]}/embed`}
                       width="400"
                       height="550"
                       frameBorder="0"
                       scrolling="no"
                       allowTransparency={true}
                       className="rounded-lg shadow-md bg-white border border-gray-200"
                     ></iframe>
                   </div>
                 );
               }
               
               return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>
              }
            }}
          >
            {article.content || "No content available."}
          </ReactMarkdown>
        ) : (
          <pre>{article.content || "No content available."}</pre>
        )}
      </div>

      {/* SOURCE LINK */}
      {article.sourceUrl && (
        <div className="mt-8 pt-4 border-t text-sm text-gray-500">
          Source: <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Original Post</a>
        </div>
      )}
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
