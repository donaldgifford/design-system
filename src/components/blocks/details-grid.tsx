import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ReactNode } from "react";

export interface Detail {
  label: string;
  value: ReactNode;
}

interface DetailsGridProps {
  items: readonly Detail[];
  /**
   * `grid` puts label left and value right in each cell, the value on one
   * line. `list` is one pair per row with the labels in a column of their
   * own, and values that wrap: for links, badges, and long text.
   */
  layout?: "grid" | "list" | undefined;
  /** Columns at the `sm` breakpoint and up; one below it. Ignored by `list`. */
  columns?: 1 | 2 | 3 | undefined;
  className?: string | undefined;
}

/** Explicit tracks throughout: an implicit `auto` track is content-sized and overflows its column. */
const columnClass: Record<NonNullable<DetailsGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

/** Label and value pairs, label left and value right in each cell: a resource's facts. */
export function DetailsGrid({ items, layout = "grid", columns = 2, className }: DetailsGridProps) {
  if (layout === "list") {
    return (
      <dl
        data-slot="details-grid"
        data-layout="list"
        className={cn(
          "grid grid-cols-[max-content_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-base/compact",
          className,
        )}
      >
        {items.map((item) => (
          <div key={item.label} className="contents">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="min-w-0 break-words">{item.value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <dl
      data-slot="details-grid"
      className={cn("grid gap-x-4 gap-y-2 text-base/compact", columnClass[columns], className)}
    >
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-3">
          <dt className="shrink-0 text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 truncate text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
