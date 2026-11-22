import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface FilterChipProps extends Omit<ComponentProps<"button">, "name" | "value"> {
  /** The filter's key. Without one, the chip is the dashed "add a filter" chip. */
  name?: string | undefined;
  /** The filter's value, shown after the key. */
  value?: ReactNode | undefined;
  /**
   * Whether the filter is on. Giving it makes the chip a toggle, labelled
   * by its children; `name` and `value` are not shown.
   */
  pressed?: boolean | undefined;
  /** Called with the new state when a toggle chip is clicked. */
  onPressedChange?: ((pressed: boolean) => void) | undefined;
}

/**
 * A filter in a filter bar, in one of two forms.
 *
 * With a `name` it is `key = value`, a button that opens that filter's
 * editor, which the page owns; with neither it is the dashed chip that
 * adds a filter, labelled by its children.
 *
 * With `pressed` it is a toggle: one click turns the filter on or off,
 * with no editor. A row of them is a filter with a few fixed values,
 * such as a document's type.
 */
export function FilterChip({
  name,
  value,
  pressed,
  onPressedChange,
  onClick,
  className,
  children,
  ...props
}: FilterChipProps) {
  const toggle = pressed !== undefined;
  const add = !toggle && name === undefined;
  return (
    <button
      type="button"
      data-slot="filter-chip"
      data-add={add ? "" : undefined}
      aria-pressed={toggle ? pressed : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-label text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        "aria-pressed:border-border-strong aria-pressed:bg-secondary aria-pressed:font-medium aria-pressed:text-foreground",
        add && "border-dashed",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (toggle && !event.defaultPrevented) onPressedChange?.(!pressed);
      }}
    >
      {toggle ? (
        children
      ) : add ? (
        (children ?? "+ filter")
      ) : (
        <>
          {name} = <span className="font-medium text-foreground">{value}</span>
        </>
      )}
    </button>
  );
}
