import { CalendarEvent } from "@/types";
import { toDateStr, addDays, addWeeks, addMonths } from "./date-utils";

const KEY = "calendar_events";

export function loadEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function getEventsForDate(date: string): CalendarEvent[] {
  const all = loadEvents();
  return all.filter((e) => {
    if (e.date === date) return true;
    if (e.recurrence === "none") return false;
    return isRecurringOnDate(e, date);
  });
}

function isRecurringOnDate(event: CalendarEvent, targetDate: string): boolean {
  const start = new Date(event.date);
  const target = new Date(targetDate);
  if (target < start) return false;
  if (event.recurrenceEndDate && target > new Date(event.recurrenceEndDate)) return false;

  if (event.recurrence === "daily") return true;
  if (event.recurrence === "weekly") {
    const diffDays = Math.round((target.getTime() - start.getTime()) / 86400000);
    return diffDays % 7 === 0;
  }
  if (event.recurrence === "monthly") {
    return (
      target.getDate() === start.getDate() &&
      (target.getFullYear() > start.getFullYear() ||
        target.getMonth() > start.getMonth())
    );
  }
  return false;
}

export function createEvent(event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">): CalendarEvent {
  const now = new Date().toISOString();
  const newEvent: CalendarEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const events = loadEvents();
  saveEvents([...events, newEvent]);
  return newEvent;
}

export function updateEvent(id: string, patch: Partial<CalendarEvent>): CalendarEvent | null {
  const events = loadEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated = { ...events[idx], ...patch, updatedAt: new Date().toISOString() };
  events[idx] = updated;
  saveEvents(events);
  return updated;
}

export function deleteEvent(id: string): void {
  const events = loadEvents().filter((e) => e.id !== id);
  saveEvents(events);
}

export function exportEvents(): string {
  return JSON.stringify(loadEvents(), null, 2);
}

export function importEvents(json: string): void {
  const events = JSON.parse(json) as CalendarEvent[];
  saveEvents(events);
}
