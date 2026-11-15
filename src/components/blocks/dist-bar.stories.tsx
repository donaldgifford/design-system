import { DistBar, Outcomes } from "@donaldgifford/design-system/blocks/dist-bar";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/DistBar",
  component: DistBar,
  args: {
    segments: [
      { label: "ready", value: 11, color: "var(--chart-2)" },
      { label: "degraded", value: 1, color: "var(--chart-5)" },
      { label: "upgrading", value: 2, color: "var(--chart-1)" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DistBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A zero total draws an empty bar and 0% for every segment. */
export const Empty: Story = {
  args: {
    segments: [
      { label: "ready", value: 0, color: "var(--chart-2)" },
      { label: "degraded", value: 0, color: "var(--chart-5)" },
    ],
  },
};

/** The sibling block: one bar per item, scaled to the largest. */
export const OutcomesList: Story = {
  render: () => (
    <Outcomes
      items={[
        { label: "completed", value: 412, color: "var(--chart-2)" },
        { label: "cancelled", value: 9, color: "var(--chart-4)" },
        { label: "failed", value: 2, color: "var(--chart-5)" },
      ]}
    />
  ),
};
