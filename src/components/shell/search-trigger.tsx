import { cn } from "@donaldgifford/design-system/lib/utils";
import { Kbd } from "@donaldgifford/design-system/shell/top-bar";
import { IconSearch } from "@tabler/icons-react";
import type { ComponentProps } from "react";

interface SearchTriggerProps extends Omit<ComponentProps<"button">, "children"> {
  /** What it opens: the text in the field, and the button's name. */
  label?: string | undefined;
  /** The key hint at the field's end: "⌘K". Say the same in `aria-keyshortcuts`. */
  shortcut?: string | undefined;
}

/**
 * The top bar's search: a button shaped like a field that opens the
 * command palette. It holds no text and opens nothing itself; the app
 * owns the palette and its shortcut. Below `md` it is the icon alone.
 */
export function SearchTrigger({
  label = "Search",
  shortcut,
  className,
  ...props
}: SearchTriggerProps) {
  return (
    <button
      type="button"
      data-slot="search-trigger"
      className={cn(
        "inline-flex size-(--control-h) shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-base/compact text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:bg-surface-pressed disabled:pointer-events-none disabled:opacity-50",
        // From md it is a field: bordered, on the card surface, as wide as a short query.
        "md:w-56 md:justify-start md:border-input md:bg-card md:px-2.5 md:hover:border-border-strong md:hover:bg-card md:hover:text-muted-foreground",
        className,
      )}
      {...props}
    >
      <IconSearch aria-hidden="true" className="size-4 shrink-0" />
      <span className="sr-only md:not-sr-only md:flex-1 md:truncate md:text-left">{label}</span>
      {shortcut ? (
        <Kbd aria-hidden="true" className="hidden md:inline-flex">
          {shortcut}
        </Kbd>
      ) : null}
    </button>
  );
}
