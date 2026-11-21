import { PageHeader } from "@donaldgifford/design-system/blocks/page-header";
import { cn } from "@donaldgifford/design-system/lib/utils";
import type { ReactNode } from "react";

interface StatusPageLayoutProps {
  /** Before the title: the app's icon. */
  mark?: ReactNode | undefined;
  /** The page's heading: "Fleet status". */
  title: string;
  /** Under the title: when it was computed and how often it refreshes. */
  description?: ReactNode | undefined;
  /** Right of the title: a docs link, sign in. */
  actions?: ReactNode | undefined;
  /** Under the content: the endpoint the page reads, a note. */
  footer?: ReactNode | undefined;
  /** A `StatusBanner`, then the page's cards. */
  children?: ReactNode | undefined;
  className?: string | undefined;
}

/**
 * A public status page's frame: one narrow column outside the app shell,
 * with no sidebar and no session, under the same `PageHeader` as every
 * other page.
 */
export function StatusPageLayout({
  mark,
  title,
  description,
  actions,
  footer,
  children,
  className,
}: StatusPageLayoutProps) {
  return (
    <main
      data-slot="status-page"
      className={cn("mx-auto flex max-w-3xl flex-col gap-5 px-4 py-10", className)}
    >
      <PageHeader
        className="p-0"
        title={
          mark ? (
            <span className="flex items-center gap-2 [&>svg]:size-5 [&>svg]:text-primary">
              {mark}
              {title}
            </span>
          ) : (
            title
          )
        }
        description={description}
        actions={actions}
      />
      {children}
      {footer ? (
        <footer className="flex flex-wrap items-center justify-between gap-3 text-muted-foreground text-xs">
          {footer}
        </footer>
      ) : null}
    </main>
  );
}
