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
    const playBeep = (startAt: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.6, startAt);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);
      osc.start(startAt);
      osc.stop(startAt + duration);
    };
    // 3 bip sesi
    [0, 0.4, 0.8].forEach((t) => playBeep(ctx.currentTime + t, 880, 0.3));
  } catch {
    // ignore
  }
}

export function checkAndSendReminders(): CalendarEvent[] {
  const tomorrow = toDateStr(addDays(new Date(), 1));
  const events = loadEvents();
  const triggered: CalendarEvent[] = [];

  for (const event of events) {
    if (
      event.reminder &&
      !event.reminderSent &&
      event.date === tomorrow
    ) {
      sendBrowserNotification(event);
      playAlarm();
      updateEvent(event.id, { reminderSent: true });
      triggered.push(event);
    }
  }

  return triggered;
}

function sendBrowserNotification(event: CalendarEvent): void {
  if (Notification.permission !== "granted") return;

  const timeStr = event.startTime ? ` — Saat ${event.startTime}` : "";
  new Notification(`⏰ Yarın: ${event.title}`, {
    body: `${event.date}${timeStr}${event.description ? "\n" + event.description : ""}`,
    icon: "/icon-192.png",
    tag: event.id,
  });
}

export function scheduleReminderCheck(): () => void {
  checkAndSendReminders();
  const interval = setInterval(checkAndSendReminders, 30 * 60 * 1000); // 30 dk
  return () => clearInterval(interval);
}
