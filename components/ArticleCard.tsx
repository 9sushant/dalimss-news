import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '../types';
import ShareButton from './ShareButton';

interface ArticleCardProps {
  article: Article;
  variant?: 'vertical' | 'horizontal' | 'compact';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'vertical' }) => {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    // Format date only on client side to avoid hydration mismatch
    setFormattedDate(
      new Date(article.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      })
    );
  }, [article.createdAt]);

  const snippet =
    typeof article.content === "string"
      ? article.content.replace(/<[^>]+>/g, '').split('\n')[0].slice(0, 100) + "..."
      : "";

  // Horizontal Card (Image Left, Content Right)
  if (variant === 'horizontal') {
    return (
      <div className="group flex gap-4 py-4 border-b border-gray-200">
        {article.mediaUrl && (
          <div className="flex-shrink-0 w-32 h-24 md:w-48 md:h-32 overflow-hidden rounded-md relative">
             <img 
                src={article.mediaUrl} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
          </div>
        )}
        <div className="flex flex-col justify-between">
          <Link href={`/articles/${article.slug}`}>
            <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900 leading-tight group-hover:text-[#E21B22] transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="hidden md:block text-sm text-gray-600 mt-2 line-clamp-2">
            {snippet}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase font-semibold">{formattedDate}</span>
            <ShareButton 
              url={`/articles/${article.slug}`} 
              title={article.title} 
              variant="minimal"
            />
          </div>
        </div>
      </div>
    );
  }

  // Compact Card (Text only or small thumbnail)
  if (variant === 'compact') {
    return (
      <div className="group py-3 border-b border-gray-100 last:border-0">
        <Link href={`/articles/${article.slug}`} className="block">
          <h4 className="text-sm md:text-base font-medium text-gray-800 group-hover:text-[#E21B22] leading-snug">
            {article.title}
          </h4>
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{formattedDate}</span>
          <ShareButton 
            url={`/articles/${article.slug}`} 
            title={article.title} 
            variant="minimal"
          />
        </div>
      </div>
    );
  }

  // Default Vertical Card
  return (
    <div className="group flex flex-col h-full border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
      {article.mediaUrl && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={article.mediaUrl} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/articles/${article.slug}`} className="block mb-2">
          <h3 className="text-xl font-serif font-bold text-gray-900 leading-tight group-hover:text-[#E21B22] transition-colors">
            {article.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
          {snippet}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <span>{formattedDate}</span>
            {article.authorName && <span className="font-medium text-gray-700">• {article.authorName}</span>}
          </div>
          <ShareButton 
            url={`/articles/${article.slug}`} 
            title={article.title} 
            variant="minimal"
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
