import { DateTime } from "luxon";

export function getCurrentTime() {
  return DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
}

// function to formate Datetime string into a readable format (US date)
export function formatDateTime(dateTime: string) {
  return DateTime.fromISO(dateTime).toLocaleString(DateTime.DATETIME_MED);
}

export function getCurrentDateTimeUrlEncoded(): string {
  const now = DateTime.now().toISO();
  return encodeURIComponent(now);
}