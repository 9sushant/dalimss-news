import React from 'react';
import { Article } from '../../types';

// Import markdown tools safely (Handles CDN or Vite import issues)
import * as RMarkdownModule from 'react-markdown';
import * as rRawModule from 'rehype-raw';

// Ensure default export exists
const getDefault = (module: any) =>
  module && typeof module.default === 'function' ? module.default : null;

const ReactMarkdown = getDefault(RMarkdownModule);
const rehypeRaw = getDefault(rRawModule);

interface ArticlePageProps {
  article: Article;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  if (!article) return <div>Article not found.</div>;

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Update browser tab title
  React.useEffect(() => {
    document.title = `${article.title} | NextGen News`;
    window.scrollTo(0, 0);
  }, [article]);

  // ✅ Fix for Minified React Error #31
  const isStringContent = typeof article.content === 'string';
  const isReactElement = React.isValidElement(article.content);

  let stringContent: string | null = null;

  if (isStringContent) {
    stringContent = article.content as string;
  } else if (!isReactElement && article.content != null) {
    try {
      stringContent = String(article.content);
    } catch {
      stringContent = null;
    }
  }

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-serif">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 mt-4">
          <img
            src={article.authorAvatarUrl}
            alt={article.authorName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-slate-200">{article.authorName}</p>
            <p className="text-sm text-slate-400">
              {formattedDate} · {article.readTimeInMinutes} min read
            </p>
          </div>
        </div>
      </header>

      {/* Media (Image / Video) */}
      {article.mediaUrl && article.mediaType === 'image' && (
        <div className="relative w-full h-auto my-8">
          <img
            src={article.mediaUrl}
            alt={article.title}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}

      {article.mediaUrl && article.mediaType === 'video' && (
        <video
          src={article.mediaUrl}
          controls
          className="w-full h-auto bg-black my-8 rounded-md"
        />
      )}

      {/* ✅ Safe content rendering */}
      <div className="prose prose-lg lg:prose-xl max-w-none prose-invert">
        {isReactElement ? (
          // If editor accidentally stored JSX / React nodes
          <div>{article.content}</div>
        ) : isStringContent && ReactMarkdown && rehypeRaw ? (
          // Markdown + HTML support
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {stringContent!}
          </ReactMarkdown>
        ) : isStringContent ? (
          // Fallback: treat as HTML
          <div dangerouslySetInnerHTML={{ __html: stringContent! }} />
        ) : (
          // Last fallback
          <pre className="whitespace-pre-wrap font-serif">
            {stringContent ?? 'No content available.'}
          </pre>
        )}
      </div>
    </article>
  );
};

export default ArticlePage;
