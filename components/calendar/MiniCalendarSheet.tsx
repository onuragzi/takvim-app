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
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl p-4 pb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Takvim</h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <MiniCalendar
              selectedDate={selectedDate}
              events={events}
              onSelect={(d) => { onSelect(d); onClose(); }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
