import { Dot, type DotTone, ListRow } from "@donaldgifford/design-system/blocks/list-row";
import { Alert } from "@donaldgifford/design-system/components/alert";
import { Badge } from "@donaldgifford/design-system/components/badge";
import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type StatusTone = "success" | "warning" | "destructive" | "muted";

/**
 * The tone of a service state. `operational`, `degraded` and `unknown`
 * are known; anything else (`down`, `disrupted`, a state added later)
 * reads as a disruption, so a new state never shows as healthy.
 */
export function statusTone(state: string): StatusTone {
  switch (state) {
    case "operational":
      return "success";
    case "degraded":
      return "warning";
    case "unknown":
      return "muted";
    default:
      return "destructive";
  }
}

/** The banner's fixed headline for an overall state. */
export function statusHeadline(state: string): string {
  switch (statusTone(state)) {
    case "success":
      return "All systems operational";
    case "warning":
      return "Degraded performance";
    case "muted":
      return "Status not yet available";
    default:
      return "Service disruption";
  }
}

const dotTone: Record<StatusTone, DotTone> = {
  success: "ok",
  warning: "warn",
  destructive: "bad",
  muted: "neutral",
};

const alertVariant = {
  success: "success",
  warning: "warning",
  destructive: "destructive",
  muted: "default",
} as const;

/** A state as a badge in its tone: "operational", "degraded". */
export function StatusBadge({ state, className }: { state: string; className?: string }) {
  return (
    <Badge data-slot="status-badge" variant={statusTone(state)} className={className}>
      {state.replaceAll("_", " ")}
    </Badge>
  );
}

interface StatusBannerProps extends Omit<ComponentProps<"div">, "children"> {
  /** The overall state: `operational`, `degraded`, `unknown`, or a disruption. */
  state: string;
  /** Replaces the fixed headline for the state. */
  headline?: ReactNode | undefined;
  /** A line under the headline: what the page covers. */
  note?: ReactNode | undefined;
  /** The banner's accessible name. */
  label?: string | undefined;
}

/**
 * The top of a status page: one overall state as a headline, on an
 * `Alert` in the state's tone, with a `Dot` and the state as a badge. It
 * is a status region, not an alert: a page that refreshes announces a
 * change of state politely. The dot pulses for any state that is known.
 */
export function StatusBanner({
  state,
  headline,
  note,
  label = "Overall status",
  className,
  ...props
}: StatusBannerProps) {
  const tone = statusTone(state);
  return (
    <Alert
      role="status"
      aria-label={label}
      variant={alertVariant[tone]}
      data-state={state}
      className={cn("py-3", className)}
      {...props}
    >
      <ListRow
        leading={<Dot tone={dotTone[tone]} live={tone !== "muted"} />}
        title={headline ?? statusHeadline(state)}
        subtitle={note}
        trailing={<StatusBadge state={state} />}
      />
    </Alert>
  );
}

export interface StatusComponent {
  /** A short machine name: `api`, `workers`. */
  name: string;
  state: string;
  /** What was measured: "p95 120 ms", "last pass 4m ago". */
  detail?: ReactNode | undefined;
}

interface StatusComponentsProps {
  items: readonly StatusComponent[];
  /** Shown when no component has reported. */
  empty?: ReactNode | undefined;
  /** A footnote under the rows. */
  note?: ReactNode | undefined;
  className?: string | undefined;
}

/**
 * The parts of a service, one `ListRow` each: a `Dot` and a badge in the
 * state's tone, the name, and what was measured. It is flush, for a card
 * with no body padding.
 */
export function StatusComponents({
  items,
  empty = "No components reported yet.",
  note,
  className,
}: StatusComponentsProps) {
  return (
    <div data-slot="status-components" className={className}>
      {items.length === 0 ? (
        <p className="px-3.5 py-2.5 text-muted-foreground text-sm">{empty}</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.name} data-component={item.name} data-state={item.state}>
              <ListRow
                className="px-3.5 py-2.5"
                leading={<Dot tone={dotTone[statusTone(item.state)]} />}
                title={<span className="font-mono">{item.name}</span>}
                subtitle={item.detail}
                trailing={<StatusBadge state={item.state} />}
              />
            </li>
          ))}
        </ul>
      )}
      {note ? <p className="border-t px-3.5 py-2 text-muted-foreground text-xs">{note}</p> : null}
    </div>
  );
}
