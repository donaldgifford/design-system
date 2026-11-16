import {
  ChartPlot,
  type ChartTable,
  ChartTip,
} from "@donaldgifford/design-system/blocks/chart-card";
import {
  fitTicks,
  formatValue,
  niceBounds,
  tickLabel,
  type ValueUnit,
  xTicksFor,
} from "@donaldgifford/design-system/lib/chart-scale";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { type ReactNode, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export interface TrendPoint {
  /** When the point was sampled, as an ISO time. */
  at: string;
  /** The sampled value; a null is an unmeasured point and leaves a gap. */
  value: number | null;
}

interface TrendChartProps {
  points: readonly TrendPoint[];
  unit?: ValueUnit | undefined;
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color?: string | undefined;
  /** Fits the x ticks: a day gets clock times, a longer range dates. */
  rangeDays?: number | undefined;
  height?: number | undefined;
  /** What the line measures, for the tooltip. */
  series: string;
  /** The accessible name: what the chart shows. */
  label: string;
  /** Rendered in place of the plot when there are no points. */
  empty?: ReactNode | undefined;
  className?: string | undefined;
}

// Recharts hands an area's dot its value as a [baseline, value] pair, so
// the dot reads its point from the series by index.
interface DotProps {
  cx?: number | undefined;
  cy?: number | undefined;
  index?: number | undefined;
}

/**
 * One series over time: a line over a wash, a dot on the newest point
 * with its value beside it, a y axis bracketed to the data, and x ticks
 * fitted to the range. An unmeasured point is a gap, never a zero.
 */
export function TrendChart({
  points,
  unit = "%",
  color = "var(--chart-1)",
  rangeDays = 30,
  height = 230,
  series,
  label,
  empty = "No data yet.",
  className,
}: TrendChartProps) {
  const bounds = useMemo(
    () =>
      niceBounds(
        points.map((p) => p.value),
        { percent: unit === "%" },
      ),
    [points, unit],
  );
  const { want, style } = xTicksFor(rangeDays);
  const ticks = useMemo(
    () => fitTicks(points.length, want).map((i) => points[i]?.at ?? ""),
    [points, want],
  );
  if (points.length === 0) {
    return (
      <p
        data-slot="trend-chart-empty"
        className={cn("py-8 text-center text-muted-foreground text-sm", className)}
      >
        {empty}
      </p>
    );
  }
  const last = points.length - 1;

  const endDot = ({ cx, cy, index }: DotProps) => {
    const value = index === undefined ? undefined : points[index]?.value;
    if (
      index !== last ||
      cx === undefined ||
      cy === undefined ||
      value === null ||
      value === undefined
    ) {
      return <g key={`dot-${index}`} />;
    }
    return (
      <g key="dot-end" data-slot="trend-chart-end">
        <circle cx={cx} cy={cy} r={4.5} fill={color} stroke="var(--card)" strokeWidth={2} />
        <text
          x={cx - 10}
          y={cy - 10}
          textAnchor="end"
          className="fill-foreground font-mono font-semibold text-label"
        >
          {formatValue(value, unit)}
        </text>
      </g>
    );
  };

  return (
    <ChartPlot label={label} height={height} className={className}>
      {/* The right margin holds half the last x label, which centers on the newest point. */}
      <AreaChart
        data={points.map((p) => ({ at: p.at, value: p.value }))}
        margin={{ top: 12, right: 28, bottom: 0, left: 0 }}
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
          tickFormatter={(v: number) => (unit === "%" ? `${v}%` : v.toLocaleString("en-US"))}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          cursor={{ strokeDasharray: "2 3" }}
          isAnimationActive={false}
          content={({ active, payload, label: at }) => {
            if (!active || !payload?.[0]) return null;
            const value = payload[0].value as number | null | undefined;
            return (
              <ChartTip
                heading={tickLabel(String(at), style)}
                rows={[{ label: series, value: formatValue(value, unit), color }]}
              />
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={color}
          fillOpacity={0.1}
          dot={endDot}
          activeDot={{ r: 4.5, stroke: "var(--card)", strokeWidth: 2 }}
          connectNulls={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartPlot>
  );
}

/** The series as a ChartCard table: newest first, capped at `cap` rows. */
export function trendTable(
  points: readonly TrendPoint[],
  series: string,
  unit: ValueUnit = "%",
  cap = 30,
): ChartTable {
  const rows = [...points].reverse().slice(0, cap);
  return {
    head: ["Sampled", series],
    numeric: [1],
    rows: rows.map((p) => [p.at.slice(0, 10), formatValue(p.value, unit)]),
    note: points.length > cap ? `latest ${cap} of ${points.length} points` : undefined,
  };
}
