import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import type { ComponentProps } from "react";

/** The small uppercase label over a group of rows. */
export function OptionHeading({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="option-heading"
      className={cn(
        "px-2 pt-2 pb-1 font-semibold text-label-sm text-muted-foreground uppercase tracking-label",
        className,
      )}
      {...props}
    />
  );
}

export interface OptionItemProps extends ComponentProps<"button"> {
  /** Marks the row in force: a check, and `aria-current`. */
  current?: boolean | undefined;
  /** A mono figure at the row's end: a count, a key, a reason. */
  detail?: string | undefined;
}

/**
 * One row of a picker inside a `Popover`: a scope, a filter's value, a
 * saved view. It is a button, so the page decides what choosing it does
 * and when the popover closes. For a menu of actions use `DropdownMenu`.
 */
export function OptionItem({
  className,
  current = false,
  detail,
  children,
  ...props
}: OptionItemProps) {
  return (
    <button
      type="button"
      data-slot="option-item"
      aria-current={current ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-base/compact outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground active:bg-surface-pressed disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="flex w-3.5 shrink-0 text-primary">
        {current ? <IconCheck aria-hidden="true" className="size-3.5" /> : null}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {detail === undefined ? null : (
        <span className="font-mono text-label text-muted-foreground">{detail}</span>
      )}
    </button>
  );
}

/** A hairline between groups of rows. */
export function OptionSeparator({ className, ...props }: ComponentProps<"hr">) {
  return (
    <hr
      data-slot="option-separator"
      className={cn("my-1 border-0 border-t", className)}
      {...props}
    />
  );
}
