export const PODCAST_CATEGORIES = [
  "News & Politics",
  "Varanasi",
  "Education",
  "Technology",
  "Business",
  "Culture",
  "Health",
  "Interviews",
] as const;

export const PODCAST_LANGUAGES = ["Hindi", "English", "Hinglish"] as const;

export interface PodcastEpisodeData {
  id: number;
  slug: string;
  title: string;
  description: string;
  showName: string;
  hostName: string;
  guestNames: string | null;
  category: string | null;
  language: string;
  seasonNumber: number | null;
  episodeNumber: number | null;
  duration: number | null;
  coverImage: string;
  audioUrl: string | null;
  videoUrl: string | null;
  mediaBytes: string | null;
  mediaMimeType: string | null;
  mediaType: string;
  explicit: boolean;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function formatDuration(totalSeconds?: number | null): string {
  if (totalSeconds === null || totalSeconds === undefined) return "New episode";
  if (totalSeconds < 1) return "0:00";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatEpisodeLabel(
  seasonNumber?: number | null,
  episodeNumber?: number | null
): string {
  if (seasonNumber && episodeNumber) {
    return `S${seasonNumber} · E${episodeNumber}`;
  }
  if (episodeNumber) return `Episode ${episodeNumber}`;
  return "Dalimss Original";
}
