import {
  ChartPlot,
  type ChartTable,
  ChartTip,
} from "@donaldgifford/design-system/blocks/chart-card";
import { countBounds } from "@donaldgifford/design-system/lib/chart-scale";
import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from "recharts";

export interface Bucket {
  label: string;
  value: number;
}

interface BarBucketsProps {
  buckets: readonly Bucket[];
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color?: string;
  /** What a bar counts, for the tooltip. */
  series?: string;
  height?: number;
  /** The accessible name: what the chart shows. */
  label: string;
  className?: string;
}

/**
 * One series as bars over named buckets (an age histogram, counts by
 * day): narrow bars with the count on each, and a y axis on round ticks
 * that clear the tallest bar.
 */
export function BarBuckets({
  buckets,
  color = "var(--chart-1)",
  series = "count",
  height = 200,
  label,
  className,
}: BarBucketsProps) {
  // The headroom keeps the tallest bar's count inside the plot.
  const bounds = countBounds(buckets.map((b) => b.value * 1.1));
  return (
    <ChartPlot label={label} height={height} className={className}>
      <BarChart
        data={buckets.map((b) => ({ ...b }))}
        margin={{ top: 18, right: 10, bottom: 0, left: 0 }}
        barCategoryGap="40%"
      >
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} interval={0} />
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
            return (
              <ChartTip
                heading={String(at)}
                rows={[
                  {
                    label: series,
                    value: Number(payload[0].value).toLocaleString("en-US"),
                    color,
                  },
                ]}
              />
            );
          }}
        />
        <Bar
          dataKey="value"
          fill={color}
          maxBarSize={24}
          radius={[3, 3, 0, 0]}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="value"
            position="top"
            offset={6}
            className="fill-foreground font-mono text-label"
            formatter={(v: unknown) => (typeof v === "number" ? v.toLocaleString("en-US") : "")}
          />
        </Bar>
      </BarChart>
    </ChartPlot>
  );
}

/** The buckets as a ChartCard table. */
export function bucketsTable(buckets: readonly Bucket[], series = "Count"): ChartTable {
  return {
    head: ["Bucket", series],
    numeric: [1],
    rows: buckets.map((b) => [b.label, b.value.toLocaleString("en-US")]),
  };
}
