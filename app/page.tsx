"use client";

import { useEffect, useState, useCallback } from "react";
import { CalendarEvent } from "@/types";
import { useCalendar } from "@/hooks/useCalendar";
import { useEvents } from "@/hooks/useEvents";
import { useNotifications } from "@/hooks/useNotifications";
import { saveAudio, deleteAudio } from "@/lib/db";
import { toDateStr } from "@/lib/date-utils";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import WeekView from "@/components/calendar/WeekView";
import DayView from "@/components/calendar/DayView";
import MiniCalendarSheet from "@/components/calendar/MiniCalendarSheet";
import BottomNav from "@/components/layout/BottomNav";
import EventModal from "@/components/event/EventModal";

export default function HomePage() {
  const { view, setView, activeDate, goNext, goPrev, goToday, goToDate } = useCalendar();
  const { events, addEvent, editEvent, removeEvent, getForDate } = useEvents();
  useNotifications();

  const [modalOpen, setModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | undefined>();
  const [defaultHour, setDefaultHour] = useState<number | undefined>();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Günlük görünümde aktif saat pozisyonuna scroll et
  useEffect(() => {
    if (view === "day") {
      const hour = new Date().getHours();
      const el = document.getElementById(`hour-${hour}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [view, activeDate]);

  const openNew = useCallback((date?: Date, hour?: number) => {
    setEditingEvent(null);
    setDefaultDate(date ? toDateStr(date) : toDateStr(activeDate));
    setDefaultHour(hour);
    setModalOpen(true);
  }, [activeDate]);

  const openEdit = useCallback((event: CalendarEvent) => {
    setEditingEvent(event);
    setDefaultDate(undefined);
    setDefaultHour(undefined);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingEvent(null);
  }, []);

  const handleSave = useCallback(async (
    data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt" | "reminderSent">,
    audioBlob?: Blob
  ) => {
    let audioId: string | undefined = editingEvent?.audioId;

    if (audioBlob) {
      const newId = crypto.randomUUID();
      await saveAudio({
        id: newId,
        eventId: editingEvent?.id ?? newId,
        blob: audioBlob,
        duration: 0,
        createdAt: new Date().toISOString(),
      });
      if (editingEvent?.audioId && editingEvent.audioId !== newId) {
        await deleteAudio(editingEvent.audioId);
      }
      audioId = newId;
    }

    if (editingEvent) {
      editEvent(editingEvent.id, { ...data, audioId });
    } else {
      addEvent({ ...data, audioId, reminderSent: false });
    }

    closeModal();
  }, [editingEvent, editEvent, addEvent, closeModal]);

  const handleDelete = useCallback(async (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event?.audioId) await deleteAudio(event.audioId);
    removeEvent(id);
    closeModal();
  }, [events, removeEvent, closeModal]);

  return (
    <div className="flex flex-col h-dvh bg-slate-950 overflow-hidden">
      <CalendarHeader
        view={view}
        activeDate={activeDate}
        onPrev={goPrev}
        onNext={goNext}
        onTodayClick={goToday}
      />

      <main className="flex-1 overflow-hidden">
        {view === "week" ? (
          <WeekView
            activeDate={activeDate}
            getForDate={getForDate}
            onDayClick={(date) => { goToDate(date); setView("day"); }}
            onEventClick={openEdit}
            onAddClick={openNew}
          />
        ) : (
          <DayView
            activeDate={activeDate}
            getForDate={getForDate}
            onEventClick={openEdit}
            onAddClick={openNew}
          />
        )}
      </main>

      <BottomNav
        view={view}
        onViewChange={setView}
        onNewEvent={() => openNew()}
        onCalendarOpen={() => setCalendarOpen(true)}
      />

      <MiniCalendarSheet
        open={calendarOpen}
        selectedDate={activeDate}
        events={events}
        onSelect={(d) => { goToDate(d); setView("day"); }}
        onClose={() => setCalendarOpen(false)}
      />

      <EventModal
        open={modalOpen}
        event={editingEvent}
        defaultDate={defaultDate}
        defaultHour={defaultHour}
        onClose={closeModal}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
