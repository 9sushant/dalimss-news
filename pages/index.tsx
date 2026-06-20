import { GetServerSideProps } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import NewsShortsSidebar from "@/components/NewsShortsSidebar";
import WebStoriesCarousel from "@/components/WebStoriesCarousel";
import { Article } from "@/types";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

interface Props {
  articles: Article[];
  stories: any[];
}

const SectionHeader = ({ title, href }: { title: string; href?: string }) => (
  <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
    <h2 className="text-xl md:text-2xl font-bold font-serif text-black uppercase tracking-tight relative">
      <span className="relative z-10 pr-4 bg-white">{title}</span>
      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-red-600 transform translate-y-[1px]"></span>
    </h2>
    {href && (
      <Link href={href} className="text-xs font-bold text-red-600 hover:text-red-700 uppercase flex items-center">
        View All <ChevronRightIcon className="h-3 w-3 ml-1" />
      </Link>
    )}
  </div>
);

// ... imports
import { useRouter } from "next/router";

export default function HomePage({ articles, stories }: Props) {
  const { data: session } = useSession();
  const router = useRouter(); // <--- Added router
  const [heroDate, setHeroDate] = useState<string>('');
  
  // Pagination State
  const [newsList, setNewsList] = useState<Article[]>(Array.isArray(articles) ? articles : []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(Array.isArray(articles) && articles.length >= 15);
  const [loadingMore, setLoadingMore] = useState(false);

  // Sync newsList when initial articles change (e.g. navigation)
  useEffect(() => {
    setNewsList(Array.isArray(articles) ? articles : []);
    setPage(1);
    setHasMore(Array.isArray(articles) && articles.length >= 15);
  }, [articles]);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    
    try {
      const nextPage = page + 1;
      
      // Construct query params
      const params = new URLSearchParams();
      params.append("page", String(nextPage));
      params.append("limit", "15");
      
      const { category, search } = router.query;
      if (category) params.append("category", String(category));
      if (search) params.append("search", String(search));

      const res = await fetch(`/api/articles?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more");
      
      const newArticles = await res.json();
      
      if (!Array.isArray(newArticles)) {
        throw new Error("Invalid response format");
      }

      setNewsList((prev) => {
        if (!Array.isArray(prev)) return newArticles;
        const existingIds = new Set(prev.map((a) => a.id));
        const uniqueNew = newArticles.filter((a: Article) => !existingIds.has(a.id));
        return [...prev, ...uniqueNew];
      });
      setPage(nextPage);
      
      if (newArticles.length < 15) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Format hero article date on client-side only to avoid hydration mismatch
  useEffect(() => {
    if (Array.isArray(articles) && articles.length > 0) {
      setHeroDate(new Date(articles[0].createdAt).toLocaleDateString());
    }
  }, [articles]);

  // Fallback if no articles
  if (!articles || !Array.isArray(articles) || articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-400">No articles found.</h1>
        {session && session.user && (session.user.role === "admin" || session.user.email === "admin@dalimss.com" || session.user.email === "sushantgaurav@dalimss.com" || session.user.email === "dalimsssushant@gmail.com") && (
          <Link
            href="/articles/new"
            className="mt-6 inline-block bg-blue-600 px-5 py-2.5 rounded-full text-white hover:bg-blue-700"
          >
            Start Writing
          </Link>
        )}
      </div>
    );
  }


  const heroArticle = articles[0];
  const topStories = articles.slice(1, 5);
  // 🔥 UPDATED: Use newsList for pagination
  const latestNews = newsList; 
  const sidebarNews = articles.slice(2, 8); // Just reusing for demo

  const siteUrl = "https://dalimss.news";
  const heroOgImage = heroArticle?.mediaUrl?.startsWith('http')
    ? heroArticle.mediaUrl
    : heroArticle?.mediaUrl
    ? `${siteUrl}${heroArticle.mediaUrl}`
    : `${siteUrl}/logo.png`;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dalimss News - वाराणसी समाचार",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Dalimss News",
    alternateName: [
      "Dalimss News India",
      "वाराणसी समाचार | Dalimss News",
      "डेलीएमएस न्यूज"
    ],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo.png`,
    },
    sameAs: [],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Varanasi",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: [
      {
        "@type": "Country",
        name: "India",
      },
      {
        "@type": "State",
        name: "Uttar Pradesh",
      },
      {
        "@type": "City",
        name: "Varanasi",
      }
    ],
  };

  return (
    <>
    <Head>
      <title>Dalimss News — Latest India News, Uttar Pradesh, Varanasi, Education, Business & Reviews</title>
      <meta name="description" content="Get the latest national news, Uttar Pradesh stories, Varanasi local updates, education exam alerts, business insights, and technology reviews from Dalimss News." />
      <meta name="keywords" content="Varanasi news, वाराणसी समाचार, India news today, national news, uttar pradesh news, education news, business news, tech reviews, banaras news, dalimss news" />
      <link rel="canonical" href={siteUrl} />

      {/* Geo Targeting */}
      <meta name="geo.region" content="IN-UP" />
      <meta name="geo.placename" content="India, Uttar Pradesh, Varanasi" />
      <meta name="geo.position" content="25.3176;82.9739" />
      <meta name="ICBM" content="25.3176, 82.9739" />
      <meta name="language" content="English, Hindi" />
      <meta name="content-language" content="en-IN, hi-IN" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Dalimss News" />
      <meta property="og:title" content="Dalimss News — Latest India News, Uttar Pradesh, Varanasi, Education, Business & Reviews" />
      <meta property="og:description" content="Get the latest national news, Uttar Pradesh stories, Varanasi local updates, education exam alerts, business insights, and technology reviews from Dalimss News." />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={heroOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@dalimss_news" />
      <meta name="twitter:title" content="Dalimss News — Latest India News, Uttar Pradesh, Varanasi, Education, Business & Reviews" />
      <meta name="twitter:description" content="Get the latest national news, Uttar Pradesh stories, Varanasi local updates, education exam alerts, business insights, and technology reviews." />
      <meta name="twitter:image" content={heroOgImage} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </Head>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-0">
        
        {/* WEB STORIES CAROUSEL */}
        {stories && stories.length > 0 && (
          <section className="mb-8">
            <WebStoriesCarousel stories={stories} />
          </section>
        )}

        {/* HERO SECTION */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Hero Story */}
            <div className="lg:col-span-7">
              <div className="h-full border border-gray-100 rounded-lg overflow-hidden group bg-white hover:shadow-md transition-shadow">
                {heroArticle.mediaUrl && (
                  <div className="w-full h-64 md:h-[500px] bg-black overflow-hidden relative">
                    {/* Blurred Background for better aesthetics */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-50 blur-xl scale-110"
                      style={{ backgroundImage: `url(${heroArticle.mediaUrl})` }}
                    />
                    <img 
                      src={heroArticle.mediaUrl} 
                      alt={heroArticle.title}
                      className="relative z-10 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col">
                  <Link href={`/articles/${heroArticle.slug}`}>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-3 text-gray-900 hover:text-red-600 transition-colors">
                      {heroArticle.title}
                    </h1>
                  </Link>
                  <p className="hidden md:block text-gray-600 text-base line-clamp-3 max-w-full">
                    {typeof heroArticle.content === 'string' ? heroArticle.content.replace(/<[^>]+>/g, '').slice(0, 200) + '...' : ''}
                  </p>
                  
                  <div className="mt-4 flex items-center text-xs text-gray-500 font-semibold uppercase tracking-wider">
                     <span className="text-red-600 mr-2">Latest Story</span>
                     <time dateTime={heroArticle.createdAt} suppressHydrationWarning>
                       • {heroDate || new Date(heroArticle.createdAt).toLocaleDateString("en-IN")}
                     </time>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Stories Grid */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                {topStories.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="vertical" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT GRID */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Latest News */}
            <div className="lg:col-span-8">
              <SectionHeader 
                title={router.query.search ? `Search Results: ${router.query.search} (${articles.length})` : "Latest News"} 
              />
              <div className="flex flex-col gap-6">
                {latestNews.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-8 text-center bg-gray-50 p-4 rounded-lg">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {loadingMore ? "Loading..." : "Read More News"}
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Most Read / Trending */}
              {/* Most Read / Trending */}
              <div className="sticky top-4">
                <SectionHeader title="News Shorts" />
                <NewsShortsSidebar articles={articles} />
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
}

// Fetch articles
export const getServerSideProps: GetServerSideProps = async (context) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const { category, search } = context.query;
  const params = new URLSearchParams();
  if (category) params.append("category", String(category));
  if (search) params.append("search", String(search));
  
  // Set initial pagination
  params.append("page", "1");
  params.append("limit", "15");

  const queryString = params.toString() ? `?${params.toString()}` : "";

  try {
    const apiUrl = `${baseUrl}/api/articles${queryString}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }
    
    const articles = await res.json();

    // Fetch Web Stories
    let stories = [];
    try {
      const storiesRes = await fetch(`${baseUrl}/api/stories`);
      if (storiesRes.ok) {
        stories = await storiesRes.json();
      }
    } catch (e) {
      console.error("Error fetching stories:", e);
    }

    return { props: { articles, stories } };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { props: { articles: [], stories: [] } };
  }
};
