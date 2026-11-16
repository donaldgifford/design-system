/**
 * One timestamp helper: every timestamp renders through formatTime in
 * the zone the reader picked.
 */

export type Zone = "local" | "utc";
export type TimeStyle = "datetime" | "date" | "relative";

/** The localStorage key the zone choice is kept under, unless the app names its own. */
export const ZONE_STORAGE_KEY = "design-system.tz";

export function isZone(value: unknown): value is Zone {
  return value === "local" || value === "utc";
}

export function otherZone(zone: Zone): Zone {
  return zone === "utc" ? "local" : "utc";
}

/**
 * The persisted choice: local when nothing is stored or storage is
 * unavailable (private mode, tests, a server render).
 */
export function readZone(
  key: string = ZONE_STORAGE_KEY,
  storage: Pick<Storage, "getItem"> | undefined = safeStorage(),
): Zone {
  try {
    const value = storage?.getItem(key);
    return isZone(value) ? value : "local";
  } catch {
    return "local";
  }
}

export function writeZone(
  zone: Zone,
  key: string = ZONE_STORAGE_KEY,
  storage: Pick<Storage, "setItem"> | undefined = safeStorage(),
): void {
  try {
    storage?.setItem(key, zone);
  } catch {
    // Storage full or denied: the choice lives for this page only.
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

/**
 * Reads an RFC 3339 time. A value with no zone designator is taken as
 * UTC, which is what an API timestamp is, not as the browser's zone,
 * which is what `new Date` would assume.
 */
export function parseTime(iso: string): Date {
  return new Date(/(Z|[+-]\d\d:\d\d)$/i.test(iso) ? iso : `${iso}Z`);
}

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

/** Renders a time as "3 hours ago". */
export function relativeTime(date: Date, now: Date = new Date()): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return rtf.format(Math.trunc(seconds / size), unit);
    }
  }
  return rtf.format(seconds, "second");
}

export interface FormatTimeOptions {
  zone: Zone;
  style?: TimeStyle;
  now?: Date;
}

/**
 * Renders iso as `YYYY-MM-DD HH:mm` (datetime), `YYYY-MM-DD` (date), or
 * "3 hours ago" (relative, the same in either zone). A missing or
 * unparsable value renders as "—", never "Invalid Date".
 */
export function formatTime(
  iso: string | undefined,
  { zone, style = "datetime", now }: FormatTimeOptions,
): string {
  if (!iso) return "—";
  const d = parseTime(iso);
  if (Number.isNaN(d.getTime())) return "—";
  if (style === "relative") return relativeTime(d, now);
  const p = zone === "utc" ? utcParts(d) : localParts(d);
  const date = `${p.year}-${p.month}-${p.day}`;
  return style === "date" ? date : `${date} ${p.hour}:${p.minute}`;
}

interface Parts {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}

const two = (n: number) => String(n).padStart(2, "0");

function utcParts(d: Date): Parts {
  return {
    year: String(d.getUTCFullYear()),
    month: two(d.getUTCMonth() + 1),
    day: two(d.getUTCDate()),
    hour: two(d.getUTCHours()),
    minute: two(d.getUTCMinutes()),
  };
}

function localParts(d: Date): Parts {
  return {
    year: String(d.getFullYear()),
    month: two(d.getMonth() + 1),
    day: two(d.getDate()),
    hour: two(d.getHours()),
    minute: two(d.getMinutes()),
  };
}
