"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, isToday, addMonths, isSameMonth } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent } from "@/types";
import { toDateStr } from "@/lib/date-utils";

const HEX: Record<string,string> = {
  blue:"#60a5fa", green:"#34d399", red:"#f87171",
  orange:"#fb923c", purple:"#c084fc", gray:"#94a3b8",
};

interface Props {
  selectedDate: Date;
  events: CalendarEvent[];
  onSelect: (date: Date) => void;
}

export default function MiniCalendar({ selectedDate, events, onSelect }: Props) {
  const [viewMonth, setViewMonth] = useState(new Date());
  const monthStart = startOfMonth(viewMonth);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 1 }),
  });

  const byDate: Record<string, string[]> = {};
  events.forEach((e) => {
    if (!byDate[e.date]) byDate[e.date] = [];
    if (byDate[e.date].length < 3) byDate[e.date].push(HEX[e.colorLabel] ?? "#6366f1");
  });

  return (
    <div className="w-full rounded-2xl p-3" style={{ background: "var(--surface2)" }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setViewMonth((d) => addMonths(d,-1))} className="p-1.5 rounded-full transition-all active:scale-90" style={{ background: "var(--surface)" }}>
          <ChevronLeft className="w-4 h-4" style={{ color: "var(--text2)" }} />
        </button>
        <span className="text-sm font-bold capitalize" style={{ color: "var(--text)" }}>
          {format(viewMonth, "MMMM yyyy", { locale: tr })}
        </span>
        <button onClick={() => setViewMonth((d) => addMonths(d,1))} className="p-1.5 rounded-full transition-all active:scale-90" style={{ background: "var(--surface)" }}>
          <ChevronRight className="w-4 h-4" style={{ color: "var(--text2)" }} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {["Pt","Sa","Ça","Pe","Cu","Ct","Pa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wide py-0.5" style={{ color: "var(--muted)" }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day) => {
          const ds = toDateStr(day);
          const dots = byDate[ds] ?? [];
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const inMonth = isSameMonth(day, viewMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              className="flex flex-col items-center py-0.5 rounded-xl transition-all active:scale-90"
              style={{
                opacity: inMonth ? 1 : 0.25,
                background: selected ? "linear-gradient(135deg,var(--primary),var(--accent))" : "transparent",
              }}
            >
              <span
                className="text-xs leading-6 w-6 h-6 flex items-center justify-center rounded-full font-semibold"
                style={{
                  color: selected ? "#fff" : today ? "var(--primary)" : "var(--text)",
                  fontWeight: today ? 800 : 500,
                }}
              >
                {day.getDate()}
              </span>
              {dots.length > 0 && !selected && (
                <div className="flex gap-0.5 -mt-0.5">
                  {dots.map((color, i) => (
                    <span key={i} className="w-1 h-1 rounded-full" style={{ background: color }} />
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
