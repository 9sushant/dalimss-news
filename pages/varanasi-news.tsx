import { GetServerSideProps } from "next";
import Head from "next/head";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
  articles: Article[];
}

export default function VaranasiNewsPage({ articles }: Props) {
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
        name: "Varanasi News",
        item: `${siteUrl}/varanasi-news`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Varanasi News | वाराणसी समाचार",
    description:
      "Latest Varanasi news, local updates, Uttar Pradesh news, politics, education and more from Dalimss News.",
    url: `${siteUrl}/varanasi-news`,
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
        <title>Varanasi News Today | वाराणसी समाचार - Dalimss News</title>
        <meta
          name="description"
          content="Latest Varanasi news today in Hindi. वाराणसी की ताज़ा खबरें, स्थानीय समाचार, राजनीति, शिक्षा — सभी अपडेट सिर्फ Dalimss News पर। Read Varanasi news, Banaras news, UP news."
        />
        <meta
          name="keywords"
          content="Varanasi news today, varanasi news in hindi, वाराणसी समाचार, वाराणसी खबर, banaras news, बनारस की खबर, varanasi ki khabar aaj ki, UP news today, uttar pradesh news hindi, dalimss news varanasi"
        />
        <link rel="canonical" href={`${siteUrl}/varanasi-news`} />

        {/* Geo Targeting */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Varanasi, Uttar Pradesh, India" />
        <meta name="geo.position" content="25.3176;82.9739" />
        <meta name="ICBM" content="25.3176, 82.9739" />
        <meta name="language" content="Hindi" />
        <meta name="content-language" content="hi-IN" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dalimss News" />
        <meta
          property="og:title"
          content="Varanasi News Today | वाराणसी समाचार - Dalimss News"
        />
        <meta
          property="og:description"
          content="वाराणसी की ताज़ा खबरें, स्थानीय समाचार और अपडेट सिर्फ Dalimss News पर।"
        />
        <meta property="og:url" content={`${siteUrl}/varanasi-news`} />
        <meta property="og:image" content={`${siteUrl}/logo.png`} />
        <meta property="og:locale" content="hi_IN" />
        <meta property="og:locale:alternate" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@dalimss_news" />
        <meta name="twitter:title" content="Varanasi News | वाराणसी समाचार - Dalimss News" />
        <meta
          name="twitter:description"
          content="वाराणसी की ताज़ा खबरें - Dalimss News"
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
            <span className="text-gray-800 font-medium">Varanasi News</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
            Varanasi News{" "}
            <span className="text-red-600">| वाराणसी समाचार</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Latest news from Varanasi — Politics, Education, Local Events &amp;
            more
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="text-gray-400 text-center py-20 text-xl">
            No Varanasi news articles found.
          </p>
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
    // Fetch Varanasi category articles
    const res = await fetch(
      `${baseUrl}/api/articles?category=Varanasi&limit=30`
    );
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    const articles = await res.json();
    return { props: { articles: Array.isArray(articles) ? articles : [] } };
  } catch (error) {
    console.error("Error fetching Varanasi articles:", error);
    return { props: { articles: [] } };
  }
};
