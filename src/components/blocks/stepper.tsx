import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconCheck, IconX } from "@tabler/icons-react";

export type StepStatus = "done" | "current" | "upcoming" | "failed";

export interface Step {
  id: string;
  label: string;
  description?: string | undefined;
  status: StepStatus;
}

interface StepperProps {
  steps: Step[];
  /** `vertical` stacks the steps on a line, for a narrow column. */
  orientation?: "horizontal" | "vertical" | undefined;
  /** `sm` marks each step with a dot and no number: a lifecycle, not a wizard. */
  size?: "default" | "sm" | undefined;
  className?: string | undefined;
}

const markerClass: Record<StepStatus, string> = {
  done: "border-success bg-success text-white",
  current: "border-primary text-primary",
  upcoming: "border-border text-muted-foreground",
  failed: "border-destructive bg-destructive text-white",
};

/** The small marker: filled when reached, ringed when current, hollow when not yet. */
const dotClass: Record<StepStatus, string> = {
  done: "bg-success",
  current: "bg-primary ring-3 ring-primary/25",
  upcoming: "border border-border-strong",
  failed: "bg-destructive",
};

/**
 * A list of steps in order: an operation's phases, a wizard's pages, a
 * document's lifecycle. Horizontal by default, wrapping when it runs out
 * of width; `orientation="vertical"` stacks the steps on a line instead.
 */
export function Stepper({
  steps,
  orientation = "horizontal",
  size = "default",
  className,
}: StepperProps) {
  const vertical = orientation === "vertical";
  const small = size === "sm";
  return (
    <ol
      data-slot="stepper"
      data-orientation={vertical ? "vertical" : undefined}
      data-size={small ? "sm" : undefined}
      className={cn(
        "flex text-(length:--text-xs)",
        vertical ? "flex-col" : "flex-wrap gap-x-6 gap-y-3",
        className,
      )}
    >
      {steps.map((step, index) => (
        <li
          key={step.id}
          data-status={step.status}
          aria-current={step.status === "current" ? "step" : undefined}
          className={cn(
            "flex items-start gap-2",
            vertical && "relative last:pb-0",
            vertical && (small ? "pb-3" : "pb-4"),
          )}
        >
          {vertical && index < steps.length - 1 ? (
            <span
              aria-hidden="true"
              data-slot="stepper-line"
              className={cn(
                "absolute w-px -translate-x-1/2 bg-border",
                small ? "top-4.5 bottom-0.5 left-1" : "top-7 bottom-1 left-3",
              )}
            />
          ) : null}
          {small ? (
            <span
              aria-hidden="true"
              className={cn("mt-1.5 size-2 shrink-0 rounded-pill", dotClass[step.status])}
            />
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-pill border font-medium text-xs",
                markerClass[step.status],
              )}
            >
              {step.status === "done" ? (
                <IconCheck className="size-3.5" />
              ) : step.status === "failed" ? (
                <IconX className="size-3.5" />
              ) : (
                index + 1
              )}
            </span>
          )}
          <span className="flex flex-col">
            <span
              className={cn(
                "text-sm",
                step.status === "upcoming" ? "text-muted-foreground" : "font-medium",
              )}
            >
              {step.label}
            </span>
            {step.description ? (
              <span className="text-muted-foreground text-xs">{step.description}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
