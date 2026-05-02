"use client";

import { Mic, Square, Trash2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils";
import { MAX_RECORDING_SECONDS } from "@/lib/constants";
import AudioPlayer from "./AudioPlayer";

interface Props {
  onRecorded: (blob: Blob, duration: number) => void;
  onRemove: () => void;
  existingBlob?: Blob | null;
}

export default function VoiceRecorder({ onRecorded, onRemove, existingBlob }: Props) {
  const { state, duration, blob, start, stop, reset } = useVoiceRecorder();

  const handleSave = () => {
    if (blob) {
      onRecorded(blob, duration);
    }
  };

  const handleRemove = () => {
    reset();
    onRemove();
  };

  const pct = Math.min((duration / MAX_RECORDING_SECONDS) * 100, 100);

  if (existingBlob && state === "idle") {
    return (
      <div className="flex items-center gap-2">
        <AudioPlayer blob={existingBlob} />
        <button onClick={handleRemove} className="p-1 rounded hover:bg-red-900/30 text-red-400">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {state === "idle" && (
        <button
          type="button"
          onClick={start}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors w-fit"
        >
          <Mic className="w-4 h-4 text-indigo-400" />
          Sesli Not Ekle
        </button>
      )}

      {state === "recording" && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-60" />
            </div>
            <span className="text-sm text-red-400 font-mono">
              {String(Math.floor(duration / 60)).padStart(2, "0")}:{String(duration % 60).padStart(2, "0")} / 02:00
            </span>
            <button
              type="button"
              onClick={stop}
              className="p-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors"
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden w-full">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {state === "stopped" && blob && (
        <div className="flex flex-col gap-2">
          <AudioPlayer blob={blob} />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-3 py-1.5 text-sm rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            >
              Yeniden Kayıt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
