// components/RelatedArticles.tsx
// Displays 4-6 related articles for internal linking

import Link from "next/link";
import Image from "next/image";
import { formatDateIST } from "@/lib/seo";
import { isOptimizableImageSrc } from "@/lib/optimizableImage";

interface RelatedArticle {
  id: number;
  slug: string;
  title: string;
  mediaUrl?: string | null;
  createdAt: string;
  category?: string | null;
  customAuthor?: string | null;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  heading?: string;
  itemLang?: string;
}

export function RelatedArticles({
  articles,
  heading = "Related Stories",
  itemLang,
}: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold font-serif text-gray-900 mb-6 uppercase tracking-tight">
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="group flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {article.mediaUrl && (
              <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                {isOptimizableImageSrc(article.mediaUrl) ? (
                  <Image
                    src={article.mediaUrl}
                    alt={article.title}
                    fill
                    sizes="96px"
                    quality={70}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={article.mediaUrl}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {article.category && (
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                  {article.category}
                </span>
              )}
              <h3
                lang={itemLang}
                className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mt-0.5"
              >
                {article.title}
              </h3>
              <time
                className="text-xs text-gray-400 mt-1 block"
                dateTime={article.createdAt}
              >
                {formatDateIST(article.createdAt, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
