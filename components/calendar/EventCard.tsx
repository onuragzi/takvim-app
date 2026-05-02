"use client";

import { CalendarEvent } from "@/types";
import { COLOR_MAP } from "@/lib/constants";
import { Bell, Mic, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: (event: CalendarEvent) => void;
}

export default function EventCard({ event, compact, onClick }: Props) {
  const colors = COLOR_MAP[event.colorLabel];

  return (
    <div
      onClick={() => onClick?.(event)}
      className={cn(
        "rounded-md border-l-4 px-2 py-1 cursor-pointer select-none transition-opacity hover:opacity-80",
        colors.bg,
        colors.border,
        compact ? "text-xs" : "text-sm"
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className={cn("font-medium truncate", colors.text)}>{event.title}</span>
        <div className="flex items-center gap-0.5 shrink-0">
          {event.reminder && <Bell className={cn("w-3 h-3", colors.text)} />}
          {event.audioId && <Mic className={cn("w-3 h-3", colors.text)} />}
          {event.recurrence !== "none" && <RefreshCw className={cn("w-3 h-3", colors.text)} />}
        </div>
      </div>
      {!compact && event.startTime && (
        <div className="text-slate-400 text-xs">{event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</div>
      )}
    </div>
  );
}
