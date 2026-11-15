import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

interface TopBarLayoutProps {
  /** The left side: the sidebar trigger, a separator, and the breadcrumbs. */
  start: ReactNode;
  /** The right side: the environment, search, clock, theme, notifications. */
  end: ReactNode;
}

/**
 * The content's top bar, beside the sidebar as in shadcn's sidebar-07:
 * sticky, `--header-height` tall, on the page background.
 */
export function TopBarLayout({ start, end }: TopBarLayoutProps) {
  return (
    <header
      data-slot="top-bar"
      className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background px-3 text-base"
    >
      {start}
      <div className="ml-auto flex items-center gap-1">{end}</div>
    </header>
  );
}

/** A keyboard shortcut hint. */
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 items-center rounded-xs border bg-transparent px-1 font-mono text-label-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Up to two initials from a name, or from the local part of an email. */
export function initialsOf(name: string | undefined, email: string): string {
  const source = name && name.trim() !== "" ? name : (email.split("@")[0] ?? email);
  const parts = source.split(/[\s._-]+/).filter((part) => part !== "");
  const letters =
    parts.length >= 2 ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}` : source.slice(0, 2);
  return letters.toUpperCase();
}
