"use client";

import { useState, useCallback } from "react";
import { CalendarView } from "@/types";
import { nextWeek, prevWeek, nextDay, prevDay, toDateStr } from "@/lib/date-utils";

export function useCalendar() {
  const [view, setView] = useState<CalendarView>("week");
  const [activeDate, setActiveDate] = useState<Date>(new Date());

  const goNext = useCallback(() => {
    setActiveDate((d) => (view === "week" ? nextWeek(d) : nextDay(d)));
  }, [view]);

  const goPrev = useCallback(() => {
    setActiveDate((d) => (view === "week" ? prevWeek(d) : prevDay(d)));
  }, [view]);

  const goToday = useCallback(() => setActiveDate(new Date()), []);

  const goToDate = useCallback((date: Date) => setActiveDate(date), []);

  return { view, setView, activeDate, goNext, goPrev, goToday, goToDate };
}
