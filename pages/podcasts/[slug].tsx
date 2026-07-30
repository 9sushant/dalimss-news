import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  MicrophoneIcon,
  PlayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import {
  PodcastEpisodeData,
  formatDuration,
  formatEpisodeLabel,
} from "@/lib/podcasts";
import PodcastPlayer from "@/components/PodcastPlayer";
import PodcastCard from "@/components/PodcastCard";
import ShareButton from "@/components/ShareButton";

interface PodcastEpisodeProps {
  episode: PodcastEpisodeData;
  relatedEpisodes: PodcastEpisodeData[];
}

const EDITOR_EMAILS = new Set([
  "admin@dalimss.com",
  "sushantgaurav@dalimss.com",
  "dalimsssushant@gmail.com",
]);

export default function PodcastEpisodePage({
  episode,
  relatedEpisodes,
}: PodcastEpisodeProps) {
  const { data: session } = useSession();
  const isEditor =
    session?.user?.role === "admin" ||
    session?.user?.role === "editor" ||
    EDITOR_EMAILS.has(session?.user?.email || "");
  const canonicalUrl = `${SITE_URL}/podcasts/${episode.slug}`;
  const publishedDate = new Date(episode.publishedAt).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.description,
    url: canonicalUrl,
    datePublished: episode.publishedAt,
    timeRequired: episode.duration
      ? `PT${Math.round(episode.duration)}S`
      : undefined,
    episodeNumber: episode.episodeNumber || undefined,
    seasonNumber: episode.seasonNumber || undefined,
    image: episode.coverImage,
    associatedMedia: {
      "@type": episode.mediaType === "video" ? "VideoObject" : "AudioObject",
      contentUrl: episode.videoUrl || episode.audioUrl,
      name: episode.title,
      uploadDate: episode.publishedAt,
    },
    partOfSeries: {
      "@type": "PodcastSeries",
      name: episode.showName,
      url: `${SITE_URL}/podcasts`,
    },
    actor: {
      "@type": "Person",
      name: episode.hostName,
    },
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this podcast episode permanently?")) return;
    const response = await fetch(`/api/podcasts/${episode.slug}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.href = "/podcasts";
      return;
    }
    const data = await response.json();
    window.alert(data.error || "Unable to delete this episode");
  };

  return (
    <>
      <Head>
        <title>{episode.title} | Dalimss Podcasts</title>
        <meta name="description" content={episode.description.slice(0, 160)} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="music.song" />
        <meta property="og:title" content={episode.title} />
        <meta
          property="og:description"
          content={episode.description.slice(0, 200)}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={episode.coverImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={episode.title} />
        <meta
          name="twitter:description"
          content={episode.description.slice(0, 200)}
        />
        <meta name="twitter:image" content={episode.coverImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <article className="bg-[#080c15] text-white">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center opacity-20 blur-3xl"
            style={{ backgroundImage: `url("${episode.coverImage}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c15]/65 via-[#080c15]/90 to-[#080c15]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-20 lg:px-8">
            <div className="mb-9 flex items-center justify-between gap-4">
              <Link
                href="/podcasts"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 transition hover:text-white"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                All podcasts
              </Link>
              <div className="flex items-center gap-2">
                <ShareButton
                  url={`/podcasts/${episode.slug}`}
                  title={episode.title}
                  variant="full"
                />
                {isEditor && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="grid items-center gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div className="mx-auto w-full max-w-[520px]">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_35px_100px_rgba(0,0,0,.5)]">
                  <img
                    src={episode.coverImage}
                    alt={`${episode.title} cover`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff675b]">
                  <span>
                    {formatEpisodeLabel(
                      episode.seasonNumber,
                      episode.episodeNumber
                    )}
                  </span>
                  {episode.category && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-white/25" />
                      <span className="text-white/45">{episode.category}</span>
                    </>
                  )}
                  <span className="h-1 w-1 rounded-full bg-white/25" />
                  <span className="text-white/45">{episode.language}</span>
                </div>
                <h1 className="mt-5 max-w-3xl font-serif text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  {episode.title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
                  {episode.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
                  <span className="inline-flex items-center gap-2">
                    <MicrophoneIcon className="h-4 w-4 text-[#ff675b]" />
                    {episode.hostName}
                  </span>
                  {episode.guestNames && (
                    <span className="inline-flex items-center gap-2">
                      <UserGroupIcon className="h-4 w-4 text-[#ff675b]" />
                      {episode.guestNames}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 text-[#ff675b]" />
                    {publishedDate}
                  </span>
                </div>

                <div className="mt-8">
                  {episode.audioUrl ? (
                    <PodcastPlayer
                      src={episode.audioUrl}
                      title={episode.title}
                    />
                  ) : episode.videoUrl ? (
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
                      <video
                        src={episode.videoUrl}
                        poster={episode.coverImage}
                        controls
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full"
                      >
                        Your browser does not support video playback.
                      </video>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f6f2] py-14 text-slate-900 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#df3d31]">
                Episode notes
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold">
                About this conversation
              </h2>
              <div className="mt-6 whitespace-pre-line font-serif text-lg leading-8 text-slate-700">
                {episode.description}
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-5 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Show
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {episode.showName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Runtime
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatDuration(episode.duration)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Format
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 font-semibold capitalize text-slate-900">
                    <PlayIcon className="h-4 w-4 text-[#df3d31]" />
                    {episode.mediaType} original
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </article>

      {relatedEpisodes.length > 0 && (
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-semibold text-slate-950">
              Continue listening
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEpisodes.map((relatedEpisode) => (
                <PodcastCard
                  key={relatedEpisode.id}
                  episode={relatedEpisode}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<
  PodcastEpisodeProps
> = async ({ params }) => {
  const slug = String(params?.slug || "");
  const episode = await prisma.podcastEpisode.findUnique({
    where: { slug },
  });

  if (!episode || !episode.published) {
    return { notFound: true };
  }

  const relatedEpisodes = await prisma.podcastEpisode.findMany({
    where: {
      published: true,
      id: { not: episode.id },
      ...(episode.category ? { category: episode.category } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return {
    props: JSON.parse(
      JSON.stringify({
        episode,
        relatedEpisodes,
      })
    ),
  };
};
