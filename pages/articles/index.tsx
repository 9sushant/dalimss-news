import { GetServerSideProps } from "next";
import Layout from "@/components/Layout";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

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

export default function AllArticlesPage({ articles }: Props) {
  // Fallback if no articles
  if (!articles || articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-400">No articles found.</h1>
      </div>
    );
  }

  const heroArticle = articles[0];
  const topStories = articles.slice(1, 5);
  const latestNews = articles.slice(5, 12);
  const sidebarNews = articles.slice(2, 8); // Just reusing for demo

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* HERO SECTION */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Hero Story */}
            <div className="lg:col-span-7">
              <div className="h-full border border-gray-100 rounded-lg overflow-hidden group relative">
                {heroArticle.mediaUrl && (
                  <div className="w-full h-64 md:h-96 overflow-hidden">
                    <img 
                      src={heroArticle.mediaUrl} 
                      alt={heroArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 bg-white absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 text-white">
                  <Link href={`/articles/${heroArticle.slug}`}>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-2 hover:text-red-400 transition-colors">
                      {heroArticle.title}
                    </h1>
                  </Link>
                  <p className="hidden md:block text-gray-200 text-sm line-clamp-2 max-w-2xl">
                    {typeof heroArticle.content === 'string' ? heroArticle.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : ''}
                  </p>
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
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                <SectionHeader title="Must Read" />
                <div className="flex flex-col gap-0">
                  {sidebarNews.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              </div>

              {/* Advertisement / Promo Placeholder */}
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg">
                Advertisement
              </div>

            </div>
          </div>
        </section>

      </div>
  );
}

// Fetch articles
export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    const apiUrl = `${baseUrl}/api/articles`;
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
