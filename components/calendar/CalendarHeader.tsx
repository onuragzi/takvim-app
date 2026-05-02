"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { CalendarView } from "@/types";
import { formatMonthYear } from "@/lib/date-utils";

interface Props {
  view: CalendarView;
  activeDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onTodayClick: () => void;
}

export default function CalendarHeader({ activeDate, onPrev, onNext, onTodayClick }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
      <button
        onClick={onTodayClick}
        className="flex items-center gap-1.5 text-indigo-400 text-sm font-medium"
      >
        <CalendarDays className="w-4 h-4" />
        Bugün
      </button>

      <div className="flex items-center gap-3">
        <button onClick={onPrev} className="p-2 rounded-full hover:bg-slate-700 text-slate-300 active:bg-slate-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold capitalize text-sm min-w-[120px] text-center">
          {formatMonthYear(activeDate)}
        </span>
        <button onClick={onNext} className="p-2 rounded-full hover:bg-slate-700 text-slate-300 active:bg-slate-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="w-16" /> {/* denge için */}
    </div>
  );
}
