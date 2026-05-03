"use client";

import { CalendarEvent } from "@/types";
import { toDateStr, isToday } from "@/lib/date-utils";
import { HOURS } from "@/lib/constants";
import EventCard from "./EventCard";
import NowLine from "./NowLine";
import { CalendarX } from "lucide-react";

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
      {/* All-day */}
      {allDay.length > 0 && (
        <div
          className="px-3 py-2 shrink-0"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface2)" }}
        >
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>Tüm gün</div>
          <div className="flex flex-col gap-1">
            {allDay.map((ev) => (
              <EventCard key={ev.id} event={ev} onClick={onEventClick} />
            ))}
          </div>
        </div>
      )}

      {/* Hour grid */}
      <div className="overflow-y-auto flex-1">
        {events.filter((e) => e.startTime).length === 0 && allDay.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-2 opacity-40 mt-8">
            <CalendarX className="w-10 h-10" style={{ color: "var(--muted)" }} />
            <p className="text-sm" style={{ color: "var(--muted)" }}>Bu günde etkinlik yok</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Saate dokunarak ekle</p>
          </div>
        )}

        {HOURS.map((hour) => {
          const hourEvents = events.filter((e) => e.startTime && parseInt(e.startTime) === hour);
          const isCurrent = today && hour === currentHour;

          return (
            <div
              key={hour}
              id={`hour-${hour}`}
              className="flex min-h-[64px] relative"
              style={{
                borderBottom: "1px solid var(--border2)",
                background: isCurrent ? "rgba(99,102,241,0.04)" : "transparent",
              }}
              onClick={() => onAddClick(activeDate, hour)}
            >
              <div
                className="w-14 py-2 pr-3 text-right text-xs shrink-0 pt-3 leading-none"
                style={{ color: isCurrent ? "var(--primary)" : "var(--muted)", fontWeight: isCurrent ? 700 : 400 }}
              >
                {String(hour).padStart(2, "0")}:00
              </div>

              <div className="flex-1 p-1.5 relative" style={{ borderLeft: "1px solid var(--border2)" }}>
                {isCurrent && <NowLine />}
                <div className="flex flex-col gap-1">
                  {hourEvents.map((ev) => (
                    <EventCard key={ev.id} event={ev} onClick={(e) => { onEventClick(e); }} />
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
