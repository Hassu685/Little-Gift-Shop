"use client";

import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function VideoPlayer({
  src,
  poster,
  autoPlay = false,
  muted = true,
  loop = false,
  playsInline = true,
  className = "",
  showBigPlayButton = true,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const v = videoRef.current;
    if (v?.requestFullscreen) v.requestFullscreen();
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  return (
    <div className={`group relative overflow-hidden rounded-3xl ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        playsInline={playsInline}
        preload="metadata"
        onTimeUpdate={onTimeUpdate}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="h-full w-full cursor-pointer object-cover"
      />

      {showBigPlayButton && !playing && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 flex items-center justify-center bg-primary-dark/10 transition-opacity hover:bg-primary-dark/20"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-soft transition-transform hover:scale-110">
            <Play size={26} className="ml-1" fill="currentColor" />
          </span>
        </button>
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-primary-dark/70 to-transparent px-4 py-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="text-white">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
          <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
        </div>
        <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="text-white">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button onClick={toggleFullscreen} aria-label="Fullscreen" className="text-white">
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}
