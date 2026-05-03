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
  onSave: (data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt" | "reminderSent" | "reminderWeekSent">, audioBlob?: Blob) => void;
  onDelete?: (id: string) => void;
}

export default function EventModal({ open, event, defaultDate, defaultHour, onClose, onSave, onDelete }: Props) {
  const [existingAudio, setExistingAudio] = useState<Blob | null>(null);

  useEffect(() => {
    if (event?.audioId) getAudio(event.audioId).then((r) => setExistingAudio(r?.blob ?? null));
    else setExistingAudio(null);
  }, [event]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl max-h-[92vh] flex flex-col"
            style={{
              background: "var(--bg)",
              borderTop: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--border)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-3 shrink-0"
              style={{ borderBottom: "1px solid var(--border2)" }}
            >
              <h2 className="font-bold text-base" style={{ color: "var(--text)" }}>
                {event ? "Etkinliği Düzenle" : "Yeni Etkinlik"}
              </h2>
              <div className="flex items-center gap-1">
                {event && onDelete && (
                  <button
                    onClick={() => onDelete(event.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90"
                    style={{ background: "rgba(239,68,68,0.1)" }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90"
                  style={{ background: "var(--surface)" }}
                >
                  <X className="w-4 h-4" style={{ color: "var(--muted)" }} />
                </button>
              </div>
            </div>

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
