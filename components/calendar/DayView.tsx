"use client";

import { CalendarEvent } from "@/types";
import { toDateStr, isToday } from "@/lib/date-utils";
import { HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import EventCard from "./EventCard";

interface Props {
  activeDate: Date;
  getForDate: (date: string) => CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddClick: (date: Date, hour?: number) => void;
}

export default function DayView({ activeDate, getForDate, onEventClick, onAddClick }: Props) {
  const dateStr = toDateStr(activeDate);
  const events = getForDate(dateStr);
  const today = isToday(activeDate);
  const allDay = events.filter((e) => !e.startTime);
  const currentHour = new Date().getHours();

  return (
    <div className="flex flex-col h-full">
      {/* All-day events */}
      {allDay.length > 0 && (
        <div className="px-3 py-2 border-b border-slate-800 bg-slate-900 shrink-0">
          <div className="text-xs text-slate-500 mb-1">Tüm gün</div>
          <div className="flex flex-col gap-1">
            {allDay.map((ev) => (
              <EventCard key={ev.id} event={ev} onClick={onEventClick} />
            ))}
          </div>
        </div>
      )}

      {/* Hour list */}
      <div className="overflow-y-auto flex-1">
        {HOURS.map((hour) => {
          const hourEvents = events.filter(
            (e) => e.startTime && parseInt(e.startTime) === hour
          );
          const isCurrent = today && hour === currentHour;

          return (
            <div
              key={hour}
              id={`hour-${hour}`}
              className={cn(
                "flex border-b border-slate-800 min-h-[64px] active:bg-slate-800/40",
                isCurrent ? "bg-indigo-950/20" : ""
              )}
              onClick={() => onAddClick(activeDate, hour)}
            >
              <div className="w-14 py-2 pr-3 text-right text-xs text-slate-500 shrink-0 pt-3">
                <span className={isCurrent ? "text-indigo-400 font-semibold" : ""}>
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
              <div className="flex-1 border-l border-slate-800 p-1.5">
                {isCurrent && (
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div className="flex-1 h-px bg-indigo-500/40" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {hourEvents.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      onClick={(e) => { onEventClick(e); }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
