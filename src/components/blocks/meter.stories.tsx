import { Meter } from "@donaldgifford/design-system/blocks/meter";
import type { Meta, StoryObj } from "@storybook/react-vite";

const tones = ["success", "warning", "destructive", "muted"] as const;

const meta = {
  title: "Blocks/Meter",
  component: Meter,
  args: { percent: 94.2, label: "Passing checks", showValue: true, size: "sm", tone: undefined },
  argTypes: {
    percent: { control: { type: "range", min: 0, max: 100, step: 0.1 } },
    tone: { control: "select", options: [undefined, ...tones] },
    size: { control: "inline-radio", options: ["sm", "md"] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The tone follows the thresholds: destructive under 70, warning under 90, success from 90. */
export const Thresholds: Story = {
  render: (args) => (
    <div className="space-y-2">
      <Meter {...args} percent={98.4} />
      <Meter {...args} percent={84} />
      <Meter {...args} percent={41.5} />
      <Meter {...args} percent={null} />
    </div>
  ),
};

/** A page sets its own thresholds, or fixes the tone outright. */
export const CustomThresholds: Story = {
  args: { percent: 62, thresholds: { low: 25, high: 50 } },
};

export const Medium: Story = { args: { size: "md" } };

export const WithoutValue: Story = { args: { showValue: false } };

/** Unmeasured is "no data" on an empty track, never 0%. */
export const NoData: Story = { args: { percent: null } };
