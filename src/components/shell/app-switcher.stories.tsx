import { SidebarInset, SidebarProvider } from "@donaldgifford/design-system/components/sidebar";
import { AppSwitcher, type SwitcherApp } from "@donaldgifford/design-system/shell/app-switcher";
import { ShellSidebar } from "@donaldgifford/design-system/shell/sidebar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconFileText, IconRefresh, IconShieldCheck } from "@tabler/icons-react";

// The app maps the ids it knows to icons; the list itself is configuration.
const apps: SwitcherApp[] = [
  {
    id: "updates",
    name: "Updates",
    subtitle: "dependencies · fleet",
    icon: IconRefresh,
    url: "https://updates.example.test",
  },
  {
    id: "compliance",
    name: "Compliance",
    subtitle: "rules · read-only",
    icon: IconShieldCheck,
    url: "https://compliance.example.test",
  },
  {
    id: "docs",
    name: "Docs",
    subtitle: "design docs · review",
    icon: IconFileText,
    url: "https://docs.example.test",
  },
];

// biome-ignore lint/a11y/useAnchorContent: the switcher renders its content into the link
const home = <a href="#home" />;

const meta = {
  title: "Shell/AppSwitcher",
  component: AppSwitcher,
  parameters: { layout: "fullscreen" },
  args: { apps, current: "updates", home, label: "Apps" },
  decorators: [
    (Story, { parameters }) => (
      <SidebarProvider defaultOpen={parameters.sidebarOpen !== false} className="min-h-80">
        <ShellSidebar label="Home navigation" header={<Story />} />
        <SidebarInset />
      </SidebarProvider>
    ),
  ],
} satisfies Meta<typeof AppSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Open the menu: the current app is marked, the others are links to their origins. */
export const Default: Story = {};

/** One app, the default with nothing configured: the identity is a link home, with no menu. */
export const OneApp: Story = { args: { apps: apps.slice(0, 1) } };

/** An entry the app has no icon for gets the neutral mark. */
export const UnknownApp: Story = {
  args: {
    apps: [...apps.slice(0, 2), { id: "wiki", name: "Wiki", url: "https://wiki.example.test" }],
  },
};

/** On the icon rail the trigger is the mark alone. */
export const Collapsed: Story = { parameters: { sidebarOpen: false } };
