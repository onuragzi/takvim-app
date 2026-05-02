import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  parseISO,
  addMonths,
} from "date-fns";
import { tr } from "date-fns/locale";

export const toDateStr = (d: Date): string => format(d, "yyyy-MM-dd");

export const getWeekDays = (baseDate: Date): Date[] =>
  eachDayOfInterval({
    start: startOfWeek(baseDate, { weekStartsOn: 1 }),
    end: endOfWeek(baseDate, { weekStartsOn: 1 }),
  });

export const nextWeek = (d: Date) => addWeeks(d, 1);
export const prevWeek = (d: Date) => subWeeks(d, 1);
export const nextDay = (d: Date) => addDays(d, 1);
export const prevDay = (d: Date) => addDays(d, -1);

export const formatDayHeader = (d: Date) =>
  format(d, "EEE d", { locale: tr });

export const formatMonthYear = (d: Date) =>
  format(d, "MMMM yyyy", { locale: tr });

export const formatTime = (time: string) => time;

export { isSameDay, isToday, parseISO, format, addDays, addWeeks, addMonths };
