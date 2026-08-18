import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type { OttVideoSource } from "@/lib/ottVideoSources";

interface OttVideoPlayerProps {
  src: string;
  sources?: OttVideoSource[];
  poster: string;
  title: string;
}

interface VideoLevel {
  index: number;
  height: number;
  bitrate: number;
}

function getAutomaticTargetHeight() {
  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }
  ).connection;
  const dataSaver =
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g";

  if (dataSaver) return 480;
  return window.innerWidth >= 1100 ? 1080 : 720;
}

export default function OttVideoPlayer({
  src,
  sources,
  poster,
  title,
}: OttVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<VideoLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(-1);
  const [activeHeight, setActiveHeight] = useState<number | null>(null);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);
  const progressiveSources = useMemo(
    () => [...(sources || [])].sort((a, b) => b.height - a.height),
    [sources]
  );

  const isAdaptiveStream = useMemo(
    () => /\.m3u8(?:$|[?#])/i.test(src),
    [src]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setLevels([]);
    setSelectedLevel(-1);
    setActiveHeight(null);

    const startPlayback = () => {
      video.muted = true;
      void video.play().catch(() => {
        // Browsers may still reject autoplay because of a local user preference.
        // Native controls remain available so playback can be started manually.
      });
    };

    if (isAdaptiveStream && Hls.isSupported()) {
      const hls = new Hls({ startLevel: -1 });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setLevels(
          data.levels
            .map((level, index) => ({
              index,
              height: level.height,
              bitrate: level.bitrate,
            }))
            .filter((level) => level.height > 0)
            .sort((a, b) => b.height - a.height || b.bitrate - a.bitrate)
        );
        startPlayback();
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        setActiveHeight(hls.levels[data.level]?.height || null);
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }

    const chooseAutomaticSource = () => {
      if (progressiveSources.length === 0) return src;
      const targetHeight = getAutomaticTargetHeight();
      return (
        [...progressiveSources]
          .sort(
            (a, b) =>
              Math.abs(a.height - targetHeight) -
              Math.abs(b.height - targetHeight)
          )
          .at(0)?.url || src
      );
    };

    const automaticSource = chooseAutomaticSource();
    video.src = automaticSource;
    setActiveHeight(
      progressiveSources.find((source) => source.url === automaticSource)
        ?.height || null
    );
    video.addEventListener("canplay", startPlayback, { once: true });
    video.load();

    return () => {
      video.removeEventListener("canplay", startPlayback);
      video.removeAttribute("src");
      video.load();
    };
  }, [isAdaptiveStream, progressiveSources, src]);

  const chooseQuality = (level: number) => {
    setSelectedLevel(level);
    setQualityMenuOpen(false);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = level;
      return;
    }

    const video = videoRef.current;
    if (!video || progressiveSources.length === 0) return;
    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;
    const targetHeight =
      level === -1 ? getAutomaticTargetHeight() : level;
    const nextSource =
      progressiveSources.find((source) => source.height === targetHeight) ||
      progressiveSources[0];

    video.src = nextSource.url;
    setActiveHeight(nextSource.height);
    video.addEventListener(
      "loadedmetadata",
      () => {
        video.currentTime = currentTime;
        if (wasPlaying) void video.play();
      },
      { once: true }
    );
    video.load();
  };

  const qualityLabel =
    selectedLevel === -1
      ? activeHeight
        ? `Auto · ${activeHeight}p`
        : "Auto"
      : `${
          hlsRef.current
            ? levels.find((level) => level.index === selectedLevel)?.height || ""
            : selectedLevel
        }p`;

  const displayedLevels = isAdaptiveStream
    ? levels
    : progressiveSources.length > 0
      ? progressiveSources.map((source) => ({
          index: source.height,
          height: source.height,
          bitrate: 0,
        }))
      : levels;
  const initialSource = progressiveSources[0]?.url || src;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-black sm:rounded-[1.3rem]">
      <video
        ref={videoRef}
        src={initialSource}
        poster={poster}
        controls
        autoPlay
        muted
        playsInline
        preload="metadata"
        controlsList="nodownload"
        onContextMenu={(event) => event.preventDefault()}
        aria-label={title}
        className="aspect-video w-full bg-black"
      >
        Your browser does not support video playback.
      </video>

      <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
        <button
          type="button"
          onClick={() => setQualityMenuOpen((open) => !open)}
          aria-haspopup="menu"
          aria-expanded={qualityMenuOpen}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/60 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-black/80"
        >
          Quality: {qualityLabel}
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </button>

        {qualityMenuOpen && (
          <div
            role="menu"
            className="mt-1.5 min-w-full overflow-hidden rounded-lg border border-white/15 bg-[#11151d]/95 py-1 text-xs text-white shadow-2xl backdrop-blur-xl"
          >
            <button
              type="button"
              role="menuitemradio"
              aria-checked={selectedLevel === -1}
              onClick={() => chooseQuality(-1)}
              className="flex w-full items-center justify-between gap-4 px-3 py-2 text-left hover:bg-white/10"
            >
              <span>Auto</span>
              {selectedLevel === -1 && <span className="text-emerald-400">✓</span>}
            </button>

            {displayedLevels.map((level) => (
              <button
                key={`${level.height}-${level.bitrate}`}
                type="button"
                role="menuitemradio"
                aria-checked={selectedLevel === level.index}
                onClick={() => chooseQuality(level.index)}
                className="flex w-full items-center justify-between gap-4 px-3 py-2 text-left hover:bg-white/10"
              >
                <span>{level.height}p</span>
                {selectedLevel === level.index && (
                  <span className="text-emerald-400">✓</span>
                )}
              </button>
            ))}

            {displayedLevels.length === 0 && (
              <div className="border-t border-white/10 px-3 py-2 text-white/50">
                Original source
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
