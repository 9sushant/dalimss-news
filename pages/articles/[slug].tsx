// pages/articles/[slug].tsx
import React from "react";
import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import * as RMarkdownModule from "react-markdown";
import * as rRawModule from "rehype-raw";

const getDefault = (m: any) => (m && typeof m.default === "function" ? m.default : null);
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
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center text-xl">
        Article not found.
      </div>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString();

  React.useEffect(() => {
    document.title = `${article.title} | NextGen News`;
    window.scrollTo(0, 0);
  }, [article]);

  return (
    <article className="max-w-3xl mx-auto py-8 px-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-white mb-3">{article.title}</h1>
        <div className="text-sm text-slate-400">
          {formattedDate} • {article.readTimeInMinutes} min read
        </div>
      </header>

      {/* ✅ Show Media (image or video) */}
      {article.mediaUrl && (
        article.mediaType === "image" ? (
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
        )
      )}

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

  // ✅ Fetch article from SQLite
  const article = await prisma.article.findFirst({
    where: {
      OR: [
        { slug },
        { id: Number.isNaN(Number(slug)) ? undefined : Number(slug) }
      ]
    }
  });

  if (!article) {
    return { props: { article: null } };
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)), // prevent Date serialization issue
    },
  };
};
