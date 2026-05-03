"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface Props { blob: Blob; }

export default function AudioPlayer({ blob }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);

  return (
    <div className="flex items-center gap-3 flex-1">
      <button
        type="button"
        onClick={() => playing ? audioRef.current?.pause() : audioRef.current?.play()}
        className="w-9 h-9 flex items-center justify-center rounded-full shrink-0 transition-all active:scale-90"
        style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))", boxShadow: "0 2px 10px rgba(99,102,241,0.4)" }}
      >
        {playing ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1 h-2 rounded-full overflow-hidden cursor-pointer" style={{ background: "var(--border)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg,var(--primary),var(--accent))" }}
        />
      </div>

      <audio
        ref={audioRef}
        src={url}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); }}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (el.duration) setProgress((el.currentTime / el.duration) * 100);
        }}
      />
    </div>
  );
}
