import { describe, expect, test } from "bun:test";
import {
  countBounds,
  fitTicks,
  formatValue,
  niceBounds,
  tickLabel,
  xTicksFor,
} from "@donaldgifford/design-system/lib/chart-scale";

describe("niceBounds", () => {
  test("brackets a narrow band on the step instead of spanning 0 to 100", () => {
    expect(niceBounds([97, 98.2, 99], { percent: true })).toEqual({
      min: 90,
      max: 100,
      ticks: [90, 92.5, 95, 97.5, 100],
    });
  });

  test("a percent axis never leaves 0 to 100", () => {
    expect(niceBounds([1, 99.5], { percent: true })).toMatchObject({ min: 0, max: 100 });
    expect(niceBounds([100, 100], { percent: true })).toMatchObject({ min: 90, max: 100 });
  });

  test("a count axis never goes below zero and has no ceiling", () => {
    expect(niceBounds([3, 141])).toMatchObject({ min: 0, max: 150 });
    expect(niceBounds([0, 0])).toMatchObject({ min: 0, max: 10 });
  });

  test("empty and unmeasured data give the full range", () => {
    expect(niceBounds([], { percent: true })).toMatchObject({ min: 0, max: 100 });
    expect(niceBounds([null, undefined, Number.NaN])).toMatchObject({ min: 0, max: 10 });
  });

  test("always returns five ticks from min to max", () => {
    const { min, max, ticks } = niceBounds([12, 48], { step: 20, pad: 0 });
    expect(ticks).toHaveLength(5);
    expect(ticks[0]).toBe(min);
    expect(ticks[4]).toBe(max);
  });
});

describe("countBounds", () => {
  test("starts at zero and puts whole, round ticks over the largest value", () => {
    expect(countBounds([42, 129.8])).toEqual({ min: 0, max: 150, ticks: [0, 50, 100, 150] });
    expect(countBounds([17.6])).toEqual({ min: 0, max: 20, ticks: [0, 5, 10, 15, 20] });
    expect(countBounds([5.5])).toEqual({ min: 0, max: 6, ticks: [0, 2, 4, 6] });
    expect(countBounds([1320])).toEqual({ min: 0, max: 1500, ticks: [0, 500, 1000, 1500] });
  });

  test("never steps by less than one, and handles empty data", () => {
    expect(countBounds([0, 0])).toEqual({ min: 0, max: 1, ticks: [0, 1] });
    expect(countBounds([])).toEqual({ min: 0, max: 1, ticks: [0, 1] });
    expect(countBounds([2, null])).toEqual({ min: 0, max: 2, ticks: [0, 1, 2] });
  });
});

describe("fitTicks", () => {
  test("keeps a constant step, anchored on the newest point", () => {
    expect(fitTicks(8, 7)).toEqual([1, 3, 5, 7]);
    expect(fitTicks(30, 6)).toEqual([0, 6, 12, 18, 24].map((i) => i + 5));
    expect(fitTicks(5, 7)).toEqual([0, 1, 2, 3, 4]);
  });

  test("handles no points and one point", () => {
    expect(fitTicks(0, 6)).toEqual([]);
    expect(fitTicks(1, 6)).toEqual([0]);
  });
});

describe("x ticks", () => {
  test("a day gets clock times, a longer range dates", () => {
    expect(xTicksFor(1)).toEqual({ want: 6, style: "time" });
    expect(xTicksFor(7)).toEqual({ want: 7, style: "date" });
    expect(xTicksFor(90)).toEqual({ want: 6, style: "date" });
  });

  test("labels are UTC, and an unparsable value passes through", () => {
    expect(tickLabel("2026-03-04T23:05:00Z", "time")).toBe("23:05");
    expect(tickLabel("2026-03-04T23:05:00Z", "date")).toBe("Mar 4");
    expect(tickLabel("2026-03-04", "date")).toBe("Mar 4");
    expect(tickLabel("soon", "date")).toBe("soon");
  });
});

describe("formatValue", () => {
  test("prints the unit, and a dash for a gap", () => {
    expect(formatValue(97.25, "%")).toBe("97.3%");
    expect(formatValue(12345, "count")).toBe("12,345");
    expect(formatValue(null, "%")).toBe("—");
    expect(formatValue(undefined, "count")).toBe("—");
  });
});
