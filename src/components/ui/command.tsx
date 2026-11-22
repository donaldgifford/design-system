import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@donaldgifford/design-system/components/dialog";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconSearch } from "@tabler/icons-react";
import { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * cmdk reads Enter, Space and the arrow keys anywhere inside the
 * palette, to move through the list and pick from it. A control in the
 * filters, the preview or the footer needs Enter and Space for itself,
 * so those two stop here; the arrows still reach the list.
 */
function keepActivationKeys(event: React.KeyboardEvent) {
  if (event.target === event.currentTarget) return;
  if (event.key === "Enter" || event.key === " ") event.stopPropagation();
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  commandProps,
  preview,
  previewLabel = "Preview",
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  /** Props for the inner Command: `shouldFilter`, `loop`, `filter`, `label`. */
  commandProps?: Omit<React.ComponentProps<typeof CommandPrimitive>, "children"> | undefined;
  /**
   * A pane beside the list for the highlighted item: with it the dialog
   * is wider and its body splits in two. Below `sm` it is hidden and the
   * list takes the width. Which item is highlighted is the Command's
   * `value`; read it with `commandProps={{ value, onValueChange }}`.
   */
  preview?: React.ReactNode | undefined;
  /** The preview pane's accessible name. */
  previewLabel?: string | undefined;
  children?: React.ReactNode | undefined;
  title?: string | undefined;
  description?: string | undefined;
  className?: string | undefined;
  showCloseButton?: boolean | undefined;
}) {
  return (
    <Dialog {...props}>
      {/* The header lives inside the content: shadcn's default puts it outside,
          where it stays in the DOM while the dialog is closed, outside any
          landmark, and detached from the dialog it labels. */}
      <DialogContent
        className={cn("overflow-hidden p-0", preview !== undefined && "sm:max-w-3xl", className)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command
          {...commandProps}
          className={cn(
            "**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
            // With a preview the body is two columns: the input, the filters
            // and the footer span both, and the list and the preview share a row.
            preview !== undefined &&
              "sm:grid sm:grid-cols-2 sm:[&>[data-slot=command-input-wrapper]]:col-span-full",
            commandProps?.className,
          )}
        >
          {children}
          {preview === undefined ? null : (
            // biome-ignore lint/a11y/useSemanticElements: a section would be a second landmark inside the dialog; this names one pane of it
            <div
              role="group"
              aria-label={previewLabel}
              data-slot="command-preview"
              onKeyDown={keepActivationKeys}
              className="hidden max-h-75 overflow-y-auto border-l p-3 text-sm sm:block"
            >
              {preview}
            </div>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
      <IconSearch className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-75 scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
      {...props}
    />
  );
}

function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  // cmdk renders role="separator" inside the listbox, where ARIA allows only
  // options and groups; the rule between groups is visual, so it's hidden.
  return (
    <CommandPrimitive.Separator
      aria-hidden="true"
      data-slot="command-separator"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A row of filters under the input: `FilterChip`s that narrow what the
 * list searches. Place it after `CommandInput`. Its controls keep Enter
 * and Space, and the arrow keys still move through the list.
 */
function CommandFilters({
  className,
  onKeyDown,
  "aria-label": label = "Filters",
  ...props
}: React.ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset brings a legend and form semantics a row of buttons does not want
    <div
      role="group"
      aria-label={label}
      data-slot="command-filters"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        keepActivationKeys(event);
      }}
      className={cn(
        "col-span-full flex flex-wrap items-center gap-1.5 border-b px-3 py-2",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A row along the palette's foot for key hints: "↵ open", "esc close".
 * It is last whatever its place among the children.
 */
function CommandFooter({ className, onKeyDown, ...props }: React.ComponentProps<"div">) {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the handler only keeps Enter and Space for a control inside
    <div
      data-slot="command-footer"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        keepActivationKeys(event);
      }}
      className={cn(
        "order-last col-span-full flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-3 py-2 text-muted-foreground text-xs",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFilters,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
