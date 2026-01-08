import Link from "next/link";
import { Article } from "@/types";

interface Props {
  article: Article;
}

const NewsShortCard = ({ article }: Props) => {
  const cleanDescription = (html: string | null) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").slice(0, 150) + "...";
  };

  const formattedDate = new Date(article.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6 flex flex-col relative group hover:shadow-xl transition-shadow duration-300">
      
      {/* 1. Image Section */}
      <div className="relative w-full h-[200px] overflow-hidden">
        {article.mediaUrl ? (
          <img
            src={article.mediaUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Category Badge overlay */}
        {article.category && (
            <span className="absolute top-3 left-3 bg-[#E21B22] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                {article.category}
            </span>
        )}
      </div>

      {/* 2. Content */}
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/articles/${article.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 hover:text-[#E21B22] transition-colors line-clamp-3">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center text-xs text-gray-500 mb-3 font-medium">
             <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded mr-2">Short News</span>
            <span>{formattedDate}</span>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow line-clamp-4">
          {cleanDescription(article.content)}
        </p>

        {/* 3. Footer / Action */}
        <div className="mt-auto">
             <Link
                href={`/articles/${article.slug}`}
                className="block w-full text-center bg-[#ff5722] hover:bg-[#e64a19] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-sm"
              >
                Read More
              </Link>
        </div>
        
        {/* Decorative 'Swipe Up' hint (Optional, mainly for visual parity with request) */}
        <div className="mt-3 text-center opacity-60">
             <div className="flex flex-col items-center justify-center text-[10px] text-gray-500 uppercase tracking-widest gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 animate-bounce">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                Swipe for next
             </div>
        </div>
      </div>
    </div>
  );
};

export default NewsShortCard;
