import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@donaldgifford/design-system/components/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@donaldgifford/design-system/components/dropdown-menu";
import { Separator } from "@donaldgifford/design-system/components/separator";
import {
  SidebarInset,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@donaldgifford/design-system/components/sidebar";
import {
  AppMark,
  AvatarMark,
  ShellSidebar,
  ShellSidebarGroup,
  ShellSidebarIdentity,
} from "@donaldgifford/design-system/shell/sidebar";
import { TopBarLayout } from "@donaldgifford/design-system/shell/top-bar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBuilding,
  IconGitBranch,
  IconLayoutDashboard,
  IconRocket,
  IconServer,
  IconShieldCheck,
  IconSitemap,
  type TablerIcon,
} from "@tabler/icons-react";

interface Item {
  label: string;
  href: string;
  icon: TablerIcon;
  count?: number;
}

const groups: { label?: string; items: Item[] }[] = [
  { items: [{ label: "Overview", href: "#overview", icon: IconLayoutDashboard }] },
  {
    label: "Fleet",
    items: [
      { label: "Clusters", href: "#clusters", icon: IconServer, count: 14 },
      { label: "Deployments", href: "#deployments", icon: IconRocket, count: 3 },
      { label: "Promotions", href: "#promotions", icon: IconGitBranch },
    ],
  },
  {
    label: "Access",
    items: [
      { label: "Accounts", href: "#accounts", icon: IconBuilding },
      { label: "Approvals", href: "#approvals", icon: IconShieldCheck, count: 2 },
      { label: "Workflows", href: "#workflows", icon: IconSitemap },
    ],
  },
];

const active = "#clusters";

const menuButton = (
  <SidebarMenuButton
    size="lg"
    className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
  />
);

const header = (
  <DropdownMenu>
    <DropdownMenuTrigger render={menuButton}>
      <span className="sr-only">Switch app: </span>
      <ShellSidebarIdentity
        mark={<AppMark icon={IconServer} />}
        title="Fleet"
        subtitle="control plane"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right" align="start" className="w-56">
      <DropdownMenuGroup>
        <DropdownMenuLabel>Admin</DropdownMenuLabel>
        <DropdownMenuItem>Fleet</DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

const footer = (
  <DropdownMenu>
    <DropdownMenuTrigger render={menuButton}>
      <span className="sr-only">Account: </span>
      <ShellSidebarIdentity
        mark={<AvatarMark initials="AL" />}
        title="Alex Lee"
        subtitle="alex@example.com"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right" align="end" className="w-56">
      <DropdownMenuItem>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const meta = {
  title: "Shell/Sidebar",
  component: ShellSidebar,
  parameters: { layout: "fullscreen" },
  args: {
    label: "Fleet navigation",
    header,
    footer,
    children: groups.map((group) => (
      <ShellSidebarGroup key={group.label ?? "ungrouped"} label={group.label}>
        {group.items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={item.href === active}
              tooltip={item.label}
              render={
                <a href={item.href} aria-current={item.href === active ? "page" : undefined} />
              }
            >
              <item.icon aria-hidden="true" />
              <span>{item.label}</span>
            </SidebarMenuButton>
            {item.count ? <SidebarMenuBadge>{item.count}</SidebarMenuBadge> : null}
          </SidebarMenuItem>
        ))}
      </ShellSidebarGroup>
    )),
  },
  argTypes: {
    header: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  // The sidebar is fixed to the viewport; the transform makes this bounded
  // box its containing block, so it stays inside the story.
  decorators: [
    (Story, { parameters }) => (
      <div className="h-[28rem] transform-gpu overflow-hidden">
        <SidebarProvider defaultOpen={parameters.sidebarOpen !== false} className="h-full min-h-0">
          <Story />
        </SidebarProvider>
      </div>
    ),
  ],
  // As in the frame: the sidebar beside the content and its top bar.
  render: (args) => (
    <>
      <ShellSidebar {...args} />
      <SidebarInset className="min-w-0">
        <TopBarLayout
          start={
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
          }
          end={null}
        />
        <div className="p-6">
          <h1 className="font-semibold text-xl">Clusters</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            The trigger collapses the sidebar to an icon rail.
          </p>
        </div>
      </SidebarInset>
    </>
  ),
} satisfies Meta<typeof ShellSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The icon rail: the app's mark, each item's icon (its label the tooltip), and the avatar. */
export const Collapsed: Story = { parameters: { sidebarOpen: false } };
