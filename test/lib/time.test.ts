import { describe, expect, test } from "bun:test";
import {
  formatTime,
  otherZone,
  parseTime,
  readZone,
  relativeTime,
  writeZone,
  ZONE_STORAGE_KEY,
} from "@donaldgifford/design-system/lib/time";

const two = (n: number) => String(n).padStart(2, "0");

describe("formatTime", () => {
  test("renders UTC as a fixed, sortable stamp", () => {
    expect(formatTime("2026-03-04T09:05:59Z", { zone: "utc" })).toBe("2026-03-04 09:05");
    expect(formatTime("2026-03-04T09:05:59Z", { zone: "utc", style: "date" })).toBe("2026-03-04");
    expect(formatTime("2026-03-04T09:05:59Z", { zone: "utc", style: "time" })).toBe("09:05");
    expect(formatTime("2026-03-04T23:30:00-05:00", { zone: "utc" })).toBe("2026-03-05 04:30");
  });

  test("renders local in the runtime's zone", () => {
    const d = new Date("2026-03-04T09:05:00Z");
    const local = `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${two(d.getHours())}:${two(d.getMinutes())}`;
    expect(formatTime("2026-03-04T09:05:00Z", { zone: "local" })).toBe(local);
  });

  test("reads a time with no zone designator as UTC", () => {
    expect(parseTime("2026-03-04T09:05:00").toISOString()).toBe("2026-03-04T09:05:00.000Z");
    expect(formatTime("2026-03-04T09:05:00", { zone: "utc" })).toBe("2026-03-04 09:05");
  });

  test("a missing or unparsable value is a dash", () => {
    expect(formatTime(undefined, { zone: "utc" })).toBe("—");
    expect(formatTime("", { zone: "utc" })).toBe("—");
    expect(formatTime("not a time", { zone: "local" })).toBe("—");
  });

  test("relative is the same in either zone", () => {
    const now = new Date("2026-03-04T12:00:00Z");
    const opts = { style: "relative", now } as const;
    expect(formatTime("2026-03-04T09:00:00Z", { zone: "utc", ...opts })).toBe("3 hours ago");
    expect(formatTime("2026-03-04T09:00:00Z", { zone: "local", ...opts })).toBe("3 hours ago");
  });
});

describe("relativeTime", () => {
  const now = new Date("2026-03-04T12:00:00Z");

  test("picks the largest unit that fits", () => {
    expect(relativeTime(new Date("2026-03-02T12:00:00Z"), now)).toBe("2 days ago");
    expect(relativeTime(new Date("2026-03-04T11:15:00Z"), now)).toBe("45 minutes ago");
    expect(relativeTime(new Date("2026-03-04T11:59:30Z"), now)).toBe("30 seconds ago");
    expect(relativeTime(new Date("2026-03-04T14:00:00Z"), now)).toBe("in 2 hours");
    expect(relativeTime(new Date("2026-03-03T12:00:00Z"), now)).toBe("yesterday");
  });
});

describe("the stored zone", () => {
  const storage = () => {
    const data = new Map<string, string>();
    return {
      data,
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => void data.set(key, value),
    };
  };

  test("round-trips under the key, and defaults to local", () => {
    const store = storage();
    expect(readZone(ZONE_STORAGE_KEY, store)).toBe("local");
    writeZone("utc", ZONE_STORAGE_KEY, store);
    expect(store.data.get(ZONE_STORAGE_KEY)).toBe("utc");
    expect(readZone(ZONE_STORAGE_KEY, store)).toBe("utc");
    expect(readZone("another.key", store)).toBe("local");
  });

  test("ignores a stored value that is not a zone, and storage that throws", () => {
    const store = storage();
    store.data.set(ZONE_STORAGE_KEY, "mars");
    expect(readZone(ZONE_STORAGE_KEY, store)).toBe("local");
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    };
    expect(readZone(ZONE_STORAGE_KEY, broken)).toBe("local");
    expect(() => writeZone("utc", ZONE_STORAGE_KEY, broken)).not.toThrow();
  });

  test("otherZone flips", () => {
    expect(otherZone("utc")).toBe("local");
    expect(otherZone("local")).toBe("utc");
  });
});
