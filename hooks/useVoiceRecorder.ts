"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_RECORDING_SECONDS } from "@/lib/constants";

export type RecorderState = "idle" | "recording" | "stopped";

export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [duration, setDuration] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const recorded = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
        setBlob(recorded);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start(100);
      mediaRef.current = recorder;
      startTimeRef.current = Date.now();
      setState("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);
        if (elapsed >= MAX_RECORDING_SECONDS) {
          stop();
        }
      }, 1000);
    } catch {
      // Mikrofon izni verilmedi
    }
  }, []);

  const stop = useCallback(() => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState("stopped");
  }, []);

  const reset = useCallback(() => {
    stop();
    setBlob(null);
    setDuration(0);
    setState("idle");
  }, [stop]);

  useEffect(() => () => { stop(); }, [stop]);

  return { state, duration, blob, start, stop, reset };
}
