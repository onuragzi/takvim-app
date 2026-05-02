"use client";

import { useState } from "react";
import { CalendarEvent, EventColor, RecurrenceType } from "@/types";
import { COLOR_OPTIONS, RECURRENCE_OPTIONS } from "@/lib/constants";
import { toDateStr } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
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

const empty = (date: string, hour?: number): FormData => ({
  title: "",
  description: "",
  date,
  startTime: hour !== undefined ? `${String(hour).padStart(2, "0")}:00` : "",
  endTime: "",
  colorLabel: "blue",
  reminder: false,
  recurrence: "none",
  audioId: undefined,
});

export default function EventForm({ initial, defaultDate, defaultHour, existingAudio, onSubmit, onCancel }: Props) {
  const today = toDateStr(new Date());
  const [form, setForm] = useState<FormData>(initial ? { ...initial } : empty(defaultDate ?? today, defaultHour));
  const [audioBlob, setAudioBlob] = useState<Blob | null>(existingAudio ?? null);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form, audioBlob ?? undefined);
  };

  const inputCls = "w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-indigo-500";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-6">
      {/* Title */}
      <div>
        <label className="text-xs text-slate-400 mb-1.5 block">Başlık *</label>
        <input
          className={inputCls}
          placeholder="Etkinlik başlığı"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="text-xs text-slate-400 mb-1.5 block">Tarih</label>
        <input
          type="date"
          className={inputCls}
          value={form.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Başlangıç</label>
          <input
            type="time"
            className={inputCls}
            value={form.startTime ?? ""}
            onChange={(e) => set("startTime", e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Bitiş</label>
          <input
            type="time"
            className={inputCls}
            value={form.endTime ?? ""}
            onChange={(e) => set("endTime", e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-xs text-slate-400 mb-1.5 block">Açıklama</label>
        <textarea
          className={cn(inputCls, "resize-none")}
          rows={3}
          placeholder="İsteğe bağlı..."
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      {/* Color */}
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Renk</label>
        <div className="flex gap-3">
          {COLOR_OPTIONS.map(({ value }) => (
            <button
              key={value}
              type="button"
              onClick={() => set("colorLabel", value as EventColor)}
              className={cn(
                "w-9 h-9 rounded-full border-2 transition-all active:scale-95",
                `bg-${value}-500`,
                form.colorLabel === value ? "border-white scale-110" : "border-transparent opacity-60"
              )}
            />
          ))}
        </div>
      </div>

      {/* Recurrence */}
      <div>
        <label className="text-xs text-slate-400 mb-1.5 block">Tekrar</label>
        <select
          className={cn(inputCls, "appearance-none")}
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
          <label className="text-xs text-slate-400 mb-1.5 block">Tekrar bitiş tarihi</label>
          <input
            type="date"
            className={inputCls}
            value={form.recurrenceEndDate ?? ""}
            onChange={(e) => set("recurrenceEndDate", e.target.value)}
          />
        </div>
      )}

      {/* Reminder toggle */}
      <div
        className="flex items-center justify-between bg-slate-800 rounded-xl px-4 py-3 cursor-pointer active:bg-slate-700"
        onClick={() => set("reminder", !form.reminder)}
      >
        <div>
          <div className="text-sm text-white font-medium">1 gün önce hatırlat</div>
          <div className="text-xs text-slate-400 mt-0.5">Alarm + tarayıcı bildirimi</div>
        </div>
        <div className={cn(
          "w-12 h-7 rounded-full relative transition-colors",
          form.reminder ? "bg-indigo-600" : "bg-slate-600"
        )}>
          <div className={cn(
            "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all",
            form.reminder ? "left-6" : "left-1"
          )} />
        </div>
      </div>

      {/* Voice recorder */}
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Sesli Not</label>
        <VoiceRecorder
          onRecorded={(b) => setAudioBlob(b)}
          onRemove={() => setAudioBlob(null)}
          existingBlob={audioBlob}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2">
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-indigo-600 active:bg-indigo-500 text-white text-base font-semibold transition-colors"
        >
          {initial ? "Güncelle" : "Kaydet"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-4 rounded-2xl bg-slate-800 active:bg-slate-700 text-slate-300 text-base transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
