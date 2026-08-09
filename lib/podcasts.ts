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

export const OTT_CONTENT_TYPES = [
  "episode",
  "trailer",
  "teaser",
  "short-film",
  "documentary",
  "interview",
] as const;

export type OttContentType = (typeof OTT_CONTENT_TYPES)[number];

export function normalizeOttContentType(value: unknown): OttContentType {
  return typeof value === "string" &&
    OTT_CONTENT_TYPES.includes(value as OttContentType)
    ? (value as OttContentType)
    : "episode";
}

export function formatContentType(value?: string | null): string {
  const type = normalizeOttContentType(value);
  if (type === "short-film") return "Short Film";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

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
  muxAssetId: string | null;
  mediaBytes: string | null;
  mediaMimeType: string | null;
  mediaType: string;
  contentType: string;
  explicit: boolean;
  featured: boolean;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export function formatDuration(totalSeconds?: number | null): string {
  if (totalSeconds === null || totalSeconds === undefined) return "New release";
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
  episodeNumber?: number | null,
  contentType?: string | null
): string {
  const type = normalizeOttContentType(contentType);
  if (type !== "episode") return formatContentType(type);
  if (seasonNumber && episodeNumber) {
    return `S${seasonNumber} · E${episodeNumber}`;
  }
  if (episodeNumber) return `Episode ${episodeNumber}`;
  return "Episode";
}
