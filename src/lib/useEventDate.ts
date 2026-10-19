"use client";

import { useEffect, useState } from "react";

export const EVENT_HOURS = 48;

/** The hunt always opens November 3, 00:00 local time — rolls to next year when this edition ends. */
export function computeEventDate(now = new Date()): Date {
  const year = now.getFullYear();
  let start = new Date(year, 10, 3, 0, 0, 0);
  const end = new Date(start.getTime() + EVENT_HOURS * 3600 * 1000);
  if (now > end) start = new Date(year + 1, 10, 3, 0, 0, 0);
  return start;
}

/** Returns the event date after mount (null during SSR → no hydration mismatch). */
export function useEventDate(): Date | null {
  const [date, setDate] = useState<Date | null>(null);
  useEffect(() => {
    setDate(computeEventDate());
  }, []);
  return date;
}

export function formatRange(start: Date): string {
  /* end is exclusive (Nov 5, 00:00) — display the last playable day (Nov 4) */
  const last = new Date(start.getTime() + EVENT_HOURS * 3600 * 1000 - 1);
  const m = (d: Date) =>
    d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  return `${m(start)} ${start.getDate()} — ${m(last)} ${last.getDate()}, ${last.getFullYear()}`;
}

export function formatDay(start: Date): string {
  return `${start.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${start.getDate()}`;
}
