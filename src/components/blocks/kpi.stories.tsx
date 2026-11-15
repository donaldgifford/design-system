import { Kpi } from "@donaldgifford/design-system/blocks/kpi";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { IconBoxMultiple, IconCpu, IconServer } from "@tabler/icons-react";

const tones = ["default", "success", "warning", "destructive"] as const;

/** One KPI at a dashboard tile's width, not the canvas's. */
const tile: Decorator = (Story) => (
  <div className="max-w-xs">
    <Story />
  </div>
);

const meta = {
  title: "Blocks/Kpi",
  component: Kpi,
  args: {
    label: "Sandboxes",
    value: "2 / 5",
    hint: "Payments",
    tone: "default",
    icon: IconBoxMultiple,
  },
  argTypes: {
    tone: { control: "select", options: tones },
    icon: {
      control: "select",
      options: ["none", "Boxes", "Cpu", "Server"],
      mapping: { none: undefined, Boxes: IconBoxMultiple, Cpu: IconCpu, Server: IconServer },
    },
  },
} satisfies Meta<typeof Kpi>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { decorators: [tile] };

export const WithoutHint: Story = {
  args: { label: "Clusters", value: 14, hint: undefined, icon: IconServer },
  decorators: [tile],
};

/** Every tone, as a row of KPIs on a dashboard. */
export const AllTones: Story = {
  render: (args) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi {...args} label="Applications" value={42} hint="in 6 accounts" tone="default" />
      <Kpi {...args} label="Succeeded" value={412} hint="last 24h" tone="success" />
      <Kpi
        {...args}
        label="vCPU"
        value="30 / 32"
        hint="near the quota"
        tone="warning"
        icon={IconCpu}
      />
      <Kpi {...args} label="Failed deploys" value={2} hint="since 09:00" tone="destructive" />
    </div>
  ),
};
