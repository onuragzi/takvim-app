"use client";

import { CalendarDays, Clock, CalendarRange, Plus } from "lucide-react";
import { CalendarView } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  onNewEvent: () => void;
  onCalendarOpen: () => void;
}

export default function BottomNav({ view, onViewChange, onNewEvent, onCalendarOpen }: Props) {
  return (
    <nav className="shrink-0 border-t border-slate-800 bg-slate-900 flex items-center safe-pb">
      <button
        onClick={() => onViewChange("week")}
        className={cn(
          "flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors",
          view === "week" ? "text-indigo-400" : "text-slate-500 active:text-slate-300"
        )}
      >
        <CalendarRange className="w-5 h-5" />
        Haftalık
      </button>

      <button
        onClick={() => onViewChange("day")}
        className={cn(
          "flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors",
          view === "day" ? "text-indigo-400" : "text-slate-500 active:text-slate-300"
        )}
      >
        <Clock className="w-5 h-5" />
        Günlük
      </button>

      {/* Ana ekle butonu */}
      <div className="flex-1 flex justify-center py-2">
        <button
          onClick={onNewEvent}
          className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg active:bg-indigo-500 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <button
        onClick={onCalendarOpen}
        className="flex-1 flex flex-col items-center gap-0.5 py-3 text-xs text-slate-500 active:text-slate-300 transition-colors"
      >
        <CalendarDays className="w-5 h-5" />
        Takvim
      </button>

      <div className="flex-1" /> {/* denge */}
    </nav>
  );
}
