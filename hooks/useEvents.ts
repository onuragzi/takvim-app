"use client";

import { useState, useCallback, useEffect } from "react";
import { CalendarEvent } from "@/types";
import {
  loadEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsForDate,
} from "@/lib/storage";

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const refresh = useCallback(() => {
    setEvents(loadEvents());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEvent = useCallback(
    (data: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => {
      const created = createEvent(data);
      setEvents(loadEvents());
      return created;
    },
    []
  );

  const editEvent = useCallback((id: string, patch: Partial<CalendarEvent>) => {
    updateEvent(id, patch);
    setEvents(loadEvents());
  }, []);

  const removeEvent = useCallback((id: string) => {
    deleteEvent(id);
    setEvents(loadEvents());
  }, []);

  const getForDate = useCallback((date: string) => {
    return getEventsForDate(date);
  }, []);

  return { events, addEvent, editEvent, removeEvent, getForDate, refresh };
}
