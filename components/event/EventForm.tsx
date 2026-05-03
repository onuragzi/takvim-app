"use client";

import { useState } from "react";
import { CalendarEvent, EventColor, RecurrenceType } from "@/types";
import { COLOR_OPTIONS, RECURRENCE_OPTIONS } from "@/lib/constants";
import { toDateStr } from "@/lib/date-utils";
import VoiceRecorder from "./VoiceRecorder";

type FormData = Omit<CalendarEvent, "id" | "createdAt" | "updatedAt" | "reminderSent">;

interface Props {
  initial?: CalendarEvent;
  defaultDate?: string;
  defaultHour?: number;
  existingAudio?: Blob | null;
  onSubmit: (data: FormData, audioBlob?: Blob) => void;
  onCancel: () => void;
}

const HEX: Record<string, string> = {
  blue:"#60a5fa", green:"#34d399", red:"#f87171",
  orange:"#fb923c", purple:"#c084fc", gray:"#94a3b8",
};

const empty = (date: string, hour?: number): FormData => ({
  title: "", description: "", date,
  startTime: hour !== undefined ? `${String(hour).padStart(2,"0")}:00` : "",
  endTime: "", colorLabel: "blue", reminder: false,
  recurrence: "none", audioId: undefined,
});

export default function EventForm({ initial, defaultDate, defaultHour, existingAudio, onSubmit, onCancel }: Props) {
  const today = toDateStr(new Date());
  const [form, setForm] = useState<FormData>(initial ? { ...initial } : empty(defaultDate ?? today, defaultHour));
  const [audioBlob, setAudioBlob] = useState<Blob | null>(existingAudio ?? null);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm((f) => ({ ...f, [k]: v }));

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "14px",
    padding: "12px 16px",
    width: "100%",
    fontSize: "15px",
    outline: "none",
  };

  const labelStyle = { fontSize: "11px", fontWeight: 600, color: "var(--muted)", marginBottom: "6px", display: "block", textTransform: "uppercase" as const, letterSpacing: "0.05em" };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!form.title.trim()) return; onSubmit(form, audioBlob ?? undefined); }} className="flex flex-col gap-5 pb-6">

      <div>
        <label style={labelStyle}>Başlık *</label>
        <input
          style={inputStyle}
          placeholder="Etkinlik başlığı"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Tarih</label>
        <input type="date" style={inputStyle} value={form.date} onChange={(e) => set("date", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label style={labelStyle}>Başlangıç</label>
          <input type="time" style={inputStyle} value={form.startTime ?? ""} onChange={(e) => set("startTime", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Bitiş</label>
          <input type="time" style={inputStyle} value={form.endTime ?? ""} onChange={(e) => set("endTime", e.target.value)} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Açıklama</label>
        <textarea
          style={{ ...inputStyle, resize: "none" }}
          rows={2}
          placeholder="İsteğe bağlı..."
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      {/* Renk */}
      <div>
        <label style={labelStyle}>Renk</label>
        <div className="flex gap-3">
          {COLOR_OPTIONS.map(({ value }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("colorLabel", value as EventColor)}
              className="w-10 h-10 rounded-2xl transition-all active:scale-90"
              style={{
                background: HEX[value],
                boxShadow: form.colorLabel === value ? `0 4px 14px ${HEX[value]}80` : "none",
                transform: form.colorLabel === value ? "scale(1.15)" : "scale(1)",
                border: form.colorLabel === value ? "2.5px solid white" : "2.5px solid transparent",
              }}
            />
          ))}
        </div>
      </div>

      {/* Tekrar */}
      <div>
        <label style={labelStyle}>Tekrar</label>
        <select
          style={{ ...inputStyle, appearance: "none" }}
          value={form.recurrence}
          onChange={(e) => set("recurrence", e.target.value as RecurrenceType)}
        >
          {RECURRENCE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {form.recurrence !== "none" && (
        <div>
          <label style={labelStyle}>Tekrar bitiş</label>
          <input type="date" style={inputStyle} value={form.recurrenceEndDate ?? ""} onChange={(e) => set("recurrenceEndDate", e.target.value)} />
        </div>
      )}

      {/* Hatırlatma toggle */}
      <div
        className="flex items-center justify-between rounded-2xl px-4 py-4 cursor-pointer transition-all active:scale-[0.98]"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        onClick={() => set("reminder", !form.reminder)}
      >
        <div>
          <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>1 gün önce hatırlat</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Alarm + bildirim</div>
        </div>
        <div
          className="w-12 h-7 rounded-full relative transition-all"
          style={{ background: form.reminder ? "linear-gradient(135deg,var(--primary),var(--accent))" : "var(--muted2)" }}
        >
          <div
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all"
            style={{ left: form.reminder ? "22px" : "4px" }}
          />
        </div>
      </div>

      {/* Sesli not */}
      <div>
        <label style={labelStyle}>Sesli Not</label>
        <VoiceRecorder
          onRecorded={(b) => setAudioBlob(b)}
          onRemove={() => setAudioBlob(null)}
          existingBlob={audioBlob}
        />
      </div>

      {/* Butonlar */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-semibold text-base text-white transition-all active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          }}
        >
          {initial ? "Güncelle" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-4 rounded-2xl font-medium text-base transition-all active:scale-[0.98]"
          style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
        >
          İptal
        </button>
      </div>
    </form>
  );
}
