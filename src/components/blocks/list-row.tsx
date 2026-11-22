import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ReactNode } from "react";

export type DotTone = "neutral" | "ok" | "info" | "warn" | "bad";

const dotClass: Record<DotTone, string> = {
  neutral: "bg-muted-foreground",
  ok: "bg-success",
  info: "bg-info",
  warn: "bg-warning",
  bad: "bg-destructive",
};

/** Whether a tone is one of the package's names, not a color from the app. */
function isDotTone(tone: string): tone is DotTone {
  return Object.hasOwn(dotClass, tone);
}

interface DotProps {
  /**
   * One of the five states, or any CSS color for a category the package
   * has no name for: `var(--category-3)`, a document type's color.
   */
  tone: DotTone | (string & Record<never, never>);
  /** Pulses, for something happening right now. */
  live?: boolean | undefined;
  className?: string | undefined;
}

/** An 8px status dot. */
export function Dot({ tone, live = false, className }: DotProps) {
  const named = isDotTone(tone);
  return (
    <span
      data-slot="dot"
      data-tone={named ? tone : "custom"}
      aria-hidden="true"
      className={cn(
        "inline-block size-2 shrink-0 rounded-pill",
        named && dotClass[tone],
        live && "animate-pulse",
        className,
      )}
      style={named ? undefined : { backgroundColor: tone }}
    />
  );
}

interface ListRowProps {
  /** The leading element: a Dot, a badge, an avatar. */
  leading?: ReactNode | undefined;
  title: ReactNode;
  subtitle?: ReactNode | undefined;
  /** Badges and buttons on the right. */
  trailing?: ReactNode | undefined;
  /** Makes the row one control: the title button stretched over the row. */
  onClick?: (() => void) | undefined;
  className?: string | undefined;
}

/**
 * One row of a compact list: a sandbox, a job, an approval, a document.
 * With `onClick` the title becomes a button stretched over the whole row
 * (so the row reads as one control to the keyboard and the screen
 * reader) while the trailing actions stay clickable above it.
 */
export function ListRow({ leading, title, subtitle, trailing, onClick, className }: ListRowProps) {
  return (
    <div
      data-slot="list-row"
      className={cn(
        "relative flex w-full items-center gap-3 rounded-md text-left has-[[data-slot=list-row-control]:active]:bg-surface-pressed",
        className,
      )}
    >
      {leading}
      <div className="min-w-0 flex-1">
        {onClick ? (
          <button
            type="button"
            data-slot="list-row-control"
            onClick={onClick}
            className="block w-full truncate text-left font-medium text-sm outline-none after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {title}
          </button>
        ) : (
          <div className="truncate font-medium text-sm">{title}</div>
        )}
        {subtitle ? <div className="truncate text-muted-foreground text-xs">{subtitle}</div> : null}
      </div>
      {trailing ? (
        <div className="relative z-10 flex shrink-0 items-center gap-2">{trailing}</div>
      ) : null}
    </div>
  );
}

/** Stacks rows with consistent spacing. */
export function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-slot="list" className={cn("flex flex-col gap-3", className)}>
      {children}
    </div>
  );
}
