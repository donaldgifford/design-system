import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@donaldgifford/design-system/components/sidebar";
import { cn } from "@donaldgifford/design-system/lib/utils";
import { IconSelector, type TablerIcon } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface ShellSidebarProps {
  /** The nav landmark's name, such as "Home navigation". */
  label: string;
  /** Above the nav: the app switcher, a `ShellSidebarIdentity` in a menu. */
  header?: ReactNode | undefined;
  /** Below the nav: the user menu, a `ShellSidebarIdentity` in a menu. */
  footer?: ReactNode | undefined;
  /** `ShellSidebarGroup`s. */
  children?: ReactNode | undefined;
}

/**
 * The frame's sidebar, full height beside the content, after shadcn's
 * sidebar-07: the app switcher on top, the nav, and the user at the foot.
 * Collapsed, it is an icon rail: the app's mark, each item's icon (its
 * label the tooltip), and the user's avatar.
 */
export function ShellSidebar({ label, header, footer, children }: ShellSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      {header ? (
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>{header}</SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      ) : null}
      <SidebarContent>
        {/* A nav landmark so the links are "in" a region for assistive tech. */}
        <nav aria-label={label} className="contents">
          {children}
        </nav>
      </SidebarContent>
      {footer ? (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>{footer}</SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      ) : null}
      <SidebarRail />
    </Sidebar>
  );
}

interface ShellSidebarGroupProps {
  /** The group label; none for an ungrouped list. */
  label?: string | undefined;
  /** `SidebarMenuItem`s. */
  children: ReactNode;
}

/** One labelled group of sidebar items. */
export function ShellSidebarGroup({ label, children }: ShellSidebarGroupProps) {
  return (
    <SidebarGroup>
      {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        <SidebarMenu>{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

interface ShellSidebarIdentityProps {
  /** The square on the left: an `AppMark` or an `AvatarMark`. */
  mark: ReactNode;
  title: string;
  subtitle?: string | undefined;
}

/**
 * The content of the header's and footer's large menu buttons: a mark,
 * a title over a subtitle, and the up-down chevrons of a menu. Collapsed,
 * only the mark shows. Render it inside `SidebarMenuButton size="lg"`.
 */
export function ShellSidebarIdentity({ mark, title, subtitle }: ShellSidebarIdentityProps) {
  return (
    <>
      {mark}
      <span className="grid flex-1 text-left leading-tight">
        <span className="truncate font-medium text-sidebar-foreground">{title}</span>
        {subtitle ? (
          <span className="truncate text-muted-foreground text-xs">{subtitle}</span>
        ) : null}
      </span>
      <IconSelector aria-hidden="true" className="ml-auto" />
    </>
  );
}

const markClass = "flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg";

/** An app's mark: its icon on the primary color. */
export function AppMark({ icon: Icon, className }: { icon: TablerIcon; className?: string }) {
  return (
    <span
      data-slot="app-mark"
      className={cn(markClass, "bg-primary text-primary-foreground", className)}
    >
      <Icon aria-hidden="true" />
    </span>
  );
}

/** A user's mark: their initials, from `initialsOf`, on the avatar color. */
export function AvatarMark({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        markClass,
        "bg-avatar font-semibold text-avatar-foreground text-label",
        className,
      )}
    >
      {initials}
    </span>
  );
}
