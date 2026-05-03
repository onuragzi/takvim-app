"use client";

import { CalendarEvent } from "@/types";
import { getWeekDays, toDateStr, isToday, isSameDay } from "@/lib/date-utils";
import EventCard from "./EventCard";
import { HOURS } from "@/lib/constants";

interface Props {
  activeDate: Date;
  getForDate: (date: string) => CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddClick: (date: Date, hour?: number) => void;
}

const DAY_LABELS = ["Pt","Sa","Ça","Pe","Cu","Ct","Pa"];

export default function WeekView({ activeDate, getForDate, onDayClick, onEventClick, onAddClick }: Props) {
  const allDays = getWeekDays(activeDate);
  const activeIdx = allDays.findIndex((d) => isSameDay(d, activeDate));
  const centerIdx = Math.max(1, Math.min(activeIdx, allDays.length - 2));
  const days = allDays.slice(centerIdx - 1, centerIdx + 2);

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div
        className="grid grid-cols-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)", backdropFilter: "var(--glass)" }}
      >
        <div className="py-2" />
        {days.map((day, i) => {
          const today = isToday(day);
          const active = isSameDay(day, activeDate);
          const count = getForDate(toDateStr(day)).length;
          const label = DAY_LABELS[allDays.findIndex((d) => isSameDay(d, day))];

          return (
            <button
              key={i}
              onClick={() => onDayClick(day)}
              className="py-2 text-center transition-all active:scale-95"
            >
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                {label}
              </div>
              <div
                className="mx-auto mt-1 w-9 h-9 flex items-center justify-center rounded-2xl text-sm font-bold transition-all"
                style={{
                  background: active
                    ? "linear-gradient(135deg, var(--primary), var(--accent))"
                    : "transparent",
                  color: active ? "#fff" : today ? "var(--primary)" : "var(--text)",
                  border: today && !active ? "1.5px solid var(--primary)" : "1.5px solid transparent",
                  boxShadow: active ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                }}
              >
                {day.getDate()}
              </div>
              {count > 0 && (
                <div
                  className="mt-1 text-[10px] font-semibold"
                  style={{ color: active ? "var(--primary)" : "var(--muted)" }}
                >
                  {count}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-y-auto flex-1">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-4 min-h-[56px]"
            style={{ borderBottom: "1px solid var(--border2)" }}
          >
            <div
              className="py-1 pr-2 text-right text-xs pt-2 leading-none"
              style={{ color: "var(--muted)" }}
            >
              {String(hour).padStart(2,"0")}:00
            </div>
            {days.map((day, i) => {
              const dateStr = toDateStr(day);
              const dayEvents = getForDate(dateStr).filter(
                (e) => e.startTime && parseInt(e.startTime) === hour
              );
              return (
                <div
                  key={i}
                  className="p-0.5"
                  style={{ borderLeft: "1px solid var(--border2)" }}
                  onClick={() => onAddClick(day, hour)}
                >
                  {dayEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} compact onClick={(e) => { onEventClick(e); }} />
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
