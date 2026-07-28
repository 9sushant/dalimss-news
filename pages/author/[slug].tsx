import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Article } from "@/types";
import { SITE_URL, SITE_NAME, authorSlug } from "@/lib/seo";
import prisma from "@/lib/prisma";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  authorName: string;
  authorSlugStr: string;
  articles: Article[];
  firstPublished: string;
}

/**
 * Convert a URL slug back to a display name:
 * "sushant-gaurav" → "Sushant Gaurav"
 */
function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AuthorPage({
  authorName,
  authorSlugStr,
  articles,
  firstPublished,
}: Props) {
  const canonicalUrl = `${SITE_URL}/author/${authorSlugStr}`;
  const pageTitle = `Articles by ${authorName} | ${SITE_NAME}`;
  const pageDescription = `Read all ${articles.length} article${
    articles.length !== 1 ? "s" : ""
  } by ${authorName} on ${SITE_NAME}. Stay updated with the latest news and analysis.`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    url: canonicalUrl,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    jobTitle: "Journalist",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Newsroom",
      email: "dalimssnews@gmail.com",
    },
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@dalimss_news" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      </Head>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: "Authors", href: "/author" },
            { name: authorName, href: `/author/${authorSlugStr}` },
          ]}
        />

        {/* Author Info Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                <UserCircleIcon className="w-16 h-16 md:w-20 md:h-20 text-red-300" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-2">
                {authorName}
              </h1>
              <p className="text-gray-500 text-sm mb-4">
                Journalist at {SITE_NAME}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-4">
                {authorName} reports for Dalimss News with a focus on verified
                public-interest updates, source transparency, corrections and
                local context for readers in India.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full font-semibold">
                  {articles.length} Article{articles.length !== 1 ? "s" : ""}
                </div>
                {firstPublished && (
                  <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    Writing since{" "}
                    {new Date(firstPublished).toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                )}
                <Link
                  href="/corrections-policy"
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full hover:text-red-600"
                >
                  Corrections standards
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-6">
            <h2 className="text-xl md:text-2xl font-bold font-serif text-black uppercase tracking-tight relative">
              <span className="relative z-10 pr-4 bg-white">
                Articles by {authorName}
              </span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-600 transform translate-y-[1px]" />
            </h2>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No articles found.</p>
              <Link
                href="/"
                className="mt-6 inline-block text-red-600 hover:text-red-700 font-semibold"
              >
                ← Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <div className="flex flex-col gap-6">
                  {articles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="horizontal"
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-4 bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <h3 className="text-lg font-bold font-serif text-gray-800 border-b border-red-600 pb-2 mb-4">
                    Latest by {authorName.split(" ")[0]}
                  </h3>
                  <div className="flex flex-col gap-0">
                    {articles.slice(0, 8).map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;
  const authorName = slugToName(slug);

  try {
    const articles = await prisma.article.findMany({
      where: {
        customAuthor: {
          equals: authorName,
          mode: "insensitive",
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        mediaUrl: true,
        mediaType: true,
        readTimeInMinutes: true,
        category: true,
        customAuthor: true,
        createdAt: true,
        metaTitle: true,
        metaDescription: true,
        focusKeyword: true,
        author: {
          select: { name: true, image: true },
        },
      },
    });

    if (articles.length === 0) {
      return { notFound: true };
    }

    // Use the actual casing from the first article's customAuthor
    const displayName =
      articles[0].customAuthor || authorName;
    const authorSlugStr = authorSlug(displayName);

    // Find earliest publish date
    const firstPublished = articles[articles.length - 1].createdAt.toISOString();

    const serializedArticles: Article[] = articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      content: a.content,
      mediaUrl: a.mediaUrl,
      mediaType: a.mediaType as Article["mediaType"],
      createdAt: a.createdAt.toISOString(),
      authorName: a.customAuthor || a.author?.name || "Dalimss News Desk",
      authorAvatarUrl: a.author?.image || "",
      readTimeInMinutes: a.readTimeInMinutes,
      claps: 0,
      commentsCount: 0,
      category: a.category,
      metaTitle: a.metaTitle,
      metaDescription: a.metaDescription,
      focusKeyword: a.focusKeyword,
    }));

    return {
      props: {
        authorName: displayName,
        authorSlugStr,
        articles: serializedArticles,
        firstPublished,
      },
    };
  } catch (error) {
    console.error("Error fetching author articles:", error);
    return { notFound: true };
  }
};
