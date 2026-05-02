"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
  addMonths,
  isSameMonth,
} from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarEvent } from "@/types";
import { toDateStr } from "@/lib/date-utils";
import { COLOR_MAP } from "@/lib/constants";

interface Props {
  selectedDate: Date;
  events: CalendarEvent[];
  onSelect: (date: Date) => void;
}

export default function MiniCalendar({ selectedDate, events, onSelect }: Props) {
  const [viewMonth, setViewMonth] = useState(new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach((e) => {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = [];
    eventsByDate[e.date].push(e);
  });

  return (
    <div className="bg-slate-900 rounded-lg p-3 w-full">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewMonth((d) => addMonths(d, -1))} className="p-1 hover:bg-slate-700 rounded text-slate-400">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm text-slate-200 font-medium capitalize">
          {format(viewMonth, "MMMM yyyy", { locale: tr })}
        </span>
        <button onClick={() => setViewMonth((d) => addMonths(d, 1))} className="p-1 hover:bg-slate-700 rounded text-slate-400">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"].map((d) => (
          <div key={d} className="text-center text-xs text-slate-500 py-0.5">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day) => {
          const dateStr = toDateStr(day);
          const dayEvents = eventsByDate[dateStr] || [];
          const isSelected = isSameDay(day, selectedDate);
          const todayFlag = isToday(day);
          const inMonth = isSameMonth(day, viewMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              className={cn(
                "flex flex-col items-center py-0.5 rounded transition-colors",
                isSelected ? "bg-indigo-600" : "hover:bg-slate-700",
                !inMonth && "opacity-30"
              )}
            >
              <span
                className={cn(
                  "text-xs leading-5 w-5 h-5 flex items-center justify-center rounded-full",
                  todayFlag && !isSelected ? "bg-indigo-900 text-indigo-300 font-bold" : "",
                  isSelected ? "text-white" : "text-slate-200"
                )}
              >
                {day.getDate()}
              </span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <span
                      key={ev.id}
                      className={cn("w-1 h-1 rounded-full", COLOR_MAP[ev.colorLabel].dot)}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
