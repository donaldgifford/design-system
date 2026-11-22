import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@donaldgifford/design-system/components/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@donaldgifford/design-system/components/popover";
import { ScrollArea } from "@donaldgifford/design-system/components/scroll-area";
import {
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
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

/** True inside the popover a row opens on the icon rail, where every branch is open. */
const FlyoutContext = createContext(false);

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
 *
 * On the icon rail a top-level row shows its `leading` (a mark with the
 * label's first letter when it has none) with the label as its tooltip,
 * and nested rows are not drawn. A top-level row with children opens a
 * popover holding its subtree with every branch open, so each link stays
 * in reach; opening it calls `onOpenChange(true)`, so a row that loads
 * on open loads then. A nested branch that loads on open has nothing to
 * show there until the app has loaded it. On mobile the sidebar is a
 * sheet and the tree is drawn as it is expanded.
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
  const flyout = useContext(FlyoutContext);
  const { state, isMobile } = useSidebar();
  const rail = state === "collapsed" && !isMobile;
  const [ownOpen, setOwnOpen] = useState(defaultOpen);
  const isOpen = open ?? ownOpen;
  const setOpen = (next: boolean) => {
    setOwnOpen(next);
    onOpenChange?.(next);
  };

  const nested = depth > 0;
  const branch = expandable || Children.toArray(children).length > 0;
  // In the rail's popover every branch is open, so none has a caret.
  const hasCaret = branch && !flyout;
  const hasBadge = badge !== undefined && badge !== null && badge !== false;

  const content = (
    <>
      {leading === undefined ? null : <Leading>{leading}</Leading>}
      {leading === undefined && rail && !nested ? <LetterMark label={label} /> : null}
      <span className="truncate">{label}</span>
    </>
  );
  const current = render && active ? ({ "aria-current": "page" } as const) : {};
  // Without a link the row is the toggle; with one, the caret is.
  const control = render ?? (hasCaret ? <CollapsibleTrigger /> : <div />);
  // A row that is neither a link nor a toggle is a heading: it takes no hover.
  const inert = !render && !hasCaret;

  const row = nested ? (
    <SidebarMenuSubButton
      render={control}
      isActive={active}
      title={label}
      className={cn(
        hasBadge && hasCaret ? "pr-14" : (hasBadge || hasCaret) && "pr-8",
        inert && "pointer-events-none",
      )}
      {...current}
    >
      {content}
    </SidebarMenuSubButton>
  ) : (
    <SidebarMenuButton
      render={control}
      isActive={active}
      tooltip={label}
      className={cn(
        hasBadge && (hasCaret ? "group-has-data-[sidebar=menu-action]/menu-item:pr-14" : "pr-8"),
        inert && "pointer-events-none",
      )}
      {...current}
    >
      {content}
    </SidebarMenuButton>
  );

  // The popover's own list has no hairline; the lists inside it do.
  const onHairline = nested && !(flyout && depth === 1);
  const item = {
    "data-slot": "sidebar-tree-item",
    "data-depth": depth,
    "data-active": active ? true : undefined,
    // The active row colors its own stretch of the list's hairline.
    className: cn(
      onHairline &&
        active &&
        "before:absolute before:top-0 before:h-7 before:w-0.5 before:rounded-pill before:bg-sidebar-primary",
      onHairline && active && (depth === 1 ? "before:-left-3" : "before:-left-2.5"),
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

  const list = (
    <DepthContext.Provider value={depth + 1}>
      <SidebarMenuSub
        data-depth={depth + 1}
        // Rows run to the sidebar's right edge, so a long label keeps its room.
        // Past the first level a list steps in less.
        className={cn("mr-0 pr-0", nested && "ml-2 pl-2")}
      >
        {children}
      </SidebarMenuSub>
    </DepthContext.Provider>
  );

  if (flyout) {
    return (
      <SidebarMenuSubItem {...item}>
        {row}
        {badgeNode}
        {list}
      </SidebarMenuSubItem>
    );
  }

  if (rail && !nested) {
    return (
      <SidebarMenuItem {...item}>
        <RailBranch
          label={label}
          active={active}
          render={render}
          content={content}
          onOpen={() => setOpen(true)}
        >
          {children}
        </RailBranch>
      </SidebarMenuItem>
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
      <CollapsiblePanel>{list}</CollapsiblePanel>
    </Collapsible>
  );
}

interface RailBranchProps {
  label: string;
  active: boolean;
  render: ReactElement | undefined;
  /** The row's leading and label, as the rail's button shows them. */
  content: ReactNode;
  onOpen: () => void;
  children: ReactNode;
}

/**
 * A top-level branch on the icon rail: its button opens a popover beside
 * the rail that holds the subtree, every branch open, under a height cap.
 */
function RailBranch({ label, active, render, content, onOpen, children }: RailBranchProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) onOpen();
      }}
    >
      <SidebarMenuButton
        render={<PopoverTrigger />}
        isActive={active}
        // The popover says what the tooltip would.
        tooltip={{ children: label, hidden: open }}
      >
        {content}
      </SidebarMenuButton>
      <PopoverContent side="right" align="start" aria-label={label} className="w-64 gap-1 p-2">
        {render ? (
          <SidebarMenuSubButton
            render={render}
            isActive={active}
            className="font-medium"
            {...(active ? { "aria-current": "page" as const } : {})}
          >
            <span className="truncate">{label}</span>
          </SidebarMenuSubButton>
        ) : (
          <div
            data-slot="sidebar-tree-heading"
            className="flex h-7 items-center px-2 font-medium text-sm"
          >
            <span className="truncate">{label}</span>
          </div>
        )}
        <ScrollArea className="*:data-[slot=scroll-area-viewport]:max-h-80">
          <FlyoutContext.Provider value={true}>
            <DepthContext.Provider value={1}>
              <ul data-slot="sidebar-tree-flyout" className="flex flex-col gap-1">
                {children}
              </ul>
            </DepthContext.Provider>
          </FlyoutContext.Provider>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

/** A neutral mark for a row with no `leading`: the label's first letter. */
function LetterMark({ label }: { label: string }) {
  return (
    <span
      data-slot="sidebar-tree-mark"
      aria-hidden="true"
      className="flex size-4 shrink-0 items-center justify-center rounded-sm bg-sidebar-accent font-medium text-label text-sidebar-accent-foreground uppercase"
    >
      {[...label.trim()][0] ?? ""}
    </span>
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
