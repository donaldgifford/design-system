import { Button } from "@donaldgifford/design-system/components/button";
import { cn } from "@donaldgifford/design-system/lib/utils";

interface LoadMoreProps {
  /** How many rows the page holds. */
  loaded: number;
  /** The size of the whole set, when the server says. */
  total?: number | undefined;
  hasMore: boolean;
  loading?: boolean | undefined;
  onMore: () => void;
  /** What a row is, plural: "rows", "findings". */
  noun?: string | undefined;
  className?: string | undefined;
}

/**
 * The footer of a cursor-paged list: how much is loaded, and the button
 * that asks for the next page while there is one. A numbered list pages
 * through DataTable instead.
 */
export function LoadMore({
  loaded,
  total,
  hasMore,
  loading = false,
  onMore,
  noun = "rows",
  className,
}: LoadMoreProps) {
  if (loaded === 0 && !hasMore) return null;
  return (
    <div
      data-slot="load-more"
      className={cn(
        "flex items-center justify-between gap-3 border-t px-3.5 py-2 text-muted-foreground text-xs",
        className,
      )}
    >
      <span aria-live="polite">
        {loaded.toLocaleString("en-US")} loaded
        {total !== undefined ? ` of ${total.toLocaleString("en-US")}` : ""} {noun}
      </span>
      {hasMore ? (
        <Button variant="outline" size="sm" onClick={onMore} disabled={loading}>
          {loading ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  );
}
