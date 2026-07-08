// components/ArticleJsonLd.tsx
// Reusable NewsArticle JSON-LD structured data component

import { SITE_URL, SITE_NAME, absoluteImageUrl } from "@/lib/seo";

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
    metaTitle?: string | null;
    metaDescription?: string | null;
  };
  authorUrl?: string;
}

export function ArticleJsonLd({ article, authorUrl }: ArticleJsonLdProps) {
  const url = `${SITE_URL}/articles/${article.slug}`;
  const imageUrl = absoluteImageUrl(article.mediaUrl);

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
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(
      article.updatedAt || article.createdAt
    ).toISOString(),
    keywords: (article as any).tags ? (article as any).tags.split(",").map((t: string) => t.trim()) : undefined,
    author: {
      "@type": "Person",
      name: article.customAuthor || "Dalimss News Desk",
      ...(authorUrl ? { url: authorUrl } : {}),
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-square.png`,
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
