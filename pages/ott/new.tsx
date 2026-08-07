import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { upload as uploadBlob } from "@vercel/blob/client";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  FilmIcon,
  MicrophoneIcon,
  MusicalNoteIcon,
  PhotoIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  PODCAST_CATEGORIES,
  PODCAST_LANGUAGES,
  PodcastEpisodeData,
} from "@/lib/podcasts";
import { compressImage } from "@/utils/compressImage";

const EDITOR_EMAILS = new Set([
  "admin@dalimss.com",
  "sushantgaurav@dalimss.com",
  "dalimsssushant@gmail.com",
]);

type MediaType = "audio" | "video";

function safeFilename(filename: string) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getMediaDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const element = document.createElement(
      file.type.startsWith("video/") ? "video" : "audio"
    );
    const objectUrl = URL.createObjectURL(file);
    element.preload = "metadata";
    element.onloadedmetadata = () => {
      const duration = Number.isFinite(element.duration)
        ? Math.round(element.duration)
        : 0;
      URL.revokeObjectURL(objectUrl);
      resolve(duration);
    };
    element.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(0);
    };
    element.src = objectUrl;
  });
}

export default function NewPodcastEpisode() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isEditing = router.pathname === "/ott/[slug]/edit";
  const editSlug =
    typeof router.query.slug === "string" ? router.query.slug : "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showName, setShowName] = useState("Dalimss News OTT");
  const [hostName, setHostName] = useState("");
  const [guestNames, setGuestNames] = useState("");
  const [category, setCategory] = useState("News & Politics");
  const [language, setLanguage] = useState("Hindi");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("audio");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [existingCoverImage, setExistingCoverImage] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [existingMediaUrl, setExistingMediaUrl] = useState("");
  const [existingMediaBytes, setExistingMediaBytes] = useState<string | null>(
    null
  );
  const [existingMediaMimeType, setExistingMediaMimeType] = useState<
    string | null
  >(null);
  const [duration, setDuration] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [explicit, setExplicit] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingEpisode, setLoadingEpisode] = useState(isEditing);

  const isEditor =
    session?.user?.role === "admin" ||
    session?.user?.role === "editor" ||
    EDITOR_EMAILS.has(session?.user?.email || "");

  useEffect(() => {
    if (!isEditing || !editSlug || !isEditor) return;

    let cancelled = false;
    setLoadingEpisode(true);
    fetch(`/api/podcasts/${editSlug}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to load this episode");
        }
        return data as PodcastEpisodeData;
      })
      .then((episode) => {
        if (cancelled) return;
        const episodeMediaType: MediaType =
          episode.mediaType === "video" ? "video" : "audio";
        setTitle(episode.title);
        setDescription(episode.description);
        setShowName(episode.showName);
        setHostName(episode.hostName);
        setGuestNames(episode.guestNames || "");
        setCategory(episode.category || "News & Politics");
        setLanguage(episode.language);
        setSeasonNumber(episode.seasonNumber?.toString() || "");
        setEpisodeNumber(episode.episodeNumber?.toString() || "");
        setMediaType(episodeMediaType);
        setCoverPreview(episode.coverImage);
        setExistingCoverImage(episode.coverImage);
        setExistingMediaUrl(
          episodeMediaType === "video"
            ? episode.videoUrl || ""
            : episode.audioUrl || ""
        );
        setExistingMediaBytes(episode.mediaBytes);
        setExistingMediaMimeType(episode.mediaMimeType);
        setDuration(episode.duration || 0);
        setFeatured(episode.featured);
        setExplicit(episode.explicit);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load this episode"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingEpisode(false);
      });

    return () => {
      cancelled = true;
    };
  }, [editSlug, isEditing, isEditor]);

  const descriptionCount = description.trim().length;
  const canPublish = useMemo(
    () =>
      title.trim().length >= 3 &&
      descriptionCount >= 30 &&
      hostName.trim().length >= 2 &&
      Boolean(coverFile || existingCoverImage) &&
      Boolean(mediaFile || existingMediaUrl),
    [
      coverFile,
      descriptionCount,
      existingCoverImage,
      existingMediaUrl,
      hostName,
      mediaFile,
      title,
    ]
  );

  if (status === "loading") {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#080c15] text-white">
        Preparing the studio…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#080c15] px-6 text-center text-white">
        <div>
          <MicrophoneIcon className="mx-auto h-10 w-10 text-[#ff5a4c]" />
          <h1 className="mt-5 font-serif text-3xl font-semibold">
            Sign in to open the studio
          </h1>
          <button
            type="button"
            onClick={() => signIn()}
            className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (!isEditor) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#080c15] px-6 text-center text-white">
        <div>
          <h1 className="font-serif text-3xl font-semibold">
            Editorial access required
          </h1>
          <p className="mt-3 text-white/55">
            Only Dalimss editors can publish OTT episodes.
          </p>
        </div>
      </div>
    );
  }

  if (loadingEpisode) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#080c15] text-white">
        Loading episode…
      </div>
    );
  }

  const handleCoverSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let file = event.target.files?.[0] || null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Cover artwork must be an image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Cover artwork must be under 10 MB.");
      return;
    }

    if (file.size > 800 * 1024) {
      try {
        file = await compressImage(file);
      } catch (compressionError) {
        console.warn("Cover compression skipped:", compressionError);
      }
    }

    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleMediaSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    const expectedPrefix = mediaType === "audio" ? "audio/" : "video/";
    if (!file.type.startsWith(expectedPrefix)) {
      setError(`Please choose a valid ${mediaType} file.`);
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024 * 1024) {
      setError("Episode files must be under 2 GB.");
      event.target.value = "";
      return;
    }

    setMediaFile(file);
    setDuration(await getMediaDuration(file));
    setError("");
  };

  const chooseMediaType = (nextType: MediaType) => {
    if (publishing || nextType === mediaType) return;
    setMediaType(nextType);
    setMediaFile(null);
    setExistingMediaUrl("");
    setExistingMediaBytes(null);
    setExistingMediaMimeType(null);
    setDuration(0);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canPublish) {
      setError(
        "Add the title, description, host, cover artwork and episode file."
      );
      return;
    }

    setPublishing(true);
    setError("");

    try {
      let coverImage = existingCoverImage;
      if (coverFile) {
        setStatusMessage("Uploading cover artwork…");
        const coverBlob = await uploadBlob(
          `dalimss-podcasts/covers/${Date.now()}-${safeFilename(
            coverFile.name
          )}`,
          coverFile,
          {
            access: "public",
            handleUploadUrl: "/api/podcasts/upload",
            clientPayload: JSON.stringify({ kind: "cover" }),
            contentType: coverFile.type,
            onUploadProgress: ({ percentage }) =>
              setProgress(Math.round(percentage * 0.15)),
          }
        );
        coverImage = coverBlob.url;
      }

      let mediaUrl = existingMediaUrl;
      let mediaBytes: number | string | null = existingMediaBytes;
      let mediaMimeType = existingMediaMimeType;
      if (mediaFile) {
        setStatusMessage(
          `Uploading ${mediaType}… You can keep this tab open in the background.`
        );
        const mediaBlob = await uploadBlob(
          `dalimss-podcasts/episodes/${Date.now()}-${safeFilename(
            mediaFile.name
          )}`,
          mediaFile,
          {
            access: "public",
            handleUploadUrl: "/api/podcasts/upload",
            clientPayload: JSON.stringify({ kind: "episode" }),
            contentType: mediaFile.type,
            multipart: true,
            onUploadProgress: ({ percentage }) =>
              setProgress(15 + Math.round(percentage * 0.8)),
          }
        );
        mediaUrl = mediaBlob.url;
        mediaBytes = mediaFile.size;
        mediaMimeType = mediaFile.type;
      }

      setStatusMessage(isEditing ? "Saving changes…" : "Publishing episode…");
      setProgress(97);
      const response = await fetch(
        isEditing ? `/api/podcasts/${editSlug}` : "/api/podcasts",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            showName,
            hostName,
            guestNames,
            category,
            language,
            seasonNumber,
            episodeNumber,
            duration,
            coverImage,
            audioUrl: mediaType === "audio" ? mediaUrl : null,
            videoUrl: mediaType === "video" ? mediaUrl : null,
            mediaBytes,
            mediaMimeType,
            mediaType,
            explicit,
            featured,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEditing
              ? "Unable to save this episode"
              : "Unable to publish this episode")
        );
      }

      setProgress(100);
      setStatusMessage(isEditing ? "Changes saved" : "Episode published");
      await router.push(`/ott/${data.slug}`);
    } catch (publishError) {
      console.error("Podcast save failed:", publishError);
      setError(
        publishError instanceof Error
          ? publishError.message
          : isEditing
            ? "Unable to save this episode"
            : "Unable to publish this episode"
      );
      setStatusMessage("");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {isEditing ? "Edit episode" : "OTT Studio"} | Dalimss News
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-[#080c15] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push(isEditing ? `/ott/${editSlug}` : "/ott")
            }
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to OTT
          </button>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
            <main>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                  <SparklesIcon className="h-3.5 w-3.5 text-[#ff5a4c]" />
                  Dalimss creator studio
                </div>
                <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
                  {isEditing ? "Edit episode" : "Publish a new episode"}
                </h1>
                <p className="mt-3 max-w-2xl text-white/50">
                  {isEditing
                    ? "Update the editorial details or replace the artwork and media file."
                    : "Upload video or audio, add the editorial details, and the episode will be ready across the website and OTT feed."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}

                {publishing && (
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-semibold text-emerald-100">
                        {statusMessage}
                      </span>
                      <span className="font-bold text-emerald-200">
                        {progress}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-[width] duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
                  <h2 className="font-serif text-2xl font-semibold">
                    Episode identity
                  </h2>
                  <div className="mt-6 space-y-5">
                    <label className="block">
                      <span className="text-sm font-semibold text-white/75">
                        Episode title
                      </span>
                      <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="A title listeners cannot scroll past"
                        maxLength={140}
                        className="mt-2 w-full rounded-2xl border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-white/25 focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                      />
                    </label>

                    <label className="block">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-white/75">
                          Description & show notes
                        </span>
                        <span
                          className={`text-xs ${
                            descriptionCount >= 30
                              ? "text-emerald-400"
                              : "text-white/35"
                          }`}
                        >
                          {descriptionCount} characters
                        </span>
                      </div>
                      <textarea
                        value={description}
                        onChange={(event) =>
                          setDescription(event.target.value)
                        }
                        placeholder="Tell listeners what they will learn, who joins the conversation, and why it matters…"
                        rows={7}
                        maxLength={5000}
                        className="mt-2 w-full rounded-2xl border-white/10 bg-black/20 px-4 py-3.5 text-white placeholder:text-white/25 focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                      />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-semibold text-white/75">
                          Show name
                        </span>
                        <input
                          value={showName}
                          onChange={(event) => setShowName(event.target.value)}
                          className="mt-2 w-full rounded-2xl border-white/10 bg-black/20 px-4 py-3 text-white focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-white/75">
                          Host
                        </span>
                        <input
                          value={hostName}
                          onChange={(event) => setHostName(event.target.value)}
                          placeholder="Host name"
                          className="mt-2 w-full rounded-2xl border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                        />
                      </label>
                      <label className="block sm:col-span-2">
                        <span className="text-sm font-semibold text-white/75">
                          Guests
                        </span>
                        <input
                          value={guestNames}
                          onChange={(event) =>
                            setGuestNames(event.target.value)
                          }
                          placeholder="Optional — separate multiple names with commas"
                          className="mt-2 w-full rounded-2xl border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                        />
                      </label>
                    </div>
                  </div>
                </section>

                <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
                  <h2 className="font-serif text-2xl font-semibold">
                    Artwork & media
                  </h2>
                  <p className="mt-2 text-sm text-white/45">
                    Square artwork works best. Audio and video files can be up
                    to 2 GB.
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <label className="group relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-3xl border border-dashed border-white/20 bg-black/20 transition hover:border-[#ff5a4c]/70 hover:bg-white/[0.04]">
                      {coverPreview ? (
                        <>
                          <img
                            src={coverPreview}
                            alt="OTT cover preview"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 transition group-hover:opacity-100" />
                          <span className="relative rounded-full bg-black/60 px-4 py-2 text-xs font-bold opacity-0 backdrop-blur transition group-hover:opacity-100">
                            Replace artwork
                          </span>
                        </>
                      ) : (
                        <div className="px-6 text-center">
                          <PhotoIcon className="mx-auto h-9 w-9 text-[#ff5a4c]" />
                          <p className="mt-4 text-sm font-bold">
                            Upload cover artwork
                          </p>
                          <p className="mt-1 text-xs text-white/35">
                            JPG, PNG, WebP or AVIF · 1:1 ratio
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleCoverSelection}
                        className="sr-only"
                        disabled={publishing}
                      />
                    </label>

                    <div>
                      <div className="grid grid-cols-2 rounded-2xl bg-black/25 p-1">
                        <button
                          type="button"
                          onClick={() => chooseMediaType("audio")}
                          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                            mediaType === "audio"
                              ? "bg-white text-slate-950"
                              : "text-white/45 hover:text-white"
                          }`}
                        >
                          <MusicalNoteIcon className="h-4 w-4" />
                          Audio
                        </button>
                        <button
                          type="button"
                          onClick={() => chooseMediaType("video")}
                          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                            mediaType === "video"
                              ? "bg-white text-slate-950"
                              : "text-white/45 hover:text-white"
                          }`}
                        >
                          <FilmIcon className="h-4 w-4" />
                          Video / OTT
                        </button>
                      </div>

                      <label className="mt-4 flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-black/20 px-5 text-center transition hover:border-[#ff5a4c]/70 hover:bg-white/[0.04]">
                        {mediaFile ? (
                          <>
                            <CheckCircleIcon className="h-9 w-9 text-emerald-400" />
                            <p className="mt-3 max-w-full truncate text-sm font-bold">
                              {mediaFile.name}
                            </p>
                            <p className="mt-1 text-xs text-white/40">
                              {(mediaFile.size / 1024 / 1024).toFixed(1)} MB
                              {duration
                                ? ` · ${Math.ceil(duration / 60)} min`
                                : ""}
                            </p>
                            <span className="mt-4 text-xs font-bold text-[#ff776c]">
                              Choose a different file
                            </span>
                          </>
                        ) : existingMediaUrl ? (
                          <>
                            <CheckCircleIcon className="h-9 w-9 text-emerald-400" />
                            <p className="mt-3 text-sm font-bold">
                              Current {mediaType} file
                            </p>
                            <p className="mt-1 text-xs text-white/40">
                              Keep this file or choose a replacement
                            </p>
                            <span className="mt-4 text-xs font-bold text-[#ff776c]">
                              Replace file
                            </span>
                          </>
                        ) : (
                          <>
                            <CloudArrowUpIcon className="h-9 w-9 text-[#ff5a4c]" />
                            <p className="mt-3 text-sm font-bold">
                              Choose {mediaType} file
                            </p>
                            <p className="mt-1 text-xs text-white/35">
                              {mediaType === "audio"
                                ? "MP3, M4A, WAV or OGG"
                                : "MP4, MOV or WebM"}
                            </p>
                          </>
                        )}
                        <input
                          type="file"
                          accept={
                            mediaType === "audio"
                              ? "audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/ogg"
                              : "video/mp4,video/quicktime,video/webm"
                          }
                          onChange={handleMediaSelection}
                          className="sr-only"
                          disabled={publishing}
                        />
                      </label>
                    </div>
                  </div>
                </section>

                <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
                  <h2 className="font-serif text-2xl font-semibold">
                    Distribution details
                  </h2>
                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-white/75">
                        Category
                      </span>
                      <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="mt-2 w-full rounded-2xl border-white/10 bg-[#10151f] px-4 py-3 text-white focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                      >
                        {PODCAST_CATEGORIES.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-white/75">
                        Language
                      </span>
                      <select
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                        className="mt-2 w-full rounded-2xl border-white/10 bg-[#10151f] px-4 py-3 text-white focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                      >
                        {PODCAST_LANGUAGES.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-white/75">
                        Season number
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={seasonNumber}
                        onChange={(event) =>
                          setSeasonNumber(event.target.value)
                        }
                        placeholder="Optional"
                        className="mt-2 w-full rounded-2xl border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                      />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-white/75">
                        Episode number
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={episodeNumber}
                        onChange={(event) =>
                          setEpisodeNumber(event.target.value)
                        }
                        placeholder="Optional"
                        className="mt-2 w-full rounded-2xl border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/25 focus:border-[#ff5a4c] focus:ring-[#ff5a4c]"
                      />
                    </label>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(event) => setFeatured(event.target.checked)}
                        className="rounded border-white/20 bg-transparent text-[#ff5a4c] focus:ring-[#ff5a4c]"
                      />
                      <span>
                        <span className="block text-sm font-bold">
                          Feature this episode
                        </span>
                        <span className="mt-0.5 block text-xs text-white/35">
                          Place it in the hero section
                        </span>
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4">
                      <input
                        type="checkbox"
                        checked={explicit}
                        onChange={(event) => setExplicit(event.target.checked)}
                        className="rounded border-white/20 bg-transparent text-[#ff5a4c] focus:ring-[#ff5a4c]"
                      />
                      <span>
                        <span className="block text-sm font-bold">
                          Explicit content
                        </span>
                        <span className="mt-0.5 block text-xs text-white/35">
                          Adds the correct feed label
                        </span>
                      </span>
                    </label>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={!canPublish || publishing}
                  className="w-full rounded-2xl bg-[#ff4d3d] px-6 py-4 text-sm font-extrabold text-white shadow-[0_16px_50px_rgba(255,77,61,.25)] transition hover:-translate-y-0.5 hover:bg-[#ff6254] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {publishing
                    ? statusMessage
                    : isEditing
                      ? "Save changes"
                      : "Publish episode"}
                </button>
              </form>
            </main>

            <aside className="hidden lg:block">
              <div className="sticky top-32 rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                  Live preview
                </p>
                <div className="mt-4 aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff5547] via-[#a73043] to-[#171d31]">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <MicrophoneIcon className="h-14 w-14 text-white/55" />
                    </div>
                  )}
                </div>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ff6b5e]">
                  {showName || "Dalimss News OTT"}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight">
                  {title || "Your episode title"}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">
                  {description ||
                    "The episode description will appear here as you write."}
                </p>
                <div className="mt-5 flex items-center gap-2 text-xs text-white/40">
                  <MicrophoneIcon className="h-4 w-4 text-[#ff5a4c]" />
                  {hostName || "Host name"}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
