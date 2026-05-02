"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarEvent } from "@/types";
import EventForm from "./EventForm";
import { getAudio } from "@/lib/db";

interface Props {
  open: boolean;
  event?: CalendarEvent | null;
  defaultDate?: string;
  defaultHour?: number;
  onClose: () => void;
  onSave: (data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt" | "reminderSent">, audioBlob?: Blob) => void;
  onDelete?: (id: string) => void;
}

export default function EventModal({ open, event, defaultDate, defaultHour, onClose, onSave, onDelete }: Props) {
  const [existingAudio, setExistingAudio] = useState<Blob | null>(null);

  useEffect(() => {
    if (event?.audioId) {
      getAudio(event.audioId).then((r) => setExistingAudio(r?.blob ?? null));
    } else {
      setExistingAudio(null);
    }
  }, [event]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 rounded-t-2xl max-h-[92vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-slate-700" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
              <h2 className="text-white font-semibold text-base">
                {event ? "Etkinliği Düzenle" : "Yeni Etkinlik"}
              </h2>
              <div className="flex items-center gap-1">
                {event && onDelete && (
                  <button
                    onClick={() => onDelete(event.id)}
                    className="p-2 rounded-full active:bg-red-900/30 text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button onClick={onClose} className="p-2 rounded-full active:bg-slate-700 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable form */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <EventForm
                initial={event ?? undefined}
                defaultDate={defaultDate}
                defaultHour={defaultHour}
                existingAudio={existingAudio}
                onSubmit={onSave}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
