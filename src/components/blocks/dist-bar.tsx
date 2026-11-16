import { cn } from "@donaldgifford/design-system/lib/utils";

export interface Segment {
  label: string;
  value: number;
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color: string;
}

interface DistBarProps {
  segments: readonly Segment[];
  /**
   * The accessible name: what is being split. The segments' counts are
   * appended, so the bar reads without its legend.
   */
  label?: string | undefined;
  /** `md` is a card's headline bar, `sm` a thin one for a table cell or a dense row. */
  size?: "sm" | "md" | undefined;
  /** Show the legend under the bar. */
  legend?: boolean | undefined;
  className?: string | undefined;
}

/** One stacked horizontal bar with a legend: how a total splits. */
export function DistBar({ segments, label, size = "md", legend = true, className }: DistBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const summary = describe(segments, total);
  return (
    <div data-slot="dist-bar" className={cn("space-y-2", className)}>
      <div
        data-size={size}
        className={cn(
          "flex gap-0.5 overflow-hidden",
          size === "sm" ? "h-2.5 rounded-xs" : "h-7 rounded-md",
        )}
        role="img"
        aria-label={label === undefined ? summary : `${label}: ${summary}`}
      >
        {/* An empty segment is skipped, so it adds no gap. */}
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <div
              key={segment.label}
              title={`${segment.label} ${segment.value.toLocaleString("en-US")} (${share(segment.value, total)}%)`}
              style={{
                width: `${(100 * segment.value) / total}%`,
                background: segment.color,
              }}
            />
          ))}
      </div>
      {legend ? (
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block size-2.5 rounded-sm"
                style={{ background: segment.color }}
              />
              {segment.label}
              <span className="font-medium text-foreground tabular-nums">
                {segment.value.toLocaleString("en-US")}
              </span>
              <span>{share(segment.value, total)}%</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function share(value: number, total: number): number {
  return total === 0 ? 0 : Math.round((100 * value) / total);
}

function describe(segments: readonly Segment[], total: number): string {
  return segments.map((s) => `${s.label} ${s.value} (${share(s.value, total)}%)`).join(", ");
}

interface OutcomesProps {
  items: readonly Segment[];
  className?: string | undefined;
}

/** Labelled counts with a proportional bar under each: workflow outcomes, request states. */
export function Outcomes({ items, className }: OutcomesProps) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <ul data-slot="outcomes" className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-medium tabular-nums">{item.value}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-pill bg-muted">
            <div
              className="h-full rounded-pill"
              style={{ width: `${(100 * item.value) / max}%`, background: item.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
