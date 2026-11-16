import { StatStrip } from "@donaldgifford/design-system/blocks/stat-strip";
import { Badge } from "@donaldgifford/design-system/components/badge";
import { Card } from "@donaldgifford/design-system/components/card";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/StatStrip",
  component: StatStrip,
  args: {
    items: [
      { label: "vCPU", value: "30", hint: "of 32" },
      { label: "Memory", value: "112", hint: "GiB" },
      { label: "Nodes", value: "24" },
      { label: "Uptime", value: "14d" },
    ],
  },
} satisfies Meta<typeof StatStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Across the top of a card, as a detail page leads with it; a value can be any node. */
export const InCard: Story = {
  args: {
    items: [
      { label: "Phase", value: <Badge variant="success">ready</Badge> },
      { label: "Sync", value: <Badge variant="warning">out of sync</Badge> },
      { label: "Version", value: "1.33", hint: "EKS" },
      { label: "Last deploy", value: "2h ago", hint: "payments-api" },
    ],
  },
  render: (args) => (
    <Card>
      <StatStrip {...args} className="rounded-t-xl" />
      <p className="px-4 pb-4 text-muted-foreground text-sm">payments-prod-use1 · us-east-1</p>
    </Card>
  ),
};
