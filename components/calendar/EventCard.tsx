"use client";

import { CalendarEvent } from "@/types";
import { COLOR_MAP } from "@/lib/constants";
import { Bell, Mic, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: (event: CalendarEvent) => void;
}

export default function EventCard({ event, compact, onClick }: Props) {
  const c = COLOR_MAP[event.colorLabel];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={() => onClick?.(event)}
      className={`rounded-xl cursor-pointer select-none ${compact ? "text-xs" : "text-sm"}`}
      style={{
        background: `linear-gradient(135deg, ${colorToRgba(event.colorLabel, 0.18)}, ${colorToRgba(event.colorLabel, 0.08)})`,
        borderLeft: `3px solid ${colorToHex(event.colorLabel)}`,
        backdropFilter: "blur(8px)",
        padding: compact ? "4px 8px" : "8px 12px",
        boxShadow: `0 2px 8px ${colorToRgba(event.colorLabel, 0.15)}`,
      }}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="font-semibold truncate" style={{ color: colorToHex(event.colorLabel) }}>
          {event.title}
        </span>
        <div className="flex items-center gap-0.5 shrink-0 opacity-70">
          {event.reminder && <Bell className="w-3 h-3" style={{ color: colorToHex(event.colorLabel) }} />}
          {event.audioId && <Mic className="w-3 h-3" style={{ color: colorToHex(event.colorLabel) }} />}
          {event.recurrence !== "none" && <RefreshCw className="w-3 h-3" style={{ color: colorToHex(event.colorLabel) }} />}
        </div>
      </div>
      {!compact && event.startTime && (
        <div className="text-xs mt-0.5 opacity-60" style={{ color: colorToHex(event.colorLabel) }}>
          {event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}
        </div>
      )}
    </motion.div>
  );
}

const HEX_MAP: Record<string, string> = {
  blue: "#60a5fa", green: "#34d399", red: "#f87171",
  orange: "#fb923c", purple: "#c084fc", gray: "#94a3b8",
};

function colorToHex(c: string) { return HEX_MAP[c] ?? "#60a5fa"; }

function colorToRgba(c: string, a: number) {
  const hex = HEX_MAP[c] ?? "#60a5fa";
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
