import { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/types";
import ImageWithFallback from "@/components/ImageWithFallback";

interface Props {
  article: Article;
}

const NewsShortCard = ({ article }: Props) => {
  const [formattedDate, setFormattedDate] = useState<string>('');

  // Format date on client-side only to prevent hydration mismatch
  useEffect(() => {
    setFormattedDate(
      new Date(article.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [article.createdAt]);

  const cleanDescription = (html: string | null) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "").slice(0, 250) + "...";
  };

  return (
    <div className="relative mx-auto w-full max-w-[360px] bg-white rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border-[6px] border-gray-900 overflow-hidden mb-10 group">
      
      {/* Phone Notion: Top Bar mimic (Optional aesthetic touch) */}
      <div className="bg-[#ff8f00] h-1.5 w-full absolute top-0 z-10"></div>
      
      {/* 1. Header Area (optional "Top News" banner style from image) */}
      <div className="absolute top-0 w-full z-10 flex justify-center mt-3 pointer-events-none">
          {/* Notch / Dynamic Island mimic if desired, or just clean */}
      </div>

      {/* 2. Image Section */}
      <div className="relative w-full h-[260px] bg-gray-100">
        {article.mediaUrl ? (
          <ImageWithFallback
            src={article.mediaUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-t from-gray-900 to-gray-700 flex items-center justify-center">
             <span className="text-white font-bold tracking-widest opacity-30">DALIMSS</span>
          </div>
        )}
        
        {/* Share Icon Overlay */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm p-1.5 rounded-full text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.287.696.345 1.084m-1.425-.662l3.22-4.293c.81-1.08 2.336-1.08 3.146 0l3.22 4.293m-9.586-2.502c-.22.842-.294 1.73-.205 2.625" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
        </div>
      </div>

      {/* 3. Content Section */}
      <div className="p-5 pt-4 bg-white flex flex-col h-auto min-h-[300px]">
        
        {/* Headline */}
        <Link href={`/articles/${article.slug}`}>
          <h2 className="text-[20px] leading-[1.3] font-bold text-gray-900 mb-2 font-serif tracking-tight hover:text-[#ff5722] transition-colors">
            {article.title}
          </h2>
        </Link>
        
        {/* Meta Data */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
             <span className="bg-[#ff6d00] text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                {article.category || "News"}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
                {formattedDate}
            </span>
        </div>

        {/* Story Text */}
        <p className="text-[14px] text-gray-700 leading-[1.6] font-sans text-justify mb-5 line-clamp-[8]">
          {cleanDescription(article.content)}
        </p>

        {/* Read More Button */}
        <div className="mt-auto">
             <Link
                href={`/articles/${article.slug}`}
                className="block w-full bg-[#ff6d00] hover:bg-[#ef6c00] active:bg-[#e65100] text-white text-[14px] font-bold text-center py-3 rounded-[4px] shadow-sm transition-transform active:scale-[0.98]"
              >
                Read More
              </Link>
        </div>

        {/* Bottom Scroll Hint */}
        {/* <div className="mt-4 flex justify-center opacity-30">
            <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
        </div> */}
      </div>
    </div>
  );
};

export default NewsShortCard;
