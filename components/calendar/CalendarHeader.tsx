"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarView } from "@/types";
import { formatMonthYear } from "@/lib/date-utils";
import ThemeToggle from "@/components/layout/ThemeToggle";

interface Props {
  view: CalendarView;
  activeDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onTodayClick: () => void;
}

export default function CalendarHeader({ activeDate, onPrev, onNext, onTodayClick }: Props) {
  return (
    <header
      className="shrink-0 flex items-center justify-between px-4 py-3"
      style={{
        background: "var(--surface)",
        backdropFilter: "var(--glass)",
        WebkitBackdropFilter: "var(--glass)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Sol: bugün */}
      <button
        onClick={onTodayClick}
        className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          color: "#fff",
          boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
        }}
      >
        Bugün
      </button>

      {/* Orta: ay + navigasyon */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
        >
          <ChevronLeft className="w-4 h-4" style={{ color: "var(--text2)" }} />
        </button>

        <span
          className="text-sm font-bold capitalize min-w-[130px] text-center"
          style={{ color: "var(--text)" }}
        >
          {formatMonthYear(activeDate)}
        </span>

        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
        >
          <ChevronRight className="w-4 h-4" style={{ color: "var(--text2)" }} />
        </button>
      </div>

      {/* Sağ: tema toggle */}
      <ThemeToggle />
    </header>
  );
}
