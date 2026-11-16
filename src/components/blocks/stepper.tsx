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
  className?: string | undefined;
}

const markerClass: Record<StepStatus, string> = {
  done: "border-success bg-success text-white",
  current: "border-primary text-primary",
  upcoming: "border-border text-muted-foreground",
  failed: "border-destructive bg-destructive text-white",
};

/** A horizontal list of steps: an operation's phases, a wizard's pages. */
export function Stepper({ steps, className }: StepperProps) {
  return (
    <ol
      data-slot="stepper"
      className={cn("flex flex-wrap gap-x-6 gap-y-3 text-(length:--text-xs)", className)}
    >
      {steps.map((step, index) => (
        <li
          key={step.id}
          data-status={step.status}
          aria-current={step.status === "current" ? "step" : undefined}
          className="flex items-start gap-2"
        >
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
