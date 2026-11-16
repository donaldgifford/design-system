import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Buttons on the right. */
  actions?: ReactNode;
  /** Badges beside the title. */
  meta?: ReactNode;
  className?: string;
}

/** The page's title row: title, optional badges and description, actions on the right. */
export function PageHeader({ title, description, actions, meta, className }: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-wrap items-start justify-between gap-4 px-6 pt-6 pb-4", className)}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="truncate font-semibold text-xl">{title}</h1>
          {meta}
        </div>
        {description ? (
          <p className="mt-0.75 text-base/compact text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
