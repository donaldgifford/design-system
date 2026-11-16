/**
 * Axis arithmetic shared by the chart blocks. Pure, so the bounds and
 * the tick fitting are tested without rendering a chart.
 */

export interface Bounds {
  min: number;
  max: number;
  ticks: number[];
}

export interface BoundsOptions {
  /** A percent axis never leaves 0 to 100. */
  percent?: boolean;
  /** The floor and ceiling land on a multiple of this. */
  step?: number;
  /** Room left above the largest and below the smallest value. */
  pad?: number;
}

/**
 * Brackets the data with a floor and ceiling on a step, so a series
 * living in a narrow band (97 to 99%) is legible instead of a flat line at
 * the top of a 0 to 100 axis. Count axes never go below zero. Empty data
 * gives the full range.
 */
export function niceBounds(
  values: readonly (number | null | undefined)[],
  { percent = false, step = 10, pad = 2 }: BoundsOptions = {},
): Bounds {
  const vals = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  if (vals.length === 0) {
    return withTicks(0, percent ? 100 : step);
  }
  let min = Math.max(0, Math.floor((Math.min(...vals) - pad) / step) * step);
  let max = Math.ceil((Math.max(...vals) + pad) / step) * step;
  if (percent) {
    max = Math.min(100, max);
  }
  if (max <= min) {
    if (percent && min >= 100) min = 100 - step;
    else max = min + step;
  }
  return withTicks(min, max);
}

function withTicks(min: number, max: number): Bounds {
  const size = (max - min) / 4;
  const ticks = [0, 1, 2, 3, 4].map((g) => Number((min + g * size).toFixed(1)));
  return { min, max, ticks };
}

/**
 * Bounds for a count axis from zero: the ticks land on whole, round
 * numbers (1, 2, or 5 times a power of ten), about `want` of them, and
 * the top one clears the largest value.
 */
export function countBounds(values: readonly (number | null | undefined)[], want = 4): Bounds {
  const vals = values.filter((v): v is number => typeof v === "number" && Number.isFinite(v));
  const largest = Math.max(1, ...vals);
  const raw = largest / want;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * power).find((s) => s >= raw) ?? raw);
  const count = Math.ceil(largest / step);
  return {
    min: 0,
    max: count * step,
    ticks: Array.from({ length: count + 1 }, (_, i) => i * step),
  };
}

/**
 * Picks at most `want` indices from n points, one constant step apart
 * and anchored on the last (newest) point. The constant step matters:
 * rounding evenly spread positions to indices skips days unevenly, which
 * reads as missing data.
 */
export function fitTicks(n: number, want: number): number[] {
  if (n <= 0) return [];
  const step = Math.max(1, Math.ceil((n - 1) / Math.max(1, want - 1)));
  const out: number[] = [];
  for (let i = n - 1; i >= 0; i -= step) out.unshift(i);
  return out;
}

export type TickStyle = "time" | "date";

/** How many x labels a range gets, and whether they are clock times or dates. */
export function xTicksFor(rangeDays: number): { want: number; style: TickStyle } {
  if (rangeDays <= 1) return { want: 6, style: "time" };
  if (rangeDays <= 7) return { want: 7, style: "date" };
  return { want: 6, style: "date" };
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const two = (n: number) => String(n).padStart(2, "0");

/**
 * Formats one x label, in UTC: a plotted point is a sample on a shared
 * axis, not a moment the reader's zone matters for.
 */
export function tickLabel(iso: string, style: TickStyle): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  if (style === "time") {
    return `${two(d.getUTCHours())}:${two(d.getUTCMinutes())}`;
  }
  return `${months[d.getUTCMonth()] ?? ""} ${d.getUTCDate()}`;
}

export type ValueUnit = "%" | "count";

/** Renders a plotted value with its unit; a null is a gap. */
export function formatValue(v: number | null | undefined, unit: ValueUnit): string {
  if (v === null || v === undefined) return "—";
  return unit === "%" ? `${v.toFixed(1)}%` : v.toLocaleString("en-US");
}
