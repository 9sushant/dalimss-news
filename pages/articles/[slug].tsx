import React, { useState, useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import * as RMarkdownModule from "react-markdown";
import * as rRawModule from "rehype-raw";

const getDefault = (m: any) =>
  m && typeof m.default === "function" ? m.default : null;

const ReactMarkdown = getDefault(RMarkdownModule);
const rehypeRaw = getDefault(rRawModule);

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface RelatedArticleData {
  id: number;
  slug: string;
  title: string;
  mediaUrl: string | null;
  createdAt: string;
  category: string | null;
  customAuthor: string | null;
}

interface Article {
  id: number;
  slug: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
  mediaItems?: MediaItem[] | null;
  readTimeInMinutes?: number | null;
  customAuthor?: string | null;
  category?: string | null;
  sourceUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

interface Props {
  article?: Article | null;
  relatedArticles: RelatedArticleData[];
}

import Head from "next/head";
import ShareButton from "@/components/ShareButton";
import { ArticleJsonLd } from "@/components/ArticleJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RelatedArticles } from "@/components/RelatedArticles";
import { SITE_URL, absoluteImageUrl, stripForMeta, authorSlug } from "@/lib/seo";
import { getCategoryByDbValue, getCategorySlug } from "@/lib/categories";

const ArticlePage: React.FC<Props> = ({ article, relatedArticles }) => {
  const { data: session } = useSession();
  const [formattedDate, setFormattedDate] = useState<string>('');

  // Format date on client-side only to prevent hydration mismatch
  useEffect(() => {
    if (article) {
      setFormattedDate(new Date(article.createdAt).toLocaleDateString());
    }
  }, [article]);
  
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-24 text-center text-xl text-white">
        Article not found or has been removed.
      </div>
    );
  }

  // Create clean description for SEO
  const seoDescription =
    article.metaDescription || stripForMeta(article.content || "", 160);

  // OG image
  const ogImageUrl = absoluteImageUrl(article.mediaUrl);

  // Category info for breadcrumbs
  const categoryInfo = article.category
    ? getCategoryByDbValue(article.category)
    : null;
  const categorySlug = getCategorySlug(article.category);

  // Author URL
  const authorName = article.customAuthor || "Dalimss News Desk";
  const authorUrl = `${SITE_URL}/author/${authorSlug(authorName)}`;

  // Canonical URL
  const canonicalUrl = `${SITE_URL}/articles/${article.slug}`;

  return (
    <article className="max-w-3xl mx-auto py-8 px-6 text-gray-900">
      <Head>
        <title>{article.metaTitle ? article.metaTitle : `${article.title} | Dalimss News`}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Robots with max-image-preview */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        
        {/* Open Graph - Essential for WhatsApp/Facebook */}
        <meta property="og:site_name" content="Dalimss News" />
        <meta property="og:title" content={article.metaTitle || article.title} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={article.metaTitle || article.title} />
        <meta property="og:locale" content="en_IN" />
        
        {/* Article specific Meta tags */}
        <meta property="article:published_time" content={new Date(article.createdAt).toISOString()} />
        <meta property="article:modified_time" content={new Date(article.updatedAt || article.createdAt).toISOString()} />
        {article.customAuthor && <meta property="article:author" content={article.customAuthor} />}
        {article.category && <meta property="article:section" content={article.category} />}
        {(article as any).tags && (article as any).tags.split(",").map((t: string, i: number) => (
          <meta key={i} property="article:tag" content={t.trim()} />
        ))}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@dalimss_news" />
        <meta name="twitter:title" content={article.metaTitle || article.title} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        
        {/* Preload hero image for better LCP */}
        {article.mediaUrl && (
          <link rel="preload" as="image" href={article.mediaUrl} />
        )}
      </Head>

      {/* JSON-LD Structured Data */}
      <ArticleJsonLd article={article} authorUrl={authorUrl} />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          ...(categoryInfo
            ? [{ name: categoryInfo.name, href: `/category/${categoryInfo.slug}` }]
            : []),
          { name: article.title.length > 60 ? article.title.slice(0, 57) + "..." : article.title, href: `/articles/${article.slug}` },
        ]}
      />

      {/* EDIT & DELETE BUTTONS (ADMIN ONLY) */}
      {session && session.user && (session.user.role === "admin" || session.user.role === "editor" || session.user.email === "admin@dalimss.com" || session.user.email === "sushantgaurav@dalimss.com" || session.user.email === "dalimsssushant@gmail.com") && (
        <div className="flex justify-end mb-4 gap-4">
          <a
            href={`/articles/${article.slug}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Article
          </a>
          <button
            onClick={async () => {
              if (!confirm("Are you sure you want to delete this article?")) return;
          
              const res = await fetch("/api/articles/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: article.slug }),
              });
          
              const data = await res.json();
              if (data.success) {
                window.location.href = "/articles";
              } else {
                alert("Delete failed: " + data.error);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Article
          </button>
        </div>
      )}

      {/* HEADER */}
      <header className="mb-6">
        {article.category && (
          <a
            href={`/category/${categorySlug}`}
            className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded mb-2 hover:bg-blue-200 transition-colors"
          >
            {article.category}
          </a>
        )}
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{article.title}</h1>
        <div className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
          <a
            href={`/author/${authorSlug(authorName)}`}
            className="hover:text-red-600 transition-colors"
          >
            By {authorName}
          </a>
          <span>•</span>
          <time dateTime={article.createdAt} suppressHydrationWarning>
            {formattedDate || new Date(article.createdAt).toLocaleDateString("en-IN")}
          </time>
          {article.updatedAt && new Date(article.updatedAt).getTime() - new Date(article.createdAt).getTime() > 60000 && (
            <>
              <span>•</span>
              <time dateTime={article.updatedAt} className="text-gray-500 italic" suppressHydrationWarning>
                Updated: {new Date(article.updatedAt).toLocaleDateString("en-IN")}
              </time>
            </>
          )}
          {article.readTimeInMinutes
            ? <><span>•</span><span>{article.readTimeInMinutes} min read</span></>
            : null}
          <div className="ml-auto">
            <ShareButton 
              url={`/articles/${article.slug}`} 
              title={article.title} 
              variant="full"
            />
          </div>
        </div>
      </header>

      {/* MEDIA RENDERER */}
      {(() => {
        // Build media list: prefer mediaItems, fallback to single mediaUrl
        const items: MediaItem[] = [];
        if (article.mediaItems && Array.isArray(article.mediaItems) && article.mediaItems.length > 0) {
          items.push(...article.mediaItems);
        } else if (article.mediaUrl) {
          items.push({ url: article.mediaUrl, type: (article.mediaType as "image" | "video") || "image" });
        }

        if (items.length === 0) {
          return <p className="text-gray-500 italic my-6">No media included.</p>;
        }

        if (items.length === 1) {
          const item = items[0];
          return (
            <div className="my-6">
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  className="rounded-md w-full max-h-[500px]"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <img
                  src={item.url}
                  className="rounded-md w-full"
                  alt={(article as any).imageAltText || article.title}
                  width={1200}
                  height={630}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
          );
        }

        // Multiple media: show a gallery grid
        return (
          <div className="my-6 grid grid-cols-2 gap-3">
            {items.map((item, idx) => (
              <div key={idx} className={`rounded-lg overflow-hidden ${idx === 0 && items.length % 2 !== 0 ? 'col-span-2' : ''}`}>
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full object-cover max-h-[400px]"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                ) : (
                  <img
                    src={item.url}
                    className="w-full h-full object-cover max-h-[400px]"
                    alt={`${article.title} - ${idx + 1}`}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            ))}
          </div>
        );
      })()}

      <div className="prose max-w-none text-gray-800">
        {ReactMarkdown ? (
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
              p: ({ children }: any) => {
                let text = "";
                if (typeof children === "string") {
                  text = children;
                } else if (
                  Array.isArray(children) &&
                  children.length === 1 &&
                  typeof children[0] === "string"
                ) {
                  text = children[0];
                }

                if (text) {
                  // YouTube Regex
                  const ytMatch = text
                    .trim()
                    .match(
                      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:&\S*)?$/
                    );
                  if (ytMatch && ytMatch[1]) {
                    return (
                      <div className="my-6 aspect-video w-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full rounded-lg shadow-md"
                        ></iframe>
                      </div>
                    );
                  }

                  // Instagram Regex
                  const igMatch = text
                    .trim()
                    .match(
                      /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([\w-]+)(?:\/?\S*)?$/
                    );
                  if (igMatch && igMatch[1]) {
                    return (
                      <div className="my-6 flex justify-center">
                        <iframe
                          src={`https://www.instagram.com/p/${igMatch[1]}/embed`}
                          width="400"
                          height="550"
                          frameBorder="0"
                          scrolling="no"
                          allowTransparency={true}
                          className="rounded-lg shadow-md bg-white border border-gray-200"
                        ></iframe>
                      </div>
                    );
                  }
                }

                return <p className="mb-4 whitespace-pre-line">{children}</p>;
              },
              // Make sure links also work if they are auto-linked
              a: ({ href, children }: any) => {
                const text = href || "";
                 // YouTube
                 const ytMatch = text
                 .trim()
                 .match(
                   /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)(?:&\S*)?$/
                 );
               if (ytMatch && ytMatch[1]) {
                 return (
                   <div className="my-6 aspect-video w-full">
                     <iframe
                       src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                       title="YouTube video player"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                       className="w-full h-full rounded-lg shadow-md"
                     ></iframe>
                   </div>
                 );
               }

               // Instagram
               const igMatch = text
                 .trim()
                 .match(
                   /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([\w-]+)(?:\/?\S*)?$/
                 );
               if (igMatch && igMatch[1]) {
                 return (
                   <div className="my-6 flex justify-center">
                     <iframe
                       src={`https://www.instagram.com/p/${igMatch[1]}/embed`}
                       width="400"
                       height="550"
                       frameBorder="0"
                       scrolling="no"
                       allowTransparency={true}
                       className="rounded-lg shadow-md bg-white border border-gray-200"
                     ></iframe>
                   </div>
                 );
               }
               
               return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>
              }
            }}
          >
            {article.content || "No content available."}
          </ReactMarkdown>
        ) : (
          <pre>{article.content || "No content available."}</pre>
        )}
      </div>

      {/* SOURCE LINK */}
      {article.sourceUrl && (
        <div className="mt-8 pt-4 border-t text-sm text-gray-500">
          Source: <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Original Post</a>
        </div>
      )}

      {/* RELATED ARTICLES */}
      <RelatedArticles articles={relatedArticles} />
    </article>
  );
};

export default ArticlePage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug || "");

  const whereClause: any = { OR: [{ slug }] };

  const numericId = Number(slug);
  if (!isNaN(numericId)) whereClause.OR.push({ id: numericId });

  let article = null;
  let relatedArticles: any[] = [];

  try {
    article = await prisma.article.findFirst({
      where: whereClause,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Fetch related articles from the same category
    if (article && article.category) {
      relatedArticles = await prisma.article.findMany({
        where: {
          category: article.category,
          id: { not: article.id },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          mediaUrl: true,
          createdAt: true,
          category: true,
          customAuthor: true,
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      });
    }
  } catch (err) {
    console.error("DB ERROR:", err);
  }

  if (!article) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
      relatedArticles: JSON.parse(JSON.stringify(relatedArticles)),
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let paths: { params: { slug: string } }[] = [];
  try {
    // Pre-render the most recent 20 articles at build time
    const recentArticles = await prisma.article.findMany({
      select: { slug: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    paths = recentArticles.map((art) => ({
      params: { slug: art.slug },
    }));
  } catch (err) {
    console.error("Failed to fetch paths for pre-rendering:", err);
  }

  return {
    paths,
    fallback: "blocking",
  };
};
