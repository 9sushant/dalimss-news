
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    if (href) {
        window.location.hash = href;
    }
  };

  const snippet = article.content.split('\n')[0]; // First paragraph as snippet

  return (
    <article className="py-8 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
            <img src={article.authorAvatarUrl} alt={article.authorName} className="w-6 h-6 rounded-full" loading="lazy" />
            <span className="font-medium text-sm text-slate-200">{article.authorName}</span>
        </div>

        <div className="flex justify-between items-start gap-8">
            <div className="flex-1">
                <a href={`#/articles/${article.slug}`} onClick={handleNavClick} className="block group">
                    <h2 className="text-2xl font-bold text-white mb-2 leading-snug">
                        {article.title}
                    </h2>
                    <p className="hidden md:block text-slate-400 font-serif text-base leading-relaxed max-h-20 overflow-hidden text-ellipsis">
                        {snippet}
                    </p>
                </a>
            </div>

            {article.mediaUrl && article.mediaType === 'image' && (
                <a href={`#/articles/${article.slug}`} onClick={handleNavClick} className="flex-shrink-0 w-28 h-28 md:w-40 md:h-28 bg-slate-800">
                    <img 
                        src={article.mediaUrl} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </a>
            )}
        </div>

        <div className="flex justify-between items-center mt-6">
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-slate-400">
                <span>{formattedDate}</span>
                <span className="hidden sm:inline">·</span>
                <span className="hidden sm:inline">{article.readTimeInMinutes} min read</span>
            </div>
        </div>
    </article>
  );
};

export default ArticleCard;
