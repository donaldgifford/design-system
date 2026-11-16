import { cn } from "@donaldgifford/design-system/lib/utils";
import { type KeyboardEvent, type ReactNode, useRef } from "react";

export interface SeriesPill {
  key: string;
  label: string;
  /** A CSS color; the chart tokens as `var(--chart-1)` are the usual choice. */
  color: string;
  /** The series' current value, shown after its label. */
  value?: ReactNode | undefined;
}

interface SeriesPillsProps {
  items: readonly SeriesPill[];
  /** The key of the selected series. */
  value: string;
  onValueChange: (key: string) => void;
  /** The accessible name: what is being picked. */
  label: string;
  className?: string | undefined;
}

/**
 * A legend that picks the series a chart shows: one pill per series with
 * its color, name, and current value. It is a radio group, so exactly one
 * is selected, the arrow keys move the selection, and the choice is
 * announced.
 */
export function SeriesPills({ items, value, onValueChange, label, className }: SeriesPillsProps) {
  const group = useRef<HTMLDivElement>(null);
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = (index + step + items.length) % items.length;
    const item = items[next];
    if (!item) return;
    onValueChange(item.key);
    group.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus();
  };
  // With nothing selected the first pill takes the tab stop, so the group stays reachable.
  const tabStop = items.some((item) => item.key === value) ? value : items[0]?.key;
  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label={label}
      data-slot="series-pills"
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {items.map((item, index) => {
        const checked = item.key === value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: a native radio can't hold the swatch, label, and value as its own content
          <button
            key={item.key}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={item.key === tabStop ? 0 : -1}
            onClick={() => onValueChange(item.key)}
            onKeyDown={(event) => move(event, index)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              checked
                ? "border-primary/50 bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className="inline-block size-2 rounded-xs"
              style={{ background: item.color }}
            />
            {item.label}
            {item.value !== undefined ? (
              <span className="font-medium text-foreground tabular-nums">{item.value}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
