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

/** `label` says what is split; the counts follow it in the bar's accessible name. */
export const Labelled: Story = { args: { label: "Clusters by phase" } };

/** `size="sm"` without its legend, for a table cell or a dense row. */
export const Small: Story = { args: { size: "sm", legend: false, label: "Clusters by phase" } };

/** A segment with no count draws nothing and leaves no gap; the legend still lists it. */
export const EmptySegment: Story = {
  args: {
    segments: [
      { label: "ready", value: 1240, color: "var(--chart-2)" },
      { label: "degraded", value: 0, color: "var(--chart-5)" },
      { label: "upgrading", value: 310, color: "var(--chart-1)" },
    ],
  },
};

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
