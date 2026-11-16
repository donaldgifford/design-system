import { Button } from "@donaldgifford/design-system/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@donaldgifford/design-system/components/sheet";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconX } from "@tabler/icons-react";
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef } from "react";

/**
 * The width from which a detail panel has room to sit beside its list.
 * A page reads it with `useMediaQuery` and passes the answer as `inline`.
 */
export const DETAIL_INLINE_QUERY = "(min-width: 1600px)";

interface DetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode | undefined;
  /** Actions pinned under the body. */
  footer?: ReactNode | undefined;
  children: ReactNode;
  /**
   * Render in the page flow, beside the list, instead of over it. The
   * page gives the panel a grid column.
   */
  inline?: boolean | undefined;
  /**
   * The element to focus on close: the row that opened the panel.
   * Omitted, the overlay returns focus to where it was.
   */
  returnFocusTo?: (() => HTMLElement | null | undefined) | undefined;
  className?: string | undefined;
}

/**
 * A detail view that sits beside its list on a wide screen and slides
 * over it on a narrow one. Both forms are a dialog with the same title,
 * body, and footer, and only the body scrolls. What opens it (a URL
 * parameter, say) is the page's.
 */
export function DetailPanel({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  inline = false,
  returnFocusTo,
  className,
}: DetailPanelProps) {
  if (inline) {
    return open ? (
      <InlinePanel
        onClose={() => onOpenChange(false)}
        title={title}
        description={description}
        footer={footer}
        returnFocusTo={returnFocusTo}
        className={className}
      >
        {children}
      </InlinePanel>
    ) : null;
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        data-slot="detail-panel"
        data-form="overlay"
        finalFocus={returnFocusTo ? () => returnFocusTo() ?? true : undefined}
        className={cn("w-full gap-0 sm:max-w-(--sheet-width-wide)", className)}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description !== undefined ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <PanelBody>{children}</PanelBody>
        {footer !== undefined ? <PanelFooter>{footer}</PanelFooter> : null}
      </SheetContent>
    </Sheet>
  );
}

function PanelBody({ children }: { children: ReactNode }) {
  return (
    <div
      data-slot="detail-panel-body"
      className="min-h-0 flex-1 space-y-4 overflow-y-auto px-(--sheet-padding) pb-(--sheet-padding)"
    >
      {children}
    </div>
  );
}

function PanelFooter({ children }: { children: ReactNode }) {
  return (
    <footer
      data-slot="detail-panel-footer"
      className="flex flex-none items-center justify-between gap-2 border-t p-(--sheet-padding)"
    >
      {children}
    </footer>
  );
}

function InlinePanel({
  onClose,
  title,
  description,
  footer,
  children,
  returnFocusTo,
  className,
}: Omit<DetailPanelProps, "open" | "onOpenChange" | "inline"> & { onClose: () => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  // The panel takes focus when it opens, as the overlay does.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  const close = () => {
    const target = returnFocusTo?.();
    onClose();
    target?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
    }
  };
  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={description !== undefined ? descriptionId : undefined}
      data-slot="detail-panel"
      data-form="inline"
      onKeyDown={onKeyDown}
      className={cn(
        "sticky top-0 flex max-h-dvh flex-col self-start overflow-hidden rounded-lg border bg-card text-base",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-2 p-(--sheet-padding)">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2 id={titleId} className="font-semibold text-foreground">
            {title}
          </h2>
          {description !== undefined ? (
            <p id={descriptionId} className="text-muted-foreground text-sm">
              {description}
            </p>
          ) : null}
        </div>
        <Button ref={closeRef} variant="ghost" size="icon-sm" aria-label="Close" onClick={close}>
          <IconX aria-hidden="true" />
        </Button>
      </header>
      <PanelBody>{children}</PanelBody>
      {footer !== undefined ? <PanelFooter>{footer}</PanelFooter> : null}
    </section>
  );
}

/** A titled block inside a detail panel. */
export function DetailSection({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section data-slot="detail-section" className={className}>
      <h3 className="mb-1.5 font-semibold text-label text-muted-foreground uppercase tracking-label">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** A recessed monospace block for evidence and errors; everything inside is text. */
export function DetailInset({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string | undefined;
  "aria-label"?: string | undefined;
}) {
  return (
    <div
      data-slot="detail-inset"
      className={cn(
        "whitespace-pre-wrap break-all rounded-lg border bg-background px-3 py-2 font-mono text-xs",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
