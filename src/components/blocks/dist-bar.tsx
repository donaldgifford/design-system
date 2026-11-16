import { cn } from "@donaldgifford/design-system/lib/utils";

export interface Segment {
  label: string;
  value: number;
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color: string;
}

interface DistBarProps {
  segments: readonly Segment[];
  className?: string | undefined;
}

/** One stacked horizontal bar with a legend: how a total splits. */
export function DistBar({ segments, className }: DistBarProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <div data-slot="dist-bar" className={cn("space-y-2", className)}>
      <div
        className="flex h-7 gap-0.5 overflow-hidden rounded-md"
        role="img"
        aria-label={describe(segments, total)}
      >
        {segments.map((segment) => (
          <div
            key={segment.label}
            style={{
              width: `${total === 0 ? 0 : (100 * segment.value) / total}%`,
              background: segment.color,
            }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block size-2.5 rounded-sm"
              style={{ background: segment.color }}
            />
            {segment.label}
            <span className="font-medium text-foreground tabular-nums">{segment.value}</span>
            <span>{total === 0 ? "0" : Math.round((100 * segment.value) / total)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function describe(segments: readonly Segment[], total: number): string {
  return segments
    .map((s) => `${s.label} ${s.value} (${total === 0 ? 0 : Math.round((100 * s.value) / total)}%)`)
    .join(", ");
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
