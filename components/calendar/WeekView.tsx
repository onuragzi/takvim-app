"use client";

import { CalendarEvent } from "@/types";
import { getWeekDays, toDateStr, isToday, isSameDay } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import EventCard from "./EventCard";
import { HOURS } from "@/lib/constants";

interface Props {
  activeDate: Date;
  getForDate: (date: string) => CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddClick: (date: Date, hour?: number) => void;
}

export default function WeekView({ activeDate, getForDate, onDayClick, onEventClick, onAddClick }: Props) {
  const allDays = getWeekDays(activeDate);

  // Telefonda 3 gün göster: aktif gün ortada
  const activeIdx = allDays.findIndex((d) => isSameDay(d, activeDate));
  const centerIdx = Math.max(1, Math.min(activeIdx, allDays.length - 2));
  const days = allDays.slice(centerIdx - 1, centerIdx + 2);

  const dayLabels = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];

  return (
    <div className="flex flex-col h-full">
      {/* 3-day header */}
      <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="py-2" />
        {days.map((day, i) => {
          const today = isToday(day);
          const active = isSameDay(day, activeDate);
          const count = getForDate(toDateStr(day)).length;
          return (
            <button
              key={i}
              className="py-2 text-center active:bg-slate-800"
              onClick={() => onDayClick(day)}
            >
              <div className="text-xs text-slate-400">{dayLabels[allDays.findIndex((d) => isSameDay(d, day))]}</div>
              <div
                className={cn(
                  "mx-auto mt-1 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold",
                  today && !active ? "border border-indigo-500 text-indigo-400" : "",
                  active ? "bg-indigo-600 text-white" : "text-slate-200"
                )}
              >
                {day.getDate()}
              </div>
              {count > 0 && (
                <div className="mt-0.5 text-xs text-indigo-400">{count}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto flex-1">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-4 border-b border-slate-800 min-h-[56px]">
            <div className="py-1 pr-2 text-right text-xs text-slate-500 pt-2 leading-none">
              {String(hour).padStart(2, "0")}:00
            </div>
            {days.map((day, i) => {
              const dateStr = toDateStr(day);
              const dayEvents = getForDate(dateStr).filter(
                (e) => e.startTime && parseInt(e.startTime) === hour
              );
              return (
                <div
                  key={i}
                  className="border-l border-slate-800 p-0.5"
                  onClick={() => onAddClick(day, hour)}
                >
                  {dayEvents.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      compact
                      onClick={(e) => { onEventClick(e); }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
