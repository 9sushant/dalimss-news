import { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import NewsShortCard from "@/components/NewsShortCard";
import { Article } from "@/types";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

interface Props {
  articles: Article[];
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

export default function HomePage({ articles }: Props) {
  const { data: session } = useSession();

  // Fallback if no articles
  if (!articles || articles.length === 0) {
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
  // 🔥 UPDATED: "Latest News" now acts as a complete feed, including top stories
  const latestNews = articles; 
  const sidebarNews = articles.slice(2, 8); // Just reusing for demo

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-0">
        
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
                     <span>• {new Date(heroArticle.createdAt).toLocaleDateString()}</span>
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
              <SectionHeader title="Latest News" />
              <div className="flex flex-col gap-6">
                {latestNews.map((article) => (
                  <ArticleCard key={article.id} article={article} variant="horizontal" />
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Most Read / Trending */}
              {/* Most Read / Trending */}
              <div className="bg-gray-50/50 p-4 rounded-lg">
                <SectionHeader title="News Shorts" />
                <div className="flex flex-col gap-0 h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                  {sidebarNews.map((article) => (
                    <NewsShortCard key={article.id} article={article} />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
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

  const queryString = params.toString() ? `?${params.toString()}` : "";

  try {
    const apiUrl = `${baseUrl}/api/articles${queryString}`;
    const res = await fetch(apiUrl);
    
    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
    }
    
    const articles = await res.json();
    return { props: { articles } };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { props: { articles: [] } };
  }
};
