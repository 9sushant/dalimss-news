

import React from 'react';
import { Article } from '../../types';
// Use namespace imports for robustness with CDN-hosted modules
import * as RMarkdownModule from 'react-markdown';
import * as rRawModule from 'rehype-raw';

// Safely access the default export from a module, ensuring it's a function.
// This is for modules like react-markdown that use `export default`.
const getFunctionDefaultExport = (module: any) => {
    if (module && typeof module.default === 'function') {
        return module.default;
    }
    // Fallback for modules that might not be wrapped in a default object
    if (typeof module === 'function') {
        return module;
    }
    return null;
}

const ReactMarkdown = getFunctionDefaultExport(RMarkdownModule);
const rehypeRaw = getFunctionDefaultExport(rRawModule);


interface ArticlePageProps {
  article: Article;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  if (!article) {
    return <div>Article not found.</div>;
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Set the document title since Next.js Head is not available
  React.useEffect(() => {
    document.title = `${article.title} | NextGen News`;
    // Scroll to top on article change
    window.scrollTo(0, 0);
  }, [article]);

  return (
    <article className="max-w-3xl mx-auto py-8">
        <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-serif">
                {article.title}
            </h1>
            <div className="flex items-center gap-4 mt-4">
                <img src={article.authorAvatarUrl} alt={article.authorName} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-slate-200">{article.authorName}</p>
                    <p className="text-sm text-slate-400">
                        {formattedDate} · {article.readTimeInMinutes} min read
                    </p>
                </div>
            </div>
        </header>

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
            <video src={article.mediaUrl} controls className="w-full h-auto bg-black my-8 rounded-md" />
        )}

        <div className="prose prose-lg lg:prose-xl max-w-none prose-invert">
            { ReactMarkdown && rehypeRaw ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{article.content}</ReactMarkdown>
            ) : (
                // Fallback for when the markdown components or plugins don't load correctly
                <pre className="whitespace-pre-wrap font-serif">{article.content}</pre>
            )}
        </div>
    </article>
  );
};

export default ArticlePage;