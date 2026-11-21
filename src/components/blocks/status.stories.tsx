import { StatusBanner, StatusComponents } from "@donaldgifford/design-system/blocks/status";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/Status",
  component: StatusBanner,
  args: { state: "operational", note: "Public and aggregate-only." },
  argTypes: {
    state: { control: "inline-radio", options: ["operational", "degraded", "down", "unknown"] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Operational: Story = {};

export const Degraded: Story = { args: { state: "degraded" } };

/** Any state that is not known reads as a disruption. */
export const Down: Story = { args: { state: "down" } };

/** Before the first measurement: muted, and the dot is still. */
export const Unknown: Story = { args: { state: "unknown" } };

export const OwnHeadline: Story = {
  args: { state: "degraded", headline: "Webhook deliveries are delayed" },
};

/** The parts of the service, flush in a card. */
export const Components: Story = {
  render: () => (
    <div className="rounded-lg border bg-card">
      <StatusComponents
        items={[
          { name: "api", state: "operational", detail: "p95 84 ms" },
          { name: "workers", state: "operational", detail: "2 pollers" },
          { name: "ingest", state: "degraded", detail: "last delivery 14m ago" },
          { name: "database", state: "down", detail: "no connection" },
          { name: "discovery", state: "unknown" },
        ]}
        note="ingest is informational: it never moves the overall state."
      />
    </div>
  ),
};

export const NoComponents: Story = {
  render: () => (
    <div className="rounded-lg border bg-card">
      <StatusComponents items={[]} />
    </div>
  ),
};
