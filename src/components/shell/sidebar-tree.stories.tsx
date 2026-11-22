import { SidebarInset, SidebarProvider } from "@donaldgifford/design-system/components/sidebar";
import { ShellSidebar, ShellSidebarGroup } from "@donaldgifford/design-system/shell/sidebar";
import { ShellSidebarTreeItem } from "@donaldgifford/design-system/shell/sidebar-tree";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconBook, IconFileText, IconLayoutDashboard } from "@tabler/icons-react";

const meta = {
  title: "Shell/SidebarTree",
  component: ShellSidebarTreeItem,
  parameters: { layout: "fullscreen" },
  args: { label: "Documents" },
  argTypes: {
    leading: { control: false },
    badge: { control: false },
    render: { control: false },
    children: { control: false },
  },
  // The sidebar is fixed to the viewport; the transform makes this bounded
  // box its containing block, so it stays inside the story.
  decorators: [
    (Story, { parameters }) => (
      <div className="h-[32rem] transform-gpu overflow-hidden">
        <SidebarProvider defaultOpen={parameters.sidebarOpen !== false} className="h-full min-h-0">
          <ShellSidebar label="Repository navigation">
            <Story />
          </ShellSidebar>
          <SidebarInset className="min-w-0" />
        </SidebarProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof ShellSidebarTreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The three forms, decided by a row's props: a link (a leaf), a link
 * with a caret that only toggles, and a row that is itself the toggle.
 */
export const Forms: Story = {
  render: () => (
    <ShellSidebarGroup label="Repository">
      <ShellSidebarTreeItem
        label="Overview"
        leading={<IconLayoutDashboard aria-hidden="true" />}
        render={<a href="#overview" />}
      />
      <ShellSidebarTreeItem
        label="Documents"
        leading={<IconFileText aria-hidden="true" />}
        badge={3}
        render={<a href="#documents" />}
        defaultOpen
      >
        <ShellSidebarTreeItem label="RFC-0003 Sidebar tree" render={<a href="#rfc-0003" />} />
        <ShellSidebarTreeItem label="ADR-0004 One repository" render={<a href="#adr-0004" />} />
        <ShellSidebarTreeItem
          label="DESIGN-0026 The shell in the look of its first consumer"
          render={<a href="#design-0026" />}
        />
      </ShellSidebarTreeItem>
      <ShellSidebarTreeItem label="Guides" leading={<IconBook aria-hidden="true" />} defaultOpen>
        <ShellSidebarTreeItem label="Install" render={<a href="#install" />} />
        <ShellSidebarTreeItem label="Configure" render={<a href="#configure" />} />
      </ShellSidebarTreeItem>
    </ShellSidebarGroup>
  ),
};
