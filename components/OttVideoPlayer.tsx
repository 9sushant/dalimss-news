import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface OttVideoPlayerProps {
  src: string;
  poster: string;
  title: string;
}

interface VideoLevel {
  index: number;
  height: number;
  bitrate: number;
}

export default function OttVideoPlayer({
  src,
  poster,
  title,
}: OttVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<VideoLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(-1);
  const [activeHeight, setActiveHeight] = useState<number | null>(null);
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false);

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

    video.src = src;
    video.addEventListener("canplay", startPlayback, { once: true });
    video.load();

    return () => {
      video.removeEventListener("canplay", startPlayback);
      video.removeAttribute("src");
      video.load();
    };
  }, [isAdaptiveStream, src]);

  const chooseQuality = (level: number) => {
    setSelectedLevel(level);
    setQualityMenuOpen(false);
    if (hlsRef.current) hlsRef.current.currentLevel = level;
  };

  const qualityLabel =
    selectedLevel === -1
      ? activeHeight
        ? `Auto · ${activeHeight}p`
        : "Auto"
      : `${levels.find((level) => level.index === selectedLevel)?.height || ""}p`;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-black sm:rounded-[1.3rem]">
      <video
        ref={videoRef}
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

            {levels.map((level) => (
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

            {levels.length === 0 && (
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
