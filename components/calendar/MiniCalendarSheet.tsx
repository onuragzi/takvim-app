"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarEvent } from "@/types";
import MiniCalendar from "./MiniCalendar";

interface Props {
  open: boolean;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export default function MiniCalendarSheet({ open, selectedDate, events, onSelect, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-5 pb-8"
            style={{
              background: "var(--bg)",
              backdropFilter: "var(--glass)",
              borderTop: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              className="mx-auto w-10 h-1 rounded-full mb-4"
              style={{ background: "var(--border)" }}
            />
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base" style={{ color: "var(--text)" }}>Takvim</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
                style={{ background: "var(--surface)" }}
              >
                <X className="w-4 h-4" style={{ color: "var(--muted)" }} />
              </button>
            </div>
            <MiniCalendar selectedDate={selectedDate} events={events} onSelect={(d) => { onSelect(d); onClose(); }} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
