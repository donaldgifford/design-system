import {
  ChartPlot,
  type ChartTable,
  ChartTip,
  SeriesLegend,
} from "@donaldgifford/design-system/blocks/chart-card";
import { countBounds, fitTicks, tickLabel } from "@donaldgifford/design-system/lib/chart-scale";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export interface PairDay {
  /** An ISO date. */
  day: string;
  a: number;
  b: number;
}

interface PairBarsProps {
  days: readonly PairDay[];
  /** The names of the `a` and `b` series. */
  series: readonly [string, string];
  /** CSS colors for `a` and `b`. */
  colors?: readonly [string, string] | undefined;
  height?: number | undefined;
  /** The accessible name: what the chart shows. */
  label: string;
  className?: string | undefined;
}

/**
 * Two series side by side per day (opened and closed, created and
 * resolved): a shared y axis on round ticks, date ticks fitted to
 * the range, and a legend naming the pair.
 */
export function PairBars({
  days,
  series,
  colors = ["var(--chart-1)", "var(--chart-2)"],
  height = 200,
  label,
  className,
}: PairBarsProps) {
  const bounds = countBounds(days.flatMap((d) => [d.a * 1.1, d.b * 1.1]));
  const ticks = fitTicks(days.length, 7).map((i) => days[i]?.day ?? "");
  return (
    <div data-slot="pair-bars" className={className}>
      <ChartPlot label={label} height={height}>
        <BarChart
          data={days.map((d) => ({ ...d }))}
          margin={{ top: 14, right: 10, bottom: 0, left: 0 }}
          barCategoryGap="30%"
          barGap={2}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            ticks={ticks}
            tickFormatter={(v: string) => tickLabel(v, "date")}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            domain={[0, bounds.max]}
            ticks={bounds.ticks}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            width={34}
          />
          <Tooltip
            isAnimationActive={false}
            content={({ active, payload, label: at }) => {
              if (!active || !payload?.[0]) return null;
              const day = payload[0].payload as PairDay;
              return (
                <ChartTip
                  heading={tickLabel(String(at), "date")}
                  rows={[
                    { label: series[0], value: day.a.toLocaleString("en-US"), color: colors[0] },
                    { label: series[1], value: day.b.toLocaleString("en-US"), color: colors[1] },
                  ]}
                />
              );
            }}
          />
          <Bar dataKey="a" fill={colors[0]} maxBarSize={10} isAnimationActive={false} />
          <Bar dataKey="b" fill={colors[1]} maxBarSize={10} isAnimationActive={false} />
        </BarChart>
      </ChartPlot>
      <SeriesLegend
        items={[
          { label: series[0], color: colors[0] },
          { label: series[1], color: colors[1] },
        ]}
      />
    </div>
  );
}

/** The pairs as a ChartCard table. */
export function pairTable(days: readonly PairDay[], series: readonly [string, string]): ChartTable {
  return {
    head: ["Day", series[0], series[1]],
    numeric: [1, 2],
    rows: days.map((d) => [d.day, d.a.toLocaleString("en-US"), d.b.toLocaleString("en-US")]),
  };
}
