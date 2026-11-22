import { TimeZoneToggle } from "@donaldgifford/design-system/blocks/time";
import { Badge } from "@donaldgifford/design-system/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@donaldgifford/design-system/components/breadcrumb";
import { Button } from "@donaldgifford/design-system/components/button";
import { Separator } from "@donaldgifford/design-system/components/separator";
import { SidebarProvider, SidebarTrigger } from "@donaldgifford/design-system/components/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@donaldgifford/design-system/components/tooltip";
import { ModeToggle } from "@donaldgifford/design-system/shell/mode-toggle";
import { SearchTrigger } from "@donaldgifford/design-system/shell/search-trigger";
import { TopBarLayout } from "@donaldgifford/design-system/shell/top-bar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconBell } from "@tabler/icons-react";
import { fn } from "storybook/test";

const start = (
  <>
    <SidebarTrigger className="-ml-1" />
    <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#fleet">Fleet</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Clusters</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </>
);

function end(environment: string) {
  return (
    <>
      <Badge variant={environment === "prod" ? "outline" : "warning"} className="mr-1 font-mono">
        {environment}
      </Badge>
      <SearchTrigger
        shortcut="⌘K"
        aria-keyshortcuts="Meta+K Control+K"
        className="mr-1"
        onClick={fn()}
      />
      <TimeZoneToggle className="mr-1" />
      <ModeToggle mode="dark" onToggle={fn()} />
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Notifications" disabled />}
        >
          <IconBell aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>Notifications arrive with the operations work</TooltipContent>
      </Tooltip>
    </>
  );
}

const meta = {
  title: "Shell/TopBar",
  component: TopBarLayout,
  parameters: { layout: "fullscreen" },
  args: { start, end: end("dev") },
  argTypes: {
    start: { control: false },
    end: { control: false },
  },
  // SidebarTrigger needs the sidebar context; the provider also supplies
  // the TooltipProvider the tooltips need.
  decorators: [
    (Story) => (
      <SidebarProvider className="min-h-0 flex-col">
        <Story />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof TopBarLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The content's bar: trigger and breadcrumbs, then the environment, `SearchTrigger`,
 * `TimeZoneToggle`, `ModeToggle`, and notifications.
 */
export const Default: Story = {};

/** In production the environment badge is quiet. */
export const Production: Story = { args: { end: end("prod") } };
