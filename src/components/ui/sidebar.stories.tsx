import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@donaldgifford/design-system/components/sidebar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  IconBox,
  IconDots,
  IconLayoutDashboard,
  IconPlus,
  IconServer,
  IconSettings,
  IconSitemap,
  IconUsers,
  type TablerIcon,
} from "@tabler/icons-react";
import type { ComponentProps } from "react";

interface NavItem {
  label: string;
  icon: TablerIcon;
  count?: number;
  active?: boolean;
}

const nav: { group: string; items: NavItem[] }[] = [
  {
    group: "Infrastructure",
    items: [
      { label: "Overview", icon: IconLayoutDashboard, active: true },
      { label: "Clusters", icon: IconServer, count: 12 },
      { label: "Sandboxes", icon: IconBox, count: 3 },
      { label: "Workflows", icon: IconSitemap },
    ],
  },
  {
    group: "Admin",
    items: [
      { label: "Access", icon: IconUsers },
      { label: "Settings", icon: IconSettings },
    ],
  },
];

function slug(label: string) {
  return `#${label.toLowerCase()}`;
}

/** A sidebar beside its inset: the frame's layout, with every part in use. */
function Shell(args: ComponentProps<typeof Sidebar>) {
  return (
    <>
      <Sidebar {...args} className="h-full">
        <SidebarHeader>
          <SidebarInput aria-label="Search navigation" placeholder="Search…" />
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label="Sample navigation" className="contents">
            {nav.map((section) => (
              <SidebarGroup key={section.group}>
                <SidebarGroupLabel>{section.group}</SidebarGroupLabel>
                {section.group === "Infrastructure" ? (
                  <SidebarGroupAction aria-label="New cluster">
                    <IconPlus />
                  </SidebarGroupAction>
                ) : null}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          isActive={item.active}
                          tooltip={item.label}
                          render={<a href={slug(item.label)} />}
                        >
                          <item.icon aria-hidden="true" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                        {item.count ? <SidebarMenuBadge>{item.count}</SidebarMenuBadge> : null}
                        {item.label === "Workflows" ? (
                          <SidebarMenuAction showOnHover aria-label="Workflow actions">
                            <IconDots />
                          </SidebarMenuAction>
                        ) : null}
                        {item.label === "Clusters" ? (
                          <SidebarMenuSub>
                            {["payments-prod-usw2", "payments-stage-usw2"].map((cluster) => (
                              <SidebarMenuSubItem key={cluster}>
                                <SidebarMenuSubButton href={`#${cluster}`}>
                                  <span>{cluster}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Donald Gifford">
                <IconUsers aria-hidden="true" />
                <span>Donald Gifford</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Overview</span>
        </header>
        <div className="p-4 text-sm text-muted-foreground">
          Press Cmd/Ctrl+B or the trigger to toggle the sidebar.
        </div>
      </SidebarInset>
    </>
  );
}

const meta = {
  title: "Primitives/Sidebar",
  component: Sidebar,
  args: { side: "left", variant: "sidebar", collapsible: "offcanvas" },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right"] },
    variant: { control: "inline-radio", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "inline-radio", options: ["offcanvas", "icon", "none"] },
  },
  parameters: { layout: "fullscreen" },
  // The sidebar is position: fixed to the viewport; paint containment makes
  // the bounded wrapper its containing block and clips it when off-canvas.
  decorators: [
    (Story, { parameters }) => (
      <SidebarProvider
        defaultOpen={parameters.sidebarOpen ?? true}
        className="h-96 min-h-0 contain-paint"
      >
        <Story />
      </SidebarProvider>
    ),
  ],
  render: (args) => <Shell {...args} />,
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Floating: Story = { args: { variant: "floating" } };

export const Inset: Story = { args: { variant: "inset" } };

export const Right: Story = { args: { side: "right" } };

/** Collapsed to the icon rail; the menu buttons' tooltips name each item. */
export const IconCollapsed: Story = {
  args: { collapsible: "icon" },
  parameters: { sidebarOpen: false },
};

/** `collapsible="none"`: a static column that ignores the trigger. */
export const NotCollapsible: Story = { args: { collapsible: "none" } };

/** Every menu button variant and size, and both sub-button sizes. */
export const MenuButtonVariants: Story = {
  args: { collapsible: "none" },
  render: (args) => (
    <Sidebar {...args}>
      <SidebarContent>
        {(["default", "outline"] as const).map((variant) => (
          <SidebarGroup key={variant}>
            <SidebarGroupLabel>{variant}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(["sm", "default", "lg"] as const).map((size) => (
                  <SidebarMenuItem key={size}>
                    <SidebarMenuButton variant={variant} size={size}>
                      <IconServer aria-hidden="true" />
                      <span>size {size}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel>Sub buttons</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconServer aria-hidden="true" />
                  <span>Clusters</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {(["sm", "md"] as const).map((size) => (
                    <SidebarMenuSubItem key={size}>
                      <SidebarMenuSubButton
                        href={`#sub-${size}`}
                        size={size}
                        isActive={size === "md"}
                      >
                        <span>size {size}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  ),
};

/** Menu skeletons while the navigation loads. */
export const Loading: Story = {
  render: (args) => (
    <>
      <Sidebar {...args} className="h-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Infrastructure</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {["a", "b", "c", "d"].map((key) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
      </SidebarInset>
    </>
  ),
};
