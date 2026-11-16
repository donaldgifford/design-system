import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface FilterChipProps extends Omit<ComponentProps<"button">, "name" | "value"> {
  /** The filter's key. Without one, the chip is the dashed "add a filter" chip. */
  name?: string;
  /** The filter's value, shown after the key. */
  value?: ReactNode;
}

/**
 * A `key = value` filter in a filter bar. It is a button: clicking it
 * opens that filter's editor, which the page owns. With no name it is the
 * dashed chip that adds a filter, labelled by its children.
 */
export function FilterChip({ name, value, className, children, ...props }: FilterChipProps) {
  const add = name === undefined;
  return (
    <button
      type="button"
      data-slot="filter-chip"
      data-add={add ? "" : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-label text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        add && "border-dashed",
        className,
      )}
      {...props}
    >
      {add ? (
        (children ?? "+ filter")
      ) : (
        <>
          {name} = <span className="font-medium text-foreground">{value}</span>
        </>
      )}
    </button>
  );
}
