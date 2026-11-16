import { formatPercent } from "@donaldgifford/design-system/lib/percent";
import { cn } from "@donaldgifford/design-system/lib/utils";

export type MeterTone = "success" | "warning" | "destructive" | "muted";

export interface MeterThresholds {
  /** Below this the meter is destructive. */
  low: number;
  /** Below this (and at or above `low`) the meter is warning; from here it is success. */
  high: number;
}

export const meterThresholds: MeterThresholds = { low: 70, high: 90 };

/** The tone a percentage takes: muted when unmeasured, else by threshold. */
export function meterTone(
  percent: number | null | undefined,
  { low, high }: MeterThresholds = meterThresholds,
): MeterTone {
  if (percent === null || percent === undefined) return "muted";
  if (percent < low) return "destructive";
  if (percent < high) return "warning";
  return "success";
}

const trackClass: Record<MeterTone, string> = {
  success: "bg-success/20",
  warning: "bg-warning/20",
  destructive: "bg-destructive/20",
  muted: "bg-muted-foreground/20",
};

const fillClass: Record<MeterTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
  muted: "bg-muted-foreground",
};

interface MeterProps {
  /** 0 to 100; clamped. A null is unmeasured: an empty track and "no data". */
  percent: number | null | undefined;
  /** Fixes the tone; omitted, it follows the thresholds. */
  tone?: MeterTone | undefined;
  thresholds?: MeterThresholds | undefined;
  /** Print the percentage after the bar. */
  showValue?: boolean | undefined;
  /** `sm` is a table cell's bar, `md` a page's. */
  size?: "sm" | "md" | undefined;
  /** The accessible name: what is measured. */
  label: string;
  className?: string | undefined;
}

/**
 * A measured percentage as a bar on a tint of its own tone, with the
 * figure after it. The tone says how good the number is: where
 * ProgressBar shows how far along something is, Meter shows where a
 * reading sits against its thresholds.
 */
export function Meter({
  percent,
  tone,
  thresholds,
  showValue = true,
  size = "sm",
  label,
  className,
}: MeterProps) {
  const resolved = tone ?? meterTone(percent, thresholds);
  const width = percent === null || percent === undefined ? 0 : Math.max(0, Math.min(100, percent));
  return (
    <div data-slot="meter" className={cn("flex items-center gap-2", className)}>
      {/* biome-ignore lint/a11y/useSemanticElements: a native meter can't take the tone tokens for its track and bar across engines */}
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={width}
        aria-valuetext={formatPercent(percent)}
        data-tone={resolved}
        className={cn(
          "min-w-20 flex-1 overflow-hidden rounded-xs",
          size === "md" ? "h-2.5" : "h-1.5",
          trackClass[resolved],
        )}
      >
        <div
          data-slot="meter-bar"
          className={cn("h-full rounded-xs transition-[width]", fillClass[resolved])}
          style={{ width: `${width}%` }}
        />
      </div>
      {/* A fixed-width figure keeps every bar in a column the same length. */}
      {showValue ? (
        <span
          aria-hidden="true"
          className={cn(
            "min-w-13 text-right font-medium tabular-nums",
            resolved === "muted" && "text-muted-foreground",
          )}
        >
          {formatPercent(percent)}
        </span>
      ) : null}
    </div>
  );
}
