import { DateTime } from "luxon";

export function getCurrentTime() {
  return DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
}

export function getCurrentDateTimeUrlEncoded(): string {
  const now = DateTime.now().toISO();
  return encodeURIComponent(now);
}
