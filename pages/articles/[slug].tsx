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
  authorName?: string;
  authorAvatarUrl?: string;
  readTimeInMinutes?: number | null;
}

interface Props {
  article?: Article | null;
}

const ArticlePage: React.FC<Props> = ({ article }) => {
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

  return (
    <article className="max-w-3xl mx-auto py-8 px-6 text-white">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-3">{article.title}</h1>
        <div className="text-sm text-slate-400">
          {formattedDate}
          {article.readTimeInMinutes
            ? ` • ${article.readTimeInMinutes} min read`
            : ""}
        </div>
      </header>

      {/* Media Safe Render */}
      {article.mediaUrl && (
        <div className="my-6">
          {article.mediaType === "video" ? (
            <video
              src={article.mediaUrl}
              controls
              className="rounded-md w-full max-h-[500px]"
            />
          ) : (
            <img
              src={article.mediaUrl}
              className="rounded-md w-full"
              alt="media"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
      )}

      {/* Content */}
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
  const slug = String(params?.slug ?? "");

  // prepare OR conditions safely
  const orConditions: any[] = [{ slug }];

  // if slug is a number, add id condition
  const numericId = Number(slug);
  if (!isNaN(numericId)) {
    orConditions.push({ id: numericId });
  }

  const article = await prisma.article.findFirst({
    where: {
      OR: orConditions,
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
