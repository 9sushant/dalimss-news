// components/ArticleJsonLd.tsx
// Reusable NewsArticle JSON-LD structured data component

import {
  SITE_URL,
  SITE_NAME,
  ORGANIZATION_ID,
  WEBSITE_ID,
  absoluteImageUrl,
  canonicalArticleSlug,
  toISOWithTZ,
  stripForMeta,
  canonicalAuthorName,
} from "@/lib/seo";
import { normalizeArticleSources } from "@/lib/articleSources";
import type { AuthorBoxProfile } from "@/lib/authorBoxes";

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
    sourceUrls?: unknown;
    metaTitle?: string | null;
    metaDescription?: string | null;
    tags?: string | null;
    language?: string | null;
  };
  authorUrl?: string;
  authorProfile?: AuthorBoxProfile | null;
}

export function ArticleJsonLd({
  article,
  authorUrl,
  authorProfile,
}: ArticleJsonLdProps) {
  const url = `${SITE_URL}/articles/${canonicalArticleSlug(article.slug)}`;
  const imageUrl = absoluteImageUrl(article.mediaUrl);
  const authorName = canonicalAuthorName(
    article.customAuthor || "Dalimss News Desk"
  );
  const isNewsroomByline = authorName === "Dalimss News Desk";
  const sources = normalizeArticleSources(article.sourceUrls);
  const citations = [
    ...sources.map((source) => source.url),
    ...(article.sourceUrl &&
    !sources.some((source) => source.url === article.sourceUrl)
      ? [article.sourceUrl]
      : []),
  ];

  const description = stripForMeta(
    article.metaDescription || article.excerpt || article.content || "",
    160
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: stripForMeta(article.metaTitle || article.title, 110),
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
    citation:
      citations.length === 1
        ? citations[0]
        : citations.length > 1
        ? citations
        : undefined,
    author: {
      "@type": isNewsroomByline ? "Organization" : "Person",
      name: authorName,
      ...(authorUrl ? { url: authorUrl } : {}),
      ...(authorProfile
        ? {
            "@type": "Person",
            jobTitle: authorProfile.jobTitle,
            image: authorProfile.photoUrl,
            worksFor: {
              "@type": "Organization",
              name: authorProfile.organizationName,
            },
          }
        : {}),
    },
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
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
