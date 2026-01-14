import Link from "next/link";

interface StoryPage {
  id: number;
  imageUrl: string;
  heading: string | null;
  text: string | null;
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
  stories: WebStory[];
}

const WebStoriesCarousel = ({ stories }: Props) => {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Web Stories
        </h2>
        <Link href="/stories" className="text-sm text-red-600 hover:text-red-700 font-semibold">
          View All →
        </Link>
      </div>

      {/* Stories Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/stories/${story.slug}`}
            className="flex-shrink-0 group"
          >
            <div className="relative w-[140px] h-[200px] md:w-[160px] md:h-[240px] rounded-xl overflow-hidden shadow-lg border-2 border-white hover:border-red-500 transition-all">
              {/* Cover Image */}
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Title */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white text-sm font-bold leading-tight line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-white/60 text-[10px] mt-1" suppressHydrationWarning>
                  {new Date(story.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Story Ring Indicator */}
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-500 to-orange-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WebStoriesCarousel;
