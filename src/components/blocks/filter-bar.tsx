import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export interface FilterBarProps extends ComponentProps<"div"> {
  /** The group's accessible name. */
  label?: string | undefined;
  /** Shows "Clear" after the chips. Leave it out when no filter is set. */
  onClear?: (() => void) | undefined;
  /** The result count at the row's end: "23 of 318". */
  count?: ReactNode | undefined;
}

/**
 * The row a list's filters sit in. Its children are `FilterChip`s: one
 * per filter in force and the dashed chip that adds one. The page owns
 * the filters and what a chip opens; the bar names the group, wraps it,
 * and carries "Clear" and the count.
 */
export function FilterBar({
  label = "Filters",
  onClear,
  count,
  className,
  children,
  ...props
}: FilterBarProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset brings a legend and form semantics a row of buttons does not want
    <div
      role="group"
      aria-label={label}
      data-slot="filter-bar"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    >
      {children}
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="ml-1 rounded-md px-1 text-muted-foreground text-xs outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Clear
        </button>
      ) : null}
      {count === undefined ? null : (
        <span
          data-slot="filter-bar-count"
          className="ml-auto text-muted-foreground text-xs tabular-nums"
        >
          {count}
        </span>
      )}
    </div>
  );
}
