import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ComponentProps } from "react";

/**
 * One line that says a panel or a table body is loading. It is a status
 * region, so the text is announced. A `Skeleton` stands in for layout
 * and `EmptyState` fills a page; this is the line inside a card.
 */
export function InlineLoading({ className, children = "Loading…", ...props }: ComponentProps<"p">) {
  return (
    <p
      role="status"
      data-slot="inline-loading"
      className={cn(
        "flex items-center gap-2 px-3.5 py-2.5 text-muted-foreground text-xs",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 animate-pulse rounded-pill bg-muted-foreground motion-reduce:animate-none"
      />
      {children}
    </p>
  );
}

/** One line that says a panel or a table body has nothing in it. */
export function InlineEmpty({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="inline-empty"
      className={cn("px-3.5 py-2.5 text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}
