import { cn } from "@donaldgifford/design-system/lib/utils";

export type ProgressTone = "default" | "success" | "warning" | "destructive";

interface ProgressBarProps {
  /** 0 to 100; clamped. */
  value: number;
  tone?: ProgressTone;
  /** The accessible name: what is progressing. */
  label: string;
  className?: string;
}

const toneClass: Record<ProgressTone, string> = {
  default: "bg-success",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

/** A thin determinate bar: onboarding stages, quota use, a job's tasks. */
export function ProgressBar({ value, tone = "default", label, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("h-2 w-full overflow-hidden rounded-xs bg-muted", className)}
    >
      <div
        data-slot="progress-bar"
        data-tone={tone}
        className={cn("h-full rounded-xs transition-[width]", toneClass[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
