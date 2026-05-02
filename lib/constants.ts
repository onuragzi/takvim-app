import { EventColor } from "@/types";

export const COLOR_MAP: Record<EventColor, { bg: string; border: string; text: string; dot: string }> = {
  blue:   { bg: "bg-blue-500/20",   border: "border-blue-500",   text: "text-blue-300",   dot: "bg-blue-500" },
  green:  { bg: "bg-green-500/20",  border: "border-green-500",  text: "text-green-300",  dot: "bg-green-500" },
  red:    { bg: "bg-red-500/20",    border: "border-red-500",    text: "text-red-300",    dot: "bg-red-500" },
  orange: { bg: "bg-orange-500/20", border: "border-orange-500", text: "text-orange-300", dot: "bg-orange-500" },
  purple: { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-300", dot: "bg-purple-500" },
  gray:   { bg: "bg-slate-500/20",  border: "border-slate-500",  text: "text-slate-300",  dot: "bg-slate-500" },
};

export const COLOR_OPTIONS: { value: EventColor; label: string }[] = [
  { value: "blue",   label: "Mavi" },
  { value: "green",  label: "Yeşil" },
  { value: "red",    label: "Kırmızı" },
  { value: "orange", label: "Turuncu" },
  { value: "purple", label: "Mor" },
  { value: "gray",   label: "Gri" },
];

export const RECURRENCE_OPTIONS = [
  { value: "none",    label: "Tekrar yok" },
  { value: "daily",   label: "Her gün" },
  { value: "weekly",  label: "Her hafta" },
  { value: "monthly", label: "Her ay" },
];

export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const MAX_RECORDING_SECONDS = 120; // 2 dakika

export const ALARM_SOUND_URL = "/alarm.mp3";

export const DAYS_TR = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
export const MONTHS_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
