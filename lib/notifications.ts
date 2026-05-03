import { CalendarEvent } from "@/types";
import { loadEvents, updateEvent } from "./storage";
import { toDateStr, addDays } from "./date-utils";

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function playAlarm(): void {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const playBeep = (startAt: number, freq: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.6, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
      osc.start(startAt);
      osc.stop(startAt + dur);
    };
    [0, 0.4, 0.8].forEach((t) => playBeep(ctx.currentTime + t, 880, 0.3));
  } catch {
    // ignore
  }
}

function sendBrowserNotification(title: string, body: string, tag: string): void {
  if (Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/icon-192.png", tag });
}

export function checkAndSendReminders(): void {
  const today = toDateStr(new Date());
  const tomorrow = toDateStr(addDays(new Date(), 1));
  const nextWeek = toDateStr(addDays(new Date(), 7));
  const events = loadEvents();

  for (const event of events) {
    if (!event.reminder) continue;

    const timeStr = event.startTime ? ` — Saat ${event.startTime}` : "";

    // 1 hafta önce hatırlatma
    if (!event.reminderWeekSent && event.date === nextWeek) {
      sendBrowserNotification(
        `📅 1 Hafta Kaldı: ${event.title}`,
        `${event.date}${timeStr}${event.description ? "\n" + event.description : ""}`,
        `${event.id}-week`
      );
      playAlarm();
      updateEvent(event.id, { reminderWeekSent: true });
    }

    // 24 saat önce hatırlatma
    if (!event.reminderSent && event.date === tomorrow) {
      sendBrowserNotification(
        `⏰ Yarın: ${event.title}`,
        `${event.date}${timeStr}${event.description ? "\n" + event.description : ""}`,
        `${event.id}-day`
      );
      playAlarm();
      updateEvent(event.id, { reminderSent: true });
    }
  }
}

export function scheduleReminderCheck(): () => void {
  checkAndSendReminders();
  const interval = setInterval(checkAndSendReminders, 30 * 60 * 1000);
  return () => clearInterval(interval);
}
