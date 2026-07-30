import { useEffect, useRef, useState } from "react";
import {
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/solid";
import { formatDuration } from "@/lib/podcasts";

interface PodcastPlayerProps {
  src: string;
  title: string;
  compact?: boolean;
}

const PLAYBACK_RATES = [1, 1.25, 1.5, 1.75, 2];

export default function PodcastPlayer({
  src,
  title,
  compact = false,
}: PodcastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    seek(Math.min(Math.max(audio.currentTime + seconds, 0), duration || 0));
  };

  const cyclePlaybackRate = () => {
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
    const nextRate = PLAYBACK_RATES[(currentIndex + 1) % PLAYBACK_RATES.length];
    if (audioRef.current) audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        aria-label={title}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0
          )
        }
      />

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={togglePlayback}
          className={`grid flex-none place-items-center rounded-full bg-[#ff4d3d] text-white shadow-[0_12px_34px_rgba(255,77,61,0.35)] transition hover:scale-105 hover:bg-[#ff6254] ${
            compact ? "h-12 w-12" : "h-14 w-14 sm:h-16 sm:w-16"
          }`}
          aria-label={isPlaying ? "Pause episode" : "Play episode"}
        >
          {isPlaying ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="ml-1 h-6 w-6" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-3 text-xs font-medium text-white/55">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seek(Number(event.target.value))}
            className="podcast-range w-full"
            aria-label="Episode progress"
          />
        </div>
      </div>

      {!compact && (
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => skip(-15)}
              className="relative grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Go back 15 seconds"
            >
              <ArrowPathIcon className="h-6 w-6 -scale-x-100" />
              <span className="absolute text-[8px] font-bold">15</span>
            </button>
            <button
              type="button"
              onClick={() => skip(30)}
              className="relative grid h-9 w-9 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Skip forward 30 seconds"
            >
              <ArrowPathIcon className="h-6 w-6" />
              <span className="absolute text-[8px] font-bold">30</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <SpeakerWaveIcon className="h-4 w-4 text-white/50" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value);
                  if (audioRef.current) audioRef.current.volume = nextVolume;
                  setVolume(nextVolume);
                }}
                className="podcast-range w-20"
                aria-label="Volume"
              />
            </div>
            <button
              type="button"
              onClick={cyclePlaybackRate}
              className="min-w-[3.5rem] rounded-full border border-white/15 px-3 py-1.5 text-xs font-bold text-white/80 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              aria-label="Change playback speed"
            >
              {playbackRate}×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
