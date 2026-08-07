import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  MicrophoneIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import {
  PodcastEpisodeData,
  formatContentType,
  formatDuration,
  formatEpisodeLabel,
} from "@/lib/podcasts";
import PodcastPlayer from "@/components/PodcastPlayer";
import PodcastCard from "@/components/PodcastCard";
import ShareButton from "@/components/ShareButton";
import OttVideoPlayer from "@/components/OttVideoPlayer";
import { getOttVideoSources } from "@/lib/ottVideoSources";

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
  const canonicalUrl = `${SITE_URL}/ott/${episode.slug}`;
  const publishedDate = new Date(episode.publishedAt).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );
  const displayShowName =
    episode.showName === "Dalimss News Podcasts"
      ? "Dalimss News OTT"
      : episode.showName;
  const contentTypeLabel = formatContentType(episode.contentType);

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
      name: displayShowName,
      url: `${SITE_URL}/ott`,
    },
    actor: {
      "@type": "Person",
      name: episode.hostName,
    },
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete this OTT ${contentTypeLabel.toLowerCase()} permanently?`)) return;
    const response = await fetch(`/api/podcasts/${episode.slug}`, {
      method: "DELETE",
    });
    if (response.ok) {
      window.location.href = "/ott";
      return;
    }
    const data = await response.json();
    window.alert(data.error || "Unable to delete this OTT release");
  };

  return (
    <>
      <Head>
        <title>{episode.title} | Dalimss OTT</title>
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

      <article className="bg-[#05070b] text-white">
        <section className="relative min-h-[700px] overflow-hidden lg:min-h-[calc(100vh-4rem)]">
          <img
            src={episode.coverImage}
            alt=""
            className="absolute inset-[-8%] h-[116%] w-[116%] scale-110 object-cover object-center opacity-60 blur-[52px] saturate-[1.45]"
          />
          <img
            src={episode.coverImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-30 saturate-125 lg:object-[68%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070b]/95 via-[#05070b]/68 to-[#05070b]/48" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070b]/90 via-transparent to-[#05070b]/55" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,transparent_0%,rgba(5,7,11,.08)_34%,rgba(5,7,11,.72)_100%)]" />

          <div className="relative mx-auto flex min-h-[700px] max-w-[1480px] flex-col px-4 py-7 sm:px-6 lg:min-h-[calc(100vh-4rem)] lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/ott"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur-xl transition hover:border-white/25 hover:text-white"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                All episodes
              </Link>

              {isEditor && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/ott/${episode.slug}/edit`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs font-bold text-white/80 backdrop-blur-xl transition hover:bg-white hover:text-slate-950"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-full border border-red-400/25 bg-black/25 px-4 py-2 text-xs font-bold text-red-200 backdrop-blur-xl transition hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12 xl:gap-16">
              <div className="max-w-2xl">
                <div className="mb-5 flex flex-wrap items-center gap-2.5 text-[11px] font-extrabold uppercase tracking-[0.18em]">
                  <span className="rounded-md bg-[#f04438] px-2.5 py-1 text-white">
                    Dalimss Original
                  </span>
                  <span className="text-white/75">
                    {formatEpisodeLabel(
                      episode.seasonNumber,
                      episode.episodeNumber,
                      episode.contentType
                    )}
                  </span>
                </div>

                <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white drop-shadow-2xl sm:text-5xl xl:text-6xl">
                  {episode.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-white/70">
                  <span className="text-emerald-400">New</span>
                  <span>{new Date(episode.publishedAt).getFullYear()}</span>
                  <span>{formatDuration(episode.duration)}</span>
                  <span className="rounded border border-white/35 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                    {episode.language}
                  </span>
                  {episode.category && <span>{episode.category}</span>}
                  {episode.explicit && (
                    <span className="rounded border border-white/30 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                      Explicit
                    </span>
                  )}
                </div>

                <p className="mt-5 line-clamp-3 text-base leading-7 text-white/75 drop-shadow-lg">
                  {episode.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
                  <span>
                    <span className="text-white/35">Hosted by</span>{" "}
                    <span className="font-semibold text-white/85">
                      {episode.hostName}
                    </span>
                  </span>
                  {episode.guestNames && (
                    <span>
                      <span className="text-white/35">Featuring</span>{" "}
                      <span className="font-semibold text-white/85">
                        {episode.guestNames}
                      </span>
                    </span>
                  )}
                </div>

                <div className="mt-7">
                  <ShareButton
                    url={`/ott/${episode.slug}`}
                    title={episode.title}
                    variant="full"
                    className="[&_button]:!rounded-lg [&_button]:!bg-white/15 [&_button]:!px-5 [&_button]:!py-3 [&_button]:!font-bold [&_button]:!text-white [&_button]:!backdrop-blur-xl hover:[&_button]:!bg-white/25"
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="relative">
                  <img
                    src={episode.coverImage}
                    alt=""
                    className="pointer-events-none absolute -inset-8 h-[calc(100%+4rem)] w-[calc(100%+4rem)] scale-105 object-cover opacity-55 blur-[48px] saturate-[1.6]"
                  />
                  <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/80 p-1.5 shadow-[0_35px_120px_rgba(0,0,0,.7)] ring-1 ring-white/[0.06] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-2">
                  {episode.videoUrl ? (
                    <OttVideoPlayer
                      src={episode.videoUrl}
                      sources={getOttVideoSources(episode.slug)}
                      poster={episode.coverImage}
                      title={episode.title}
                    />
                  ) : episode.audioUrl ? (
                    <div className="grid items-center gap-5 rounded-xl bg-white/[0.04] p-5 sm:rounded-[1.3rem] md:grid-cols-[150px_1fr]">
                      <img
                        src={episode.coverImage}
                        alt={`${episode.title} cover`}
                        className="aspect-square w-full max-w-[150px] rounded-xl object-cover shadow-2xl"
                      />
                      <PodcastPlayer
                        src={episode.audioUrl}
                        title={episode.title}
                      />
                    </div>
                  ) : null}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-white/45">
                  <span className="font-bold uppercase tracking-[0.18em] text-[#ff6254]">
                    {episode.mediaType === "video"
                      ? `Watch ${contentTypeLabel.toLowerCase()}`
                      : `Listen to ${contentTypeLabel.toLowerCase()}`}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {publishedDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/[0.07] bg-[#0b0e14] py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#ff6254]">
                About this {contentTypeLabel.toLowerCase()}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                The story behind the screen
              </h2>
              <div className="mt-6 max-w-3xl whitespace-pre-line text-base leading-8 text-white/65 sm:text-lg">
                {episode.description}
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <dl className="grid gap-6 text-sm">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                    Series
                  </dt>
                  <dd className="mt-1.5 font-semibold text-white">
                    {displayShowName}
                  </dd>
                </div>
                <div className="grid grid-cols-2 gap-5 border-t border-white/10 pt-5">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                      Runtime
                    </dt>
                    <dd className="mt-1.5 font-semibold text-white">
                      {formatDuration(episode.duration)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                      Format
                    </dt>
                    <dd className="mt-1.5 font-semibold capitalize text-white">
                      {episode.mediaType}
                    </dd>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                    Host
                  </dt>
                  <dd className="mt-1.5 inline-flex items-center gap-2 font-semibold text-white">
                    <MicrophoneIcon className="h-4 w-4 text-[#ff6254]" />
                    {episode.hostName}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      </article>

      {relatedEpisodes.length > 0 && (
        <section className="bg-[#f4f3ef] py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#df3d31]">
              More from Dalimss
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Up next
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
