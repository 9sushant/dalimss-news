export interface OttVideoSource {
  height: number;
  url: string;
}

const PARENTING_TEASER_SLUG =
  "we-put-three-new-mothers-in-a-room-and-asked-what-nobody-warned-them-about";

const VIDEO_SOURCES: Record<string, OttVideoSource[]> = {
  [PARENTING_TEASER_SLUG]: [
    {
      height: 2160,
      url: "https://8mjpruwgqc0qkgho.public.blob.vercel-storage.com/dalimss-podcasts/episodes/1786089042120-img-7931-DscG5UJm4XJY9Mkb389UDXvjxDfjHw.mp4",
    },
    {
      height: 480,
      url: `/ott-media/${PARENTING_TEASER_SLUG}/480p.mp4`,
    },
    {
      height: 720,
      url: `/ott-media/${PARENTING_TEASER_SLUG}/720p.mp4`,
    },
    {
      height: 1080,
      url: `/ott-media/${PARENTING_TEASER_SLUG}/1080p.mp4`,
    },
  ],
};

const EMPTY_VIDEO_SOURCES: OttVideoSource[] = [];

export function getOttVideoSources(slug: string): OttVideoSource[] {
  return VIDEO_SOURCES[slug] || EMPTY_VIDEO_SOURCES;
}
