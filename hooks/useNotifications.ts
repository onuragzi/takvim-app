"use client";

import { useEffect, useState, useCallback } from "react";
import {
  requestNotificationPermission,
  scheduleReminderCheck,
} from "@/lib/notifications";
import { CalendarEvent } from "@/types";

export function useNotifications() {
  const [permitted, setPermitted] = useState(false);
  const [triggered, setTriggered] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    requestNotificationPermission().then(setPermitted);
  }, []);

  useEffect(() => {
    const stop = scheduleReminderCheck();
    return stop;
  }, []);

  const dismiss = useCallback((id: string) => {
    setTriggered((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { permitted, triggered, dismiss };
}
