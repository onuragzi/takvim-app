export type EventColor = "blue" | "green" | "red" | "orange" | "purple" | "gray";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // "YYYY-MM-DD"
  startTime?: string; // "HH:MM"
  endTime?: string; // "HH:MM"
  colorLabel: EventColor;
  reminder: boolean;
  reminderSent: boolean;
  recurrence: RecurrenceType;
  recurrenceEndDate?: string; // "YYYY-MM-DD"
  audioId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AudioRecord {
  id: string;
  eventId: string;
  blob: Blob;
  duration: number; // seconds
  createdAt: string;
}

export type CalendarView = "week" | "day";

export interface NotificationItem {
  id: string;
  eventId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}
