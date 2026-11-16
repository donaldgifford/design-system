import { Button } from "@donaldgifford/design-system/components/button";
import { IconAlertTriangle, IconRotateClockwise } from "@tabler/icons-react";

interface RouteErrorLayoutProps {
  /** The reason code for an API error, or a generic title. */
  title: string;
  message: string;
  /** The HTTP status, shown beside the title when the error came from an API. */
  status?: number;
  requestId?: string;
  onRetry: () => void;
}

/** What a route's error boundary renders: the reason, the message, the request id, and retry. */
export function RouteErrorLayout({
  title,
  message,
  status,
  requestId,
  onRetry,
}: RouteErrorLayoutProps) {
  return (
    <div
      role="alert"
      data-slot="route-error"
      className="m-6 rounded-lg border border-destructive/50 p-6"
    >
      <div className="flex items-center gap-2 font-semibold text-destructive">
        <IconAlertTriangle aria-hidden="true" className="size-4" />
        <span data-testid="error-reason">{title}</span>
        {status !== undefined ? (
          <span className="ml-1 rounded-sm border px-1.5 font-mono text-muted-foreground text-xs">
            HTTP {status}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-muted-foreground text-sm">{message}</p>
      {requestId ? (
        <p className="mt-1 font-mono text-muted-foreground text-xs">request {requestId}</p>
      ) : null}
      <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <IconRotateClockwise aria-hidden="true" />
        Retry
      </Button>
    </div>
  );
}
