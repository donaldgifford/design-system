import {
  ChartPlot,
  type ChartTable,
  ChartTip,
  SeriesLegend,
} from "@donaldgifford/design-system/blocks/chart-card";
import type { StackSegment } from "@donaldgifford/design-system/blocks/stacked-bars";
import {
  countBounds,
  fitTicks,
  tickLabel,
  xTicksFor,
} from "@donaldgifford/design-system/lib/chart-scale";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { type ReactNode, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export interface StackTimePoint {
  /** The start of the bucket, as an ISO time. */
  at: string;
  /** The count for each segment key; a missing key is zero. */
  counts: Readonly<Record<string, number>>;
}

interface StackedBarsOverTimeProps {
  points: readonly StackTimePoint[];
  /** Bottom of the stack first. */
  segments: readonly StackSegment[];
  /** Fits the x ticks: a day gets clock times, a longer range dates. */
  rangeDays?: number | undefined;
  height?: number | undefined;
  legend?: boolean | undefined;
  /** The accessible name: what the chart shows. */
  label: string;
  /** Rendered in place of the plot when there are no points. */
  empty?: ReactNode | undefined;
  className?: string | undefined;
}

/** A bucket's total across the segments. */
export function stackTotal(point: StackTimePoint, segments: readonly StackSegment[]): number {
  return segments.reduce((sum, s) => sum + (point.counts[s.key] ?? 0), 0);
}

/**
 * Counts over time, split by category: one stacked bar per bucket, a
 * count axis from zero, and x ticks fitted to the range. `TrendChart`
 * draws one series as a line; `StackedBars` splits rows that are not
 * times. A bucket with nothing in it is an empty slot, not a gap.
 */
export function StackedBarsOverTime({
  points,
  segments,
  rangeDays = 30,
  height = 230,
  legend = true,
  label,
  empty = "No data yet.",
  className,
}: StackedBarsOverTimeProps) {
  const bounds = useMemo(
    () => countBounds(points.map((p) => stackTotal(p, segments))),
    [points, segments],
  );
  const { want, style } = xTicksFor(rangeDays);
  const ticks = useMemo(
    () => fitTicks(points.length, want).map((i) => points[i]?.at ?? ""),
    [points, want],
  );
  const data = useMemo(
    () =>
      points.map((p) => ({
        at: p.at,
        ...Object.fromEntries(segments.map((s) => [s.key, p.counts[s.key] ?? 0])),
      })),
    [points, segments],
  );
  if (points.length === 0) {
    return (
      <p
        data-slot="stacked-bars-over-time-empty"
        className={cn("py-8 text-center text-muted-foreground text-sm", className)}
      >
        {empty}
      </p>
    );
  }
  return (
    <div data-slot="stacked-bars-over-time" className={className}>
      <ChartPlot label={label} height={height}>
        <BarChart
          data={data}
          margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
          barCategoryGap="12%"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="at"
            ticks={ticks}
            tickFormatter={(v: string) => tickLabel(v, style)}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[bounds.min, bounds.max]}
            ticks={bounds.ticks}
            tickFormatter={(v: number) => v.toLocaleString("en-US")}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", fillOpacity: 0.5 }}
            isAnimationActive={false}
            content={({ active, label: at }) => {
              const point = points.find((p) => p.at === at);
              if (!active || !point) return null;
              return (
                <ChartTip
                  heading={tickLabel(point.at, style)}
                  rows={[
                    ...segments.map((s) => ({
                      label: s.label,
                      value: (point.counts[s.key] ?? 0).toLocaleString("en-US"),
                      color: s.color,
                    })),
                    { label: "total", value: stackTotal(point, segments).toLocaleString("en-US") },
                  ]}
                />
              );
            }}
          />
          {segments.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              stackId="stack"
              fill={s.color}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ChartPlot>
      {legend ? <SeriesLegend items={segments} /> : null}
    </div>
  );
}

export interface StackTimeTableOptions {
  /** The most rows the table shows. */
  cap?: number | undefined;
  /** The first column's header. */
  head?: string | undefined;
  /** What a bucket is, plural, for the note under a capped table. */
  noun?: string | undefined;
}

/** The buckets as a ChartCard table: newest first, a column per segment and a total. */
export function stackTimeTable(
  points: readonly StackTimePoint[],
  segments: readonly StackSegment[],
  { cap = 30, head = "Day", noun = "days" }: StackTimeTableOptions = {},
): ChartTable {
  const rows = [...points].reverse().slice(0, cap);
  return {
    head: [head, ...segments.map((s) => s.label), "Total"],
    numeric: [...segments.map((_, i) => i + 1), segments.length + 1],
    rows: rows.map((p) => [
      p.at.slice(0, 10),
      ...segments.map((s) => (p.counts[s.key] ?? 0).toLocaleString("en-US")),
      stackTotal(p, segments).toLocaleString("en-US"),
    ]),
    note: points.length > cap ? `latest ${cap} of ${points.length} ${noun}` : undefined,
  };
}
