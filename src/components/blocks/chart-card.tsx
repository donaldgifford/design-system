import { Button } from "@donaldgifford/design-system/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@donaldgifford/design-system/components/card";
import { ChartContainer } from "@donaldgifford/design-system/components/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@donaldgifford/design-system/components/table";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { type ComponentProps, type ReactNode, useState } from "react";

/** A chart's data as a table: what the card shows in place of the plot. */
export interface ChartTable {
  head: readonly string[];
  rows: readonly (readonly ReactNode[])[];
  /** The columns to right-align in tabular figures, by index. */
  numeric?: readonly number[] | undefined;
  /** A muted line under the table: "latest 30 of 90 points". */
  note?: ReactNode | undefined;
}

interface ChartCardProps {
  title: ReactNode;
  description?: ReactNode | undefined;
  /** Controls in the header, before the table toggle: a range picker, an export. */
  action?: ReactNode | undefined;
  /** The same data the plot draws. Each chart block exports a helper that builds it. */
  table: ChartTable;
  /** A legend under the plot; hidden with it. */
  legend?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
}

/**
 * The frame a chart renders in: a card whose header carries a toggle
 * that swaps the plot (and its legend) for the same data as a table, so
 * no chart is the only way to read its numbers.
 */
export function ChartCard({
  title,
  description,
  action,
  table,
  legend,
  children,
  className,
}: ChartCardProps) {
  const [view, setView] = useState<"plot" | "table">("plot");
  return (
    <Card data-slot="chart-card" data-view={view} className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description !== undefined ? <CardDescription>{description}</CardDescription> : null}
        <CardAction className="flex items-center gap-1.5">
          {action}
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={view === "table"}
            onClick={() => setView(view === "table" ? "plot" : "table")}
          >
            Table
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {view === "plot" ? (
          <>
            {children}
            {legend}
          </>
        ) : (
          <DenseTable table={table} />
        )}
      </CardContent>
    </Card>
  );
}

/** A chart's table twin: small type, numeric columns right-aligned. */
export function DenseTable({ table, className }: { table: ChartTable; className?: string }) {
  const numeric = new Set(table.numeric ?? []);
  return (
    <div data-slot="dense-table" className={className}>
      <Table className="text-xs">
        <TableHeader>
          <TableRow>
            {table.head.map((head, i) => (
              <TableHead key={head} className={cn(numeric.has(i) && "text-right")}>
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row, r) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a table row's position is its identity
            <TableRow key={r}>
              {row.map((cell, c) => (
                <TableCell
                  // biome-ignore lint/suspicious/noArrayIndexKey: a cell's column is its identity
                  key={c}
                  className={cn("py-1.5", numeric.has(c) ? "text-right tabular-nums" : "font-mono")}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {table.note !== undefined ? (
        <p className="px-2 pt-1.5 text-muted-foreground text-xs">{table.note}</p>
      ) : null}
    </div>
  );
}

export interface LegendItem {
  label: string;
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color: string;
}

/** The one legend row under a chart with more than one series. */
export function SeriesLegend({
  items,
  className,
}: {
  items: readonly LegendItem[];
  className?: string | undefined;
}) {
  return (
    <ul
      data-slot="series-legend"
      className={cn("mt-2 flex flex-wrap gap-3 text-muted-foreground text-xs", className)}
    >
      {items.map((item) => (
        <li key={item.label} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block size-2.5 rounded-xs"
            style={{ background: item.color }}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export interface ChartTipRow {
  label: string;
  value: ReactNode;
  color?: string | undefined;
}

/** The hover card the chart blocks share: a heading, then a row per series. */
export function ChartTip({ heading, rows }: { heading: ReactNode; rows: readonly ChartTipRow[] }) {
  return (
    <div
      data-slot="chart-tip"
      className="min-w-32 rounded-lg border bg-popover px-2 py-1.5 text-popover-foreground text-xs shadow-tooltip"
    >
      <div className="mb-0.5 font-mono text-label text-muted-foreground">{heading}</div>
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between gap-3.5">
          <span>
            {row.color !== undefined ? (
              <span
                aria-hidden="true"
                className="mr-1.5 inline-block h-0.5 w-2.5 align-middle"
                style={{ background: row.color }}
              />
            ) : null}
            {row.label}
          </span>
          <span className="font-semibold tabular-nums">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

interface ChartPlotProps {
  /** The accessible name: what the plot shows. */
  label: string;
  /** The plot's height in pixels; its width is its container's. */
  height: number;
  /** One Recharts chart. */
  children: ComponentProps<typeof ChartContainer>["children"];
  className?: string | undefined;
}

/**
 * The box a Recharts plot draws in: a fixed height, the container's
 * width, the axis labels in the label type, and one accessible name for
 * the whole drawing.
 */
export function ChartPlot({ label, height, children, className }: ChartPlotProps) {
  return (
    <ChartContainer
      config={{}}
      role="img"
      aria-label={label}
      style={{ height }}
      className={cn(
        "aspect-auto w-full [&_.recharts-cartesian-axis-tick_text]:font-mono [&_.recharts-cartesian-axis-tick_text]:text-label",
        className,
      )}
    >
      {children}
    </ChartContainer>
  );
}
