import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@donaldgifford/design-system/components/collapsible";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface DisclosureProps {
  /** What the block holds: "Front matter", "Filters", "On this page". */
  label: ReactNode;
  /** Shown beside the label while closed: a count, or the value in force. */
  value?: ReactNode | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
  children: ReactNode;
}

/**
 * A bordered block that opens under its own heading row: secondary
 * detail a page keeps one click away. Closed, the row can carry a
 * `value` so the reader sees what is inside without opening it, and the
 * content is not in the DOM.
 */
export function Disclosure({
  label,
  value,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
}: DisclosureProps) {
  return (
    <Collapsible
      data-slot="disclosure"
      // Base UI reads a defined `open` as controlled, so it is passed only when given.
      {...(open === undefined ? {} : { open })}
      defaultOpen={defaultOpen}
      disabled={disabled}
      onOpenChange={(next) => onOpenChange?.(next)}
      className={cn("rounded-lg border bg-card", className)}
    >
      <CollapsibleTrigger className="group/disclosure flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-medium text-sm outline-none transition-colors hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-surface-pressed disabled:pointer-events-none disabled:opacity-50">
        <IconChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform group-data-panel-open/disclosure:rotate-90"
        />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {value === undefined ? null : (
          <span
            data-slot="disclosure-value"
            className="min-w-0 shrink truncate font-normal text-muted-foreground text-xs group-data-panel-open/disclosure:hidden"
          >
            {value}
          </span>
        )}
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div data-slot="disclosure-content" className="border-t px-3 py-3">
          {children}
        </div>
      </CollapsiblePanel>
    </Collapsible>
  );
}
