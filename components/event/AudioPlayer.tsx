"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface Props {
  blob: Blob;
}

export default function AudioPlayer({ blob }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2">
      <button
        type="button"
        onClick={toggle}
        className="p-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
      >
        {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>

      <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all"
          style={{ width: `${progress}%` }}
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
