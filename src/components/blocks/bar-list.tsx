import type { ChartTable } from "@donaldgifford/design-system/blocks/chart-card";
import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ReactNode } from "react";

export interface BarListItem {
  label: string;
  value: number;
  /** Muted text after the label: a kind, a family. */
  sub?: string | undefined;
  /** Replaces the label text, for a link. */
  render?: ((label: string) => ReactNode) | undefined;
}

/** The most rows a bar list ranks before it folds the rest. */
export const BAR_LIST_MAX = 8;

/**
 * Sorts descending and folds everything past `max` rows into one "other"
 * row, so a bar list never asks the eye to rank more than a handful.
 */
export function foldBarList(items: readonly BarListItem[], max = BAR_LIST_MAX): BarListItem[] {
  const sorted = [...items].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
  if (sorted.length <= max) return sorted;
  const other = sorted.slice(max).reduce((sum, item) => sum + item.value, 0);
  return [
    ...sorted.slice(0, max),
    { label: "other", value: other, sub: `${sorted.length - max} more` },
  ];
}

interface BarListProps {
  items: readonly BarListItem[];
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color?: string | undefined;
  /** Print each row's share of the total after its count. */
  share?: boolean | undefined;
  max?: number | undefined;
  /** The accessible name: what is being ranked. */
  label: string;
  className?: string | undefined;
}

/**
 * A ranked list in place of a pie: label, count, share of the total, and
 * a one-color bar scaled to the largest row.
 */
export function BarList({
  items,
  color = "var(--chart-1)",
  share = true,
  max = BAR_LIST_MAX,
  label,
  className,
}: BarListProps) {
  const rows = foldBarList(items, max);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const largest = Math.max(1, ...rows.map((row) => row.value));
  return (
    <ul data-slot="bar-list" aria-label={label} className={cn("grid gap-2", className)}>
      {rows.map((row) => (
        <li key={row.label} className="grid gap-1 text-xs">
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate font-mono">
              {row.render ? row.render(row.label) : row.label}
              {row.sub !== undefined ? (
                <span className="ml-1.5 text-label text-muted-foreground">{row.sub}</span>
              ) : null}
            </span>
            <span className="shrink-0 font-medium tabular-nums">
              {row.value.toLocaleString("en-US")}
              {share && total > 0 ? (
                <span className="text-muted-foreground">
                  {" "}
                  · {Math.round((100 * row.value) / total)}%
                </span>
              ) : null}
            </span>
          </div>
          <div aria-hidden="true" className="h-2">
            <div
              className="h-full min-w-0.5 rounded-r-xs"
              style={{ width: `${(100 * row.value) / largest}%`, background: color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The bar list's data as a ChartCard table. */
export function barListTable(
  items: readonly BarListItem[],
  first = "Item",
  max = BAR_LIST_MAX,
): ChartTable {
  const rows = foldBarList(items, max);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return {
    head: [first, "Count", "Share"],
    numeric: [1, 2],
    rows: rows.map((row) => [
      row.label,
      row.value.toLocaleString("en-US"),
      total > 0 ? `${Math.round((100 * row.value) / total)}%` : "—",
    ]),
  };
}
