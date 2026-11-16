import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ReactNode } from "react";

export interface Stat {
  label: string;
  value: ReactNode;
  /** A unit or a comparison after the value, muted. */
  hint?: ReactNode | undefined;
}

interface StatStripProps {
  items: readonly Stat[];
  className?: string | undefined;
}

/** A row of small labelled figures across the top of a card: a detail page's vitals. */
export function StatStrip({ items, className }: StatStripProps) {
  return (
    <dl
      data-slot="stat-strip"
      className={cn("flex flex-wrap divide-x divide-border border-y bg-transparent", className)}
    >
      {items.map((item) => (
        <div key={item.label} className="flex min-w-32 flex-1 flex-col gap-0.5 px-3.5 py-2">
          <dt
            data-slot="stat-label"
            className="font-semibold text-label text-muted-foreground uppercase leading-compact tracking-label"
          >
            {item.label}
          </dt>
          <dd
            data-slot="stat-value"
            className="whitespace-nowrap font-semibold text-foreground text-lg leading-tight"
          >
            {item.value}
            {item.hint ? (
              <small className="ml-1.5 font-normal text-muted-foreground text-xs">
                {item.hint}
              </small>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
