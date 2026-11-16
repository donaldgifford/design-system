import { Card, CardContent } from "@donaldgifford/design-system/components/card";
import { cn } from "@donaldgifford/design-system/lib/utils";
import type { TablerIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface KpiProps {
  label: string;
  value: ReactNode;
  /** A short line under the value: a delta, a bound, a hint. */
  hint?: ReactNode | undefined;
  icon?: TablerIcon | undefined;
  tone?: "default" | "success" | "warning" | "destructive" | undefined;
  className?: string | undefined;
}

const toneClass: Record<NonNullable<KpiProps["tone"]>, string> = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

/** One number with a label: quota use, counts, rates. */
export function Kpi({ label, value, hint, icon: Icon, tone = "default", className }: KpiProps) {
  return (
    <Card data-slot="kpi" className={cn("gap-1 py-2.5", className)}>
      <CardContent className="px-3.5">
        <div
          data-slot="kpi-label"
          className="flex items-center justify-between text-muted-foreground text-xs leading-dense"
        >
          <span>{label}</span>
          {Icon ? <Icon aria-hidden="true" className="size-3.75" /> : null}
        </div>
        <div
          data-slot="kpi-value"
          data-tone={tone}
          className={cn(
            "mt-0.5 font-semibold text-(length:--kpi-value-size) tabular-nums leading-tight",
            toneClass[tone],
          )}
        >
          {value}
        </div>
        {hint ? (
          <div data-slot="kpi-hint" className="mt-0.5 text-muted-foreground text-xs">
            {hint}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
