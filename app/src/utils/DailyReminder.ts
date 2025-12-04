// src/utils/DailyReminder.ts
import type { Suggestion } from "../types";

export const DAILY_REMINDER_MESSAGES = [
  "Is your life OnTrack today?",
  "Have you checked on your task list lately?",
  "Worried you'll forget something today? Put it in OnTrack!",
  "Tiny steps count too. What's one thing you can do from your task list?",
  "Future you will thank you. Take a peek at your task list.",
  "Got 2 minutes? Do a quick OnTrack check-in.",
  "Are you missing something? You might want to take a look at your Smart Suggestions.",
  "Anything new scheduled? Pop it into OnTrack.",
  "Today's a good day to get OnTrack.",
  "What's on your mind today? Offload it to OnTrack!",
  "Clear your mental clutter - let OnTrack hold it for you.",
  "What tasks have you completed lately?",
];

// Pick from the static list OR from the user's Smart Suggestions
export function getRandomDailyReminderMessage(
  suggestions?: Suggestion[]
): string {
  const baseMessages = [...DAILY_REMINDER_MESSAGES];

  const suggestionMessages =
    suggestions
      ?.filter((s) => !s.dismissed && s.message)
      .map((s) => s.message) ?? [];

  const pool = [...baseMessages, ...suggestionMessages];

  if (pool.length === 0) {
    return "Check in on your OnTrack tasks today.";
  }

  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// Generic helper: do we already have *any* notification scheduled for this date?
export function hasNotificationOnDate(
  notifications: { time: Date | string }[],
  date: Date
): boolean {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();

  return notifications.some((n) => {
    const t = new Date(n.time);
    return (
      t.getFullYear() === y &&
      t.getMonth() === m &&
      t.getDate() === d
    );
  });
}
