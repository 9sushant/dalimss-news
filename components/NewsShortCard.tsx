import Link from "next/link";
import { Article } from "@/types";

interface Props {
  article: Article;
}

const NewsShortCard = ({ article }: Props) => {
  const cleanDescription = (html: string | null) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").slice(0, 200) + "...";
  };

  const formattedDate = new Date(article.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden mb-8 flex flex-col relative w-full h-auto max-w-sm mx-auto group">
      
      {/* 1. Image Section (Top Half) */}
      <div className="relative w-full h-[240px] overflow-hidden">
        {article.mediaUrl ? (
          <img
            src={article.mediaUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
            <span className="text-white text-2xl font-bold opacity-30">DALIMSS NEWS</span>
          </div>
        )}
        
        {/* Share/Action icons could go here if needed, keeping it clean for now */}
      </div>

      {/* 2. Content Section */}
      <div className="p-5 flex flex-col">
        
        {/* Title */}
        <Link href={`/articles/${article.slug}`}>
          <h3 className="text-[19px] leading-snug font-bold text-gray-900 mb-3 font-serif hover:text-[#f24e1e] transition-colors">
            {article.title}
          </h3>
        </Link>
        
        {/* Meta Row: Tag & Date */}
        <div className="flex items-center gap-3 mb-4">
             <span className="bg-[#f06e39] text-white text-[10px] font-bold px-3 py-0.5 rounded-sm shadow-sm uppercase tracking-wide">
                {article.category || "General"}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
                {formattedDate}
            </span>
        </div>

        {/* Description Snippet */}
        <p className="text-[14px] text-gray-700 leading-relaxed mb-6 font-sans text-justify">
          {cleanDescription(article.content)}
        </p>

        {/* Action Button */}
        <div className="mb-4">
             <Link
                href={`/articles/${article.slug}`}
                className="inline-block bg-[#ff6b3d] hover:bg-[#e65100] text-white text-[13px] font-semibold px-6 py-2 rounded-[4px] shadow-sm transition-colors"
              >
                Read Article
              </Link>
        </div>

        {/* Swipe Hint */}
        <div className="mt-2 flex items-center justify-center gap-2 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 animate-bounce text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
             <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                Swipe for next
             </span>
        </div>
      </div>
    </div>
  );
};

export default NewsShortCard;
