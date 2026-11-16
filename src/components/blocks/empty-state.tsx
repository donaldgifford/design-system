import { cn } from "@donaldgifford/design-system/lib/utils";
import type { TablerIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: TablerIcon;
  /** The call to action. */
  action?: ReactNode;
  className?: string;
}

/** Nothing here yet, and what to do about it. */
export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center",
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="size-8 text-muted-foreground" /> : null}
      <h2 className="font-medium">{title}</h2>
      {description ? <p className="max-w-md text-muted-foreground text-sm">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
