"use client";

import { CalendarDays, Clock, CalendarRange, Plus } from "lucide-react";
import { CalendarView } from "@/types";
import { motion } from "framer-motion";

interface Props {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  onNewEvent: () => void;
  onCalendarOpen: () => void;
}

const tabs = [
  { id: "week" as CalendarView, icon: CalendarRange, label: "Haftalık" },
  { id: "day"  as CalendarView, icon: Clock,         label: "Günlük"  },
];

export default function BottomNav({ view, onViewChange, onNewEvent, onCalendarOpen }: Props) {
  return (
    <nav
      className="shrink-0 flex items-center px-2 pb-safe"
      style={{
        background: "var(--surface)",
        backdropFilter: "var(--glass)",
        WebkitBackdropFilter: "var(--glass)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
    >
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = view === id;
        return (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className="flex-1 flex flex-col items-center gap-0.5 pt-3 pb-1 relative transition-all active:scale-95"
          >
            {active && (
              <motion.div
                layoutId="nav-active"
                className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl"
                style={{ background: "var(--primary)", opacity: 0.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              className="w-5 h-5 relative z-10"
              style={{ color: active ? "var(--primary)" : "var(--muted)" }}
            />
            <span
              className="text-[10px] font-medium relative z-10"
              style={{ color: active ? "var(--primary)" : "var(--muted)" }}
            >
              {label}
            </span>
          </button>
        );
      })}

      {/* Merkez — Ekle */}
      <div className="flex-1 flex justify-center items-center pt-2">
        <button
          onClick={onNewEvent}
          className="w-13 h-13 w-[52px] h-[52px] rounded-2xl flex items-center justify-center transition-all active:scale-90"
          style={{
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            boxShadow: "0 4px 20px rgba(99,102,241,0.5)",
          }}
        >
          <Plus className="w-6 h-6 text-white" />
        </button>
      </div>

      <button
        onClick={onCalendarOpen}
        className="flex-1 flex flex-col items-center gap-0.5 pt-3 pb-1 transition-all active:scale-95"
      >
        <CalendarDays className="w-5 h-5" style={{ color: "var(--muted)" }} />
        <span className="text-[10px] font-medium" style={{ color: "var(--muted)" }}>Takvim</span>
      </button>

      <div className="flex-1" />
    </nav>
  );
}
