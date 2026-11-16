import { type ChartTable, SeriesLegend } from "@donaldgifford/design-system/blocks/chart-card";
import type { ReactNode } from "react";

export interface StackSegment {
  key: string;
  label: string;
  /** A CSS color; a status token as `var(--success)` is the usual choice. */
  color: string;
}

export interface StackRow {
  label: string;
  /** The count for each segment key; a missing key is zero. */
  counts: Readonly<Record<string, number>>;
  /** Replaces the label text, for a link. */
  render?: (label: string) => ReactNode;
}

export interface RowShare {
  key: string;
  value: number;
  percent: number;
}

/**
 * Each segment's share of the row's own total (not of the largest row),
 * to one decimal; zero when the row is empty.
 */
export function rowShares(
  row: StackRow,
  segments: readonly StackSegment[],
): { total: number; shares: RowShare[] } {
  const total = segments.reduce((sum, s) => sum + (row.counts[s.key] ?? 0), 0);
  const shares = segments.map((s) => {
    const value = row.counts[s.key] ?? 0;
    return {
      key: s.key,
      value,
      percent: total === 0 ? 0 : Math.round((1000 * value) / total) / 10,
    };
  });
  return { total, shares };
}

function describe(rows: readonly StackRow[], segments: readonly StackSegment[]): string {
  return rows
    .map((row) => {
      const { shares } = rowShares(row, segments);
      const parts = shares.map((s, i) => `${segments[i]?.label ?? s.key} ${s.value}`);
      return `${row.label}: ${parts.join(", ")}`;
    })
    .join("; ");
}

interface StackedBarsProps {
  rows: readonly StackRow[];
  segments: readonly StackSegment[];
  legend?: boolean;
  /** The accessible name: what the rows and segments are. */
  label: string;
  className?: string;
}

/**
 * One horizontal stack per category: each row scaled to the largest
 * total, its total printed after it, and one legend for all of them. A
 * single row drops its label and spans the width.
 */
export function StackedBars({ rows, segments, legend = true, label, className }: StackedBarsProps) {
  const max = Math.max(1, ...rows.map((row) => rowShares(row, segments).total));
  const single = rows.length === 1;
  return (
    <div data-slot="stacked-bars" className={className}>
      <ul aria-label={`${label}. ${describe(rows, segments)}`} className="grid gap-2">
        {rows.map((row) => {
          const { total, shares } = rowShares(row, segments);
          return (
            <li key={row.label} className="flex items-center gap-2.5 text-xs">
              {single ? null : (
                <span className="w-36 shrink-0 truncate text-right font-mono">
                  {row.render ? row.render(row.label) : row.label}
                </span>
              )}
              <div aria-hidden="true" className="min-w-0 flex-1">
                <div className="flex h-2.5 gap-0.5" style={{ width: `${(100 * total) / max}%` }}>
                  {shares.map((share, i) =>
                    share.value === 0 ? null : (
                      <span
                        key={share.key}
                        data-segment={share.key}
                        title={`${segments[i]?.label ?? share.key} ${share.value.toLocaleString("en-US")} (${share.percent}%)`}
                        className="block h-full min-w-0 hover:opacity-75"
                        style={{
                          flex: `${share.value} ${share.value} 0`,
                          background: segments[i]?.color,
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
              <span className="w-16 shrink-0 text-right text-muted-foreground tabular-nums">
                {total.toLocaleString("en-US")}
              </span>
            </li>
          );
        })}
      </ul>
      {legend ? <SeriesLegend items={segments} /> : null}
    </div>
  );
}

/** The stacks' data as a ChartCard table. */
export function stackTable(
  rows: readonly StackRow[],
  segments: readonly StackSegment[],
  first = "Category",
): ChartTable {
  const single = rows.length === 1;
  return {
    head: [...(single ? [] : [first]), ...segments.map((s) => s.label)],
    numeric: segments.map((_, i) => i + (single ? 0 : 1)),
    rows: rows.map((row) => [
      ...(single ? [] : [row.label]),
      ...segments.map((s) => (row.counts[s.key] ?? 0).toLocaleString("en-US")),
    ]),
  };
}
