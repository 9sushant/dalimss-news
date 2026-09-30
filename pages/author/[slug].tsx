import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Pagination } from "@/components/Pagination";
import { Article } from "@/types";
import {
  SITE_URL,
  SITE_NAME,
  authorSlug,
  canonicalAuthorName,
  authorNameVariants,
} from "@/lib/seo";
import { getCategoriesByDbValue } from "@/lib/categories";
import prisma from "@/lib/prisma";
import { getAuthorPortrait } from "@/lib/author-portraits";
import {
  LISTING_PAGE_SIZE,
  listingExcerpt,
  listingPath,
  parsePageParam,
} from "@/lib/pagination";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface Props {
  authorName: string;
  authorSlugStr: string;
  articles: Article[];
  firstPublished: string;
  beats: string[];
  page: number;
  totalPages: number;
  totalCount: number;
  profile: {
    bio: string | null;
    beat: string | null;
    experience: string | null;
    imageUrl: string | null;
    professionalUrl: string | null;
    email: string | null;
  } | null;
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
  beats,
  profile,
  page,
  totalPages,
  totalCount,
}: Props) {
  const profileUrl = `${SITE_URL}/author/${authorSlugStr}`;
  const canonicalUrl = `${SITE_URL}${listingPath(
    `/author/${authorSlugStr}`,
    page
  )}`;
  const pageTitle =
    page > 1
      ? `Articles by ${authorName} | Page ${page} | ${SITE_NAME}`
      : `Articles by ${authorName} | ${SITE_NAME}`;
  const portraitUrl = getAuthorPortrait(authorName) || profile?.imageUrl;
  const absolutePortraitUrl = portraitUrl
    ? new URL(portraitUrl, SITE_URL).href
    : `${SITE_URL}/logo.png`;
  const pageDescription =
    profile?.bio ||
    `Read all ${totalCount} article${
      totalCount !== 1 ? "s" : ""
    } by ${authorName} on ${SITE_NAME}.`;

  const personSchema = {
    "@type": "Person",
    name: authorName,
    url: profileUrl,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    knowsAbout: beats,
    ...(portraitUrl ? { image: absolutePortraitUrl } : {}),
    ...(profile?.professionalUrl
      ? { sameAs: [profile.professionalUrl] }
      : {}),
    ...(profile?.email ? { email: profile.email } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Newsroom",
      email: "dalimssnews@gmail.com",
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    mainEntity: personSchema,
    publisher: {
      "@type": "NewsMediaOrganization",
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
        {page > 1 && (
          <link
            rel="prev"
            href={`${SITE_URL}${listingPath(
              `/author/${authorSlugStr}`,
              page - 1
            )}`}
          />
        )}
        {page < totalPages && (
          <link
            rel="next"
            href={`${SITE_URL}/author/${authorSlugStr}?page=${page + 1}`}
          />
        )}

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={absolutePortraitUrl} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@dalimss_news" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={absolutePortraitUrl} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
        />
      </Head>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { name: "Authors", href: "/authors" },
            { name: authorName, href: `/author/${authorSlugStr}` },
          ]}
        />

        {/* Author Info Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt={`Portrait of ${authorName}`}
                  width={112}
                  height={112}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md md:h-28 md:w-28"
                />
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 bg-red-50 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                  <UserCircleIcon className="w-16 h-16 md:w-20 md:h-20 text-red-300" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900 mb-2">
                {authorName}
              </h1>
              <p className="text-gray-500 text-sm mb-4">
                Published contributor at {SITE_NAME}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-4">
                {profile?.bio ||
                  `This page collects stories published under the ${authorName} byline. Article pages identify their available reporting basis, primary material and update history.`}
              </p>
              {profile?.experience && (
                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-4">
                  <strong className="text-gray-800">Experience:</strong>{" "}
                  {profile.experience}
                </p>
              )}
              {profile?.beat && (
                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-4">
                  <strong className="text-gray-800">Reporting beat:</strong>{" "}
                  {profile.beat}
                </p>
              )}
              {beats.length > 0 && (
                <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-4">
                  <strong className="text-gray-800">Published beats:</strong>{" "}
                  {beats.join(", ")}.
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full font-semibold">
                  {totalCount} Article{totalCount !== 1 ? "s" : ""}
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
                {profile?.professionalUrl && (
                  <a
                    href={profile.professionalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full hover:text-red-600"
                  >
                    Professional profile
                  </a>
                )}
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full hover:text-red-600"
                  >
                    Contact
                  </a>
                )}
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

          <Pagination
            page={page}
            totalPages={totalPages}
            pathname={`/author/${authorSlugStr}`}
          />
        </section>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;
  const page = parsePageParam(context.query.page);
  if (page === null) return { notFound: true };

  const authorName = canonicalAuthorName(slugToName(slug));
  const authorVariants = authorNameVariants(authorName);
  const where = {
    OR: authorVariants.map((name) => ({
      customAuthor: {
        equals: name,
        mode: "insensitive" as const,
      },
    })),
  };

  try {
    const totalCount = await prisma.article.count({ where });
    if (totalCount === 0) return { notFound: true };

    const totalPages = Math.ceil(totalCount / LISTING_PAGE_SIZE);
    if (page > totalPages) return { notFound: true };

    const displaySample = await prisma.article.findFirst({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: { customAuthor: true },
    });
    const displayName = canonicalAuthorName(
      displaySample?.customAuthor || authorName
    );
    const authorSlugStr = authorSlug(displayName);
    if (slug !== authorSlugStr) {
      return {
        redirect: {
          destination: listingPath(`/author/${authorSlugStr}`, page),
          permanent: true,
        },
      };
    }
    if (page === 1 && context.query.page !== undefined) {
      return {
        redirect: {
          destination: `/author/${authorSlugStr}`,
          permanent: true,
        },
      };
    }

    const [rows, earliest, categoryRows, profile] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * LISTING_PAGE_SIZE,
        take: LISTING_PAGE_SIZE,
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
        },
      }),
      prisma.article.findFirst({
        where,
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { createdAt: true },
      }),
      prisma.article.findMany({
        where,
        select: { category: true },
      }),
      prisma.authorProfile.findUnique({
        where: { slug: authorSlugStr },
        select: {
          bio: true,
          beat: true,
          experience: true,
          imageUrl: true,
          professionalUrl: true,
          email: true,
        },
      }),
    ]);

    const serializedArticles: Article[] = rows.map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      content: listingExcerpt(article.content),
      mediaUrl: article.mediaUrl,
      mediaType: article.mediaType as Article["mediaType"],
      createdAt: article.createdAt.toISOString(),
      authorName: canonicalAuthorName(
        article.customAuthor || "Dalimss News Desk"
      ),
      authorAvatarUrl: "",
      readTimeInMinutes: article.readTimeInMinutes,
      claps: 0,
      commentsCount: 0,
      category: article.category,
    }));
    const beats = Array.from(
      new Map(
        categoryRows
          .flatMap((article) => getCategoriesByDbValue(article.category))
          .map((category) => [category.slug, category.name])
      ).values()
    );

    return {
      props: {
        authorName: displayName,
        authorSlugStr,
        articles: serializedArticles,
        firstPublished: earliest?.createdAt.toISOString() || "",
        beats,
        profile,
        page,
        totalPages,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error fetching author articles:", error);
    return { notFound: true };
  }
};
