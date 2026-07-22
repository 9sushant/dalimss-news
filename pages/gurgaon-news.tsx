import { GetServerSideProps } from "next";
import Head from "next/head";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
  articles: Article[];
}

export default function GurgaonNewsPage({ articles }: Props) {
  const siteUrl = "https://dalimss.news";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gurgaon News",
        item: `${siteUrl}/gurgaon-news`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gurgaon News | गुरुग्राम समाचार",
    description:
      "Latest Gurgaon and Gurugram news, local updates, Haryana news, corporate developments, real estate, traffic and civic updates from Dalimss News.",
    url: `${siteUrl}/gurgaon-news`,
    publisher: {
      "@type": "Organization",
      name: "Dalimss News",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  return (
    <>
      <Head>
        <title>Gurgaon News Today | गुरुग्राम समाचार - Dalimss News</title>
        <meta
          name="description"
          content="Latest Gurgaon news today in Hindi and English. गुरुग्राम की ताज़ा खबरें, स्थानीय समाचार, कॉरपोरेट अपडेट, रियल एस्टेट, ट्रैफिक - सभी अपडेट Dalimss News पर। Read Gurgaon news, Gurugram news, Cyber City updates."
        />
        <meta
          name="keywords"
          content="Gurgaon news today, gurugram news in hindi, गुरुग्राम समाचार, गुड़गांव खबर, gurgaon news, cyber city news, gurugram local news, gurgaon real estate, Haryana news today, dalimss news gurgaon"
        />
        <link rel="canonical" href={`${siteUrl}/gurgaon-news`} />

        {/* Geo Targeting */}
        <meta name="geo.region" content="IN-HR" />
        <meta name="geo.placename" content="Gurgaon, Haryana, India" />
        <meta name="geo.position" content="28.4595;77.0266" />
        <meta name="ICBM" content="28.4595, 77.0266" />
        <meta name="language" content="Hindi, English" />
        <meta name="content-language" content="hi-IN, en-IN" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dalimss News" />
        <meta
          property="og:title"
          content="Gurgaon News Today | गुरुग्राम समाचार - Dalimss News"
        />
        <meta
          property="og:description"
          content="गुरुग्राम की ताज़ा खबरें, स्थानीय समाचार और अपडेट सिर्फ Dalimss News पर।"
        />
        <meta property="og:url" content={`${siteUrl}/gurgaon-news`} />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:locale" content="hi_IN" />
        <meta property="og:locale:alternate" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@dalimss_news" />
        <meta name="twitter:title" content="Gurgaon News | गुरुग्राम समाचार - Dalimss News" />
        <meta
          name="twitter:description"
          content="गुरुग्राम की ताज़ा खबरें - Dalimss News"
        />
        <meta name="twitter:image" content={`${siteUrl}/logo.png`} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
        />
      </Head>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="border-b-2 border-red-600 pb-3 mb-8">
          <nav className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-red-600">
              Home
            </Link>
            <ChevronRightIcon className="h-3 w-3" />
            <span className="text-gray-800 font-medium">Gurgaon News</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
            Gurgaon News{" "}
            <span className="text-red-600">| गुरुग्राम समाचार</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Latest news from Gurgaon &amp; Gurugram — Corporate, Infrastructure, Real Estate, Civic Events &amp;
            more
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">
              No Gurgaon news articles found.
            </p>
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
                <h2 className="text-lg font-bold font-serif text-gray-800 border-b border-red-600 pb-2 mb-4">
                  Top Stories
                </h2>
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
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    // Fetch Gurgaon category articles
    const res = await fetch(
      `${baseUrl}/api/articles?category=Gurgaon&limit=30`
    );
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const articles = await res.json();
    return { props: { articles: Array.isArray(articles) ? articles : [] } };
  } catch (error) {
    console.error("Error fetching Gurgaon articles:", error);
    return { props: { articles: [] } };
  }
};
