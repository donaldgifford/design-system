import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@donaldgifford/design-system/components/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@donaldgifford/design-system/components/sidebar";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import {
  Children,
  type ComponentProps,
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from "react";

/** How deep a row sits: 0 is a row in the group, 1 is one of its children. */
const DepthContext = createContext(0);

export interface ShellSidebarTreeItemProps {
  label: string;
  /** Before the label: an icon, a `Dot`, or a mark. */
  leading?: ReactNode | undefined;
  /** After the label: a count or a short mono hint. */
  badge?: ReactNode | undefined;
  /** The current page. Sets `aria-current="page"` on the link. */
  active?: boolean | undefined;
  /** The app's link. Left out, a row with children is a button that toggles. */
  render?: ReactElement | undefined;
  /** Shows a caret before there are children, for a row that loads them. */
  expandable?: boolean | undefined;
  /** A caret that cannot open: a row known to be empty. */
  disabled?: boolean | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** More `ShellSidebarTreeItem`s. None, and the row is a leaf. */
  children?: ReactNode | undefined;
}

/**
 * A sidebar row that can hold more rows. Use it inside a
 * `ShellSidebarGroup` and inside itself. Its props decide its form:
 *
 * - `render` and no children: a link, a leaf.
 * - `render` and children (or `expandable`): a link, and a caret button
 *   after it that only toggles.
 * - children and no `render`: one button, and the whole row toggles.
 *
 * Children sit in a nested list that is not in the DOM while closed. The
 * app decides what is open, through `open` and `onOpenChange` or
 * `defaultOpen`; `useTreeOpen` holds the usual rule. Depth is tracked
 * here: each level indents one step on the list's hairline.
 */
export function ShellSidebarTreeItem({
  label,
  leading,
  badge,
  active = false,
  render,
  expandable = false,
  disabled = false,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
}: ShellSidebarTreeItemProps) {
  const depth = useContext(DepthContext);
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const isOpen = open ?? ownOpen;
  const setOpen = (next: boolean) => {
    setOwnOpen(next);
    onOpenChange?.(next);
  };

  const nested = depth > 0;
  const branch = expandable || Children.toArray(children).length > 0;
  const hasCaret = branch;
  const hasBadge = badge !== undefined && badge !== null && badge !== false;

  const content = (
    <>
      {leading === undefined ? null : <Leading>{leading}</Leading>}
      <span className="truncate">{label}</span>
    </>
  );
  const current = render && active ? ({ "aria-current": "page" } as const) : {};
  // Without a link the row is the toggle; with one, the caret is.
  const control = render ?? (branch ? <CollapsibleTrigger /> : <div />);

  const row = nested ? (
    <SidebarMenuSubButton
      render={control}
      isActive={active}
      title={label}
      className={cn(hasBadge && hasCaret ? "pr-14" : (hasBadge || hasCaret) && "pr-8")}
      {...current}
    >
      {content}
    </SidebarMenuSubButton>
  ) : (
    <SidebarMenuButton
      render={control}
      isActive={active}
      className={cn(
        hasBadge && (hasCaret ? "group-has-data-[sidebar=menu-action]/menu-item:pr-14" : "pr-8"),
      )}
      {...current}
    >
      {content}
    </SidebarMenuButton>
  );

  const item = {
    "data-slot": "sidebar-tree-item",
    "data-depth": depth,
    "data-active": active ? true : undefined,
    // The active row colors its own stretch of the list's hairline.
    className: cn(
      nested &&
        active &&
        "before:absolute before:top-0 before:h-7 before:w-0.5 before:rounded-pill before:bg-sidebar-primary",
      nested && active && (depth === 1 ? "before:-left-3" : "before:-left-2.5"),
    ),
  };
  const badgeNode = hasBadge ? (
    <SidebarMenuBadge className={cn(nested && "top-1")}>{badge}</SidebarMenuBadge>
  ) : null;

  if (!branch) {
    const Item = nested ? SidebarMenuSubItem : SidebarMenuItem;
    return (
      <Item {...item}>
        {row}
        {badgeNode}
      </Item>
    );
  }

  const chevron = (
    <IconChevronRight
      aria-hidden="true"
      className={cn("transition-transform", isOpen && "rotate-90")}
    />
  );
  const caretClass = cn("disabled:pointer-events-none disabled:opacity-50", nested && "top-1");

  return (
    <Collapsible
      {...item}
      data-open={isOpen ? true : undefined}
      open={isOpen}
      onOpenChange={setOpen}
      disabled={disabled}
      render={nested ? <SidebarMenuSubItem /> : <SidebarMenuItem />}
    >
      {row}
      {badgeNode}
      {render ? (
        <SidebarMenuAction
          render={<CollapsibleTrigger />}
          aria-label={`${label}, show contents`}
          className={caretClass}
        >
          {chevron}
        </SidebarMenuAction>
      ) : (
        // The row is the button, so its caret is drawn but is not a second one.
        <SidebarMenuAction
          render={<span />}
          aria-hidden="true"
          className={cn(caretClass, "pointer-events-none", disabled && "opacity-50")}
        >
          {chevron}
        </SidebarMenuAction>
      )}
      <CollapsiblePanel>
        <DepthContext.Provider value={depth + 1}>
          <SidebarMenuSub
            data-depth={depth + 1}
            // Past the first level a list gives up its right margin and steps in less.
            className={cn(nested && "mr-0 ml-2 pr-0 pl-2")}
          >
            {children}
          </SidebarMenuSub>
        </DepthContext.Provider>
      </CollapsiblePanel>
    </Collapsible>
  );
}

/** The slot before a label: one fixed square, so icons, dots and marks line up. */
function Leading({ children }: { children: ReactNode }) {
  return (
    <span
      data-slot="sidebar-tree-leading"
      className="flex size-4 shrink-0 items-center justify-center"
    >
      {children}
    </span>
  );
}

/**
 * A line in a branch that is not a row: `InlineLoading` while the
 * children load, or "No documents". It is the list item such a line
 * needs to sit among `ShellSidebarTreeItem`s.
 */
export function ShellSidebarTreeNote({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-tree-note"
      className={cn("px-2 py-1 text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}
