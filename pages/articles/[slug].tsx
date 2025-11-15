// pages/articles/[slug].tsx

import React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
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
  content: string;
  createdAt: string;
  mediaUrl?: string | null;
  mediaType?: string | null;
  authorName?: string;
  authorAvatarUrl?: string;
  readTimeInMinutes?: number;
}

interface Props {
  article?: Article | null;
}

const ArticlePage: React.FC<Props> = ({ article }) => {
  const router = useRouter();

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center text-xl text-white">
        Article not found.
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString();

  React.useEffect(() => {
    document.title = `${article.title} | Dalimss News`;
    window.scrollTo(0, 0);
  }, [article]);

  // 🔴 DELETE ARTICLE FUNCTION
  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this article?");
    if (!ok) return;

    const res = await fetch(`/api/articles/delete?id=${article.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Article deleted successfully.");
      router.push("/articles");
    } else {
      alert("Failed to delete the article.");
    }
  };

  return (
    <article className="max-w-3xl mx-auto py-8 px-6 text-white">
      {/* 🔴 DELETE BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Delete Article
        </button>
      </div>

      <header className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-3">{article.title}</h1>
        <div className="text-sm text-slate-400">
          {formattedDate} • {article.readTimeInMinutes} min read
        </div>
      </header>

      {/* Media (Image or Video) */}
      {article.mediaUrl &&
        (article.mediaType === "image" ? (
          <img
            src={article.mediaUrl}
            className="rounded-md my-6 w-full max-w-3xl mx-auto"
            alt={article.title}
          />
        ) : (
          <video
            src={article.mediaUrl}
            controls
            className="rounded-md my-6 w-full max-w-3xl mx-auto"
          ></video>
        ))}

      <div className="prose prose-invert max-w-none">
        {typeof article.content === "string" && ReactMarkdown ? (
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {article.content}
          </ReactMarkdown>
        ) : (
          <pre>{String(article.content ?? "No content")}</pre>
        )}
      </div>
    </article>
  );
};

export default ArticlePage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = String(params?.slug ?? "");

  const article = await prisma.article.findFirst({
    where: {
      OR: [
        { slug },
        {
          id: Number.isNaN(Number(slug)) ? undefined : Number(slug),
        },
      ],
    },
  });

  if (!article) {
    return { props: { article: null } };
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
};
