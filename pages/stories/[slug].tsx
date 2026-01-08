import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";

interface StoryPage {
  id: number;
  imageUrl: string;
  heading: string | null;
  text: string | null;
  order: number;
}

interface WebStory {
  id: number;
  slug: string;
  title: string;
  coverImage: string;
  createdAt: string;
  pages: StoryPage[];
}

interface Props {
  story: WebStory | null;
}

export default function WebStoryPage({ story }: Props) {
  const [currentPage, setCurrentPage] = useState(0);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Story not found</h1>
          <Link href="/" className="text-red-500 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const page = story.pages[currentPage];
  const totalPages = story.pages.length;

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Head>
        <title>{story.title} | Dalimss News</title>
        <meta name="description" content={story.title} />
        <link rel="canonical" href={`https://dalimss.news/stories/${story.slug}`} />
        
        {/* Schema.org for Web Stories */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://dalimss.news/stories/${story.slug}`
              },
              "headline": story.title,
              "image": story.pages.map(p => p.imageUrl),
              "datePublished": story.createdAt,
              "dateModified": story.createdAt,
              "author": {
                "@type": "Organization",
                "name": "Dalimss News"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Dalimss News",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://dalimss.news/logo.png"
                }
              }
            })
          }}
        />
      </Head>

      {/* Full Screen Story Viewer */}
      <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 md:p-8">
        
        {/* Story Container - Smaller and more compact */}
        <div className="relative w-full max-w-[320px] md:max-w-[360px] h-auto max-h-[85vh] aspect-[9/16] mx-auto rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Close Button - Inside container but with proper z-index */}
          <Link 
            href="/"
            className="absolute top-3 left-3 z-[60] bg-black/60 backdrop-blur-sm p-2 rounded-full text-white hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>

          {/* Edit Button */}
          <Link 
            href={`/stories/${story.slug}/edit`}
            className="absolute top-3 right-3 z-[60] bg-black/60 backdrop-blur-sm p-2 rounded-full text-white hover:bg-blue-600 transition-colors"
            title="Edit Story"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </Link>

          {/* Progress Bar - Between the two buttons */}
          <div className="absolute top-3.5 left-12 right-12 z-[55] flex gap-1">
            {story.pages.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx < currentPage ? 'bg-white' : idx === currentPage ? 'bg-white/80' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Story Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={page.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            {page.heading && (
              <h2 className="text-white text-lg md:text-xl font-bold mb-1 drop-shadow-lg line-clamp-3">
                {page.heading}
              </h2>
            )}
            {page.text && (
              <p className="text-white/90 text-sm drop-shadow-md line-clamp-4">
                {page.text}
              </p>
            )}
          </div>

          {/* Navigation Areas */}
          <div className="absolute inset-0 flex z-20">
            {/* Left tap area */}
            <div 
              className="w-1/3 h-full cursor-pointer"
              onClick={goPrev}
            />
            {/* Right tap area */}
            <div 
              className="w-2/3 h-full cursor-pointer"
              onClick={goNext}
            />
          </div>

          {/* Navigation Arrows */}
          {currentPage > 0 && (
            <button 
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          
          {currentPage < totalPages - 1 && (
            <button 
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* End of Story */}
          {currentPage === totalPages - 1 && (
            <div className="absolute bottom-20 left-0 right-0 flex justify-center z-30">
              <Link
                href="/"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = String(params?.slug || "");

  try {
    const story = await (prisma as any).webStory.findUnique({
      where: { slug },
      include: { pages: { orderBy: { order: "asc" } } },
    });

    if (!story) {
      return { props: { story: null } };
    }

    return {
      props: {
        story: JSON.parse(JSON.stringify(story)),
      },
    };
  } catch (err) {
    console.error("Story fetch error:", err);
    return { props: { story: null } };
  }
};
