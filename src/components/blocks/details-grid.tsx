import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ReactNode } from "react";

export interface Detail {
  label: string;
  value: ReactNode;
}

interface DetailsGridProps {
  items: readonly Detail[];
  /** Columns at the `sm` breakpoint and up; one below it. */
  columns?: 1 | 2 | 3;
  className?: string;
}

/** Explicit tracks throughout: an implicit `auto` track is content-sized and overflows its column. */
const columnClass: Record<NonNullable<DetailsGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
};

/** Label and value pairs, label left and value right in each cell: a resource's facts. */
export function DetailsGrid({ items, columns = 2, className }: DetailsGridProps) {
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
