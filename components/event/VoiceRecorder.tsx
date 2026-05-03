"use client";

import { Mic, Square, Trash2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { MAX_RECORDING_SECONDS } from "@/lib/constants";
import AudioPlayer from "./AudioPlayer";

interface Props {
  onRecorded: (blob: Blob, duration: number) => void;
  onRemove: () => void;
  existingBlob?: Blob | null;
}

export default function VoiceRecorder({ onRecorded, onRemove, existingBlob }: Props) {
  const { state, duration, blob, start, stop, reset } = useVoiceRecorder();

  const handleSave = () => { if (blob) onRecorded(blob, duration); };
  const handleRemove = () => { reset(); onRemove(); };
  const pct = Math.min((duration / MAX_RECORDING_SECONDS) * 100, 100);

  if (existingBlob && state === "idle") {
    return (
      <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
        <AudioPlayer blob={existingBlob} />
        <button type="button" onClick={handleRemove} className="p-1.5 rounded-full transition-all active:scale-90" style={{ background: "rgba(239,68,68,0.1)" }}>
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {state === "idle" && (
        <button
          type="button"
          onClick={start}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl font-medium text-sm transition-all active:scale-95"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text2)" }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>
            <Mic className="w-4 h-4 text-white" />
          </div>
          Sesli Not Ekle
        </button>
      )}

      {state === "recording" && (
        <div className="rounded-2xl px-4 py-3 flex flex-col gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8">
              <div className="absolute w-8 h-8 rounded-full bg-red-500 opacity-20 animate-ping" />
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
            <span className="text-sm font-mono text-red-400 flex-1">
              {String(Math.floor(duration/60)).padStart(2,"0")}:{String(duration%60).padStart(2,"0")} / 02:00
            </span>
            <button type="button" onClick={stop} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 transition-all active:scale-90">
              <Square className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface)" }}>
            <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {state === "stopped" && blob && (
        <div className="flex flex-col gap-2 rounded-2xl px-4 py-3" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <AudioPlayer blob={blob} />
          <div className="flex gap-2 mt-1">
            <button type="button" onClick={handleSave} className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>
              Kaydet
            </button>
            <button type="button" onClick={reset} className="flex-1 py-2 rounded-xl text-sm font-medium transition-all active:scale-95" style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}>
              Tekrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
