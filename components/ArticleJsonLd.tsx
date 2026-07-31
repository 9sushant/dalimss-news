// components/ArticleJsonLd.tsx
// Reusable NewsArticle JSON-LD structured data component

import {
  SITE_URL,
  SITE_NAME,
  absoluteImageUrl,
  canonicalArticleSlug,
  toISOWithTZ,
} from "@/lib/seo";

interface ArticleJsonLdProps {
  article: {
    title: string;
    slug: string;
    content?: string | null;
    excerpt?: string;
    mediaUrl?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    customAuthor?: string | null;
    category?: string | null;
    sourceUrl?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    tags?: string | null;
    language?: string | null;
  };
  authorUrl?: string;
}

export function ArticleJsonLd({ article, authorUrl }: ArticleJsonLdProps) {
  const url = `${SITE_URL}/articles/${canonicalArticleSlug(article.slug)}`;
  const imageUrl = absoluteImageUrl(article.mediaUrl);
  const authorName = article.customAuthor || "Dalimss News Desk";
  const isNewsroomByline = authorName === "Dalimss News Desk";

  // Build description
  const description =
    article.metaDescription ||
    article.excerpt ||
    (article.content || "")
      .replace(/<[^>]+>/g, "")
      .replace(/[#*`]/g, "")
      .slice(0, 200);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: article.metaTitle || article.title,
    description,
    image: imageUrl ? [imageUrl] : [],
    datePublished: toISOWithTZ(article.createdAt),
    dateModified: toISOWithTZ(article.updatedAt || article.createdAt),
    inLanguage: article.language === "hi" ? "hi-IN" : "en-IN",
    articleSection: article.category || "News",
    isAccessibleForFree: true,
    keywords: article.tags
      ? article.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : undefined,
    citation: article.sourceUrl || undefined,
    author: {
      "@type": isNewsroomByline ? "Organization" : "Person",
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-square.png`,
        width: 512,
        height: 512,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
