import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@donaldgifford/design-system/components/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@donaldgifford/design-system/components/sidebar";
import { AppMark, ShellSidebarIdentity } from "@donaldgifford/design-system/shell/sidebar";
import { IconApps, IconExternalLink, type TablerIcon } from "@tabler/icons-react";
import type { ReactElement } from "react";

export interface SwitcherApp {
  id: string;
  name: string;
  subtitle?: string | undefined;
  /** Left out, the entry gets a neutral mark. */
  icon?: TablerIcon | undefined;
  /** The app's origin. Unused for the current app. */
  url: string;
}

interface AppSwitcherProps {
  /** The apps a deployment runs, this one included. */
  apps: readonly SwitcherApp[];
  /** The id of the app this is. It must be in `apps`. */
  current: string;
  /** The current app's home link, as an element: `<a href="/" />` or a router link. */
  home: ReactElement;
  /** The menu's heading and the trigger's accessible prefix. */
  label?: string | undefined;
}

/**
 * `ShellSidebar`'s `header`: the app's identity, and with more than one
 * app a menu of them. Every other app is a plain link to another origin,
 * opened in the same tab; nothing is shared between the apps and nothing
 * is fetched. With one app it is the identity as a link home. The list
 * is the deployment's configuration, and the app maps ids to icons.
 */
export function AppSwitcher({ apps, current, home, label = "Apps" }: AppSwitcherProps) {
  const { isMobile } = useSidebar();
  const self = apps.find((app) => app.id === current);
  if (!self) {
    throw new Error(`AppSwitcher: no app with id "${current}" in apps`);
  }
  const selfMark = <AppMark icon={self.icon ?? IconApps} />;
  if (apps.length < 2) {
    return (
      <SidebarMenuButton size="lg" tooltip={self.name} render={home}>
        {selfMark}
        <span className="grid flex-1 text-left leading-tight">
          <span className="truncate font-medium text-sidebar-foreground">{self.name}</span>
          {self.subtitle ? (
            <span className="truncate text-muted-foreground text-xs">{self.subtitle}</span>
          ) : null}
        </span>
      </SidebarMenuButton>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
        <span className="sr-only">{label}: </span>
        <ShellSidebarIdentity mark={selfMark} title={self.name} subtitle={self.subtitle} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-slot="app-switcher-menu"
        side={isMobile ? "bottom" : "right"}
        align="start"
        sideOffset={6}
        className="min-w-64"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {apps.map((app) =>
            app.id === current ? (
              <DropdownMenuItem key={app.id} aria-current="true" render={home}>
                <AppMark icon={app.icon ?? IconApps} size="sm" />
                <SwitcherNames app={app} />
                <span className="font-mono text-label text-muted-foreground">current</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem key={app.id} render={<a href={app.url} />}>
                <AppMark
                  icon={app.icon ?? IconApps}
                  size="sm"
                  className="border bg-muted text-foreground"
                />
                <SwitcherNames app={app} />
                <IconExternalLink aria-hidden="true" className="size-3.5 text-muted-foreground" />
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SwitcherNames({ app }: { app: SwitcherApp }) {
  return (
    <span className="grid flex-1 leading-tight">
      <span className="truncate font-medium">{app.name}</span>
      {app.subtitle ? (
        <span className="truncate text-muted-foreground text-xs">{app.subtitle}</span>
      ) : null}
    </span>
  );
}
