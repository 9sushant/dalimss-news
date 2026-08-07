import Link from "next/link";
import { PlayIcon } from "@heroicons/react/24/solid";
import {
  PodcastEpisodeData,
  formatDuration,
  formatEpisodeLabel,
} from "@/lib/podcasts";

interface PodcastCardProps {
  episode: PodcastEpisodeData;
}

export default function PodcastCard({ episode }: PodcastCardProps) {
  return (
    <Link
      href={`/ott/${episode.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <img
          src={episode.coverImage}
          alt={`${episode.title} cover`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/55 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
          {episode.mediaType === "video" ? "Watch" : "Listen"}
        </div>
        <div className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white text-slate-950 shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-[#ff4d3d] group-hover:text-white">
          <PlayIcon className="ml-0.5 h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e23b2e]">
          <span>
            {formatEpisodeLabel(
              episode.seasonNumber,
              episode.episodeNumber
            )}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-slate-500">
            {formatDuration(episode.duration)}
          </span>
        </div>
        <h2 className="font-serif text-xl font-semibold leading-snug text-slate-950 transition group-hover:text-[#d9362a]">
          {episode.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {episode.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-slate-500">
          <span className="truncate">With {episode.hostName}</span>
          {episode.category && (
            <span className="flex-none rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600">
              {episode.category}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
