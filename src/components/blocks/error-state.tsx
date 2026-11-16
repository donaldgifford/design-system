import { Button } from "@donaldgifford/design-system/components/button";
import { isApiError } from "@donaldgifford/design-system/lib/errors";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconAlertTriangle, IconRotateClockwise } from "@tabler/icons-react";

interface ErrorStateProps {
  error: unknown;
  /** Shown instead of the error's reason. */
  title?: string;
  onRetry?: () => void;
  className?: string;
}

/** A failed load inside a page: the problem's reason, its request id, and a retry. */
export function ErrorState({ error, title, onRetry, className }: ErrorStateProps) {
  const api = isApiError(error) ? error : undefined;
  const heading = title ?? (api ? api.reason : "Something went wrong");
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div
      role="alert"
      data-slot="error-state"
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-destructive/40 p-10 text-center",
        className,
      )}
    >
      <IconAlertTriangle aria-hidden="true" className="size-8 text-destructive" />
      <h2 className="font-medium text-destructive">{heading}</h2>
      <p className="max-w-md text-muted-foreground text-sm">{message}</p>
      {api?.requestId ? (
        <p className="font-mono text-muted-foreground text-xs">request {api.requestId}</p>
      ) : null}
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          <IconRotateClockwise aria-hidden="true" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
