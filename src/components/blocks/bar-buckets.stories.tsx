import { BarBuckets } from "@donaldgifford/design-system/blocks/bar-buckets";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/BarBuckets",
  component: BarBuckets,
  args: {
    buckets: [
      { label: "<1d", value: 42 },
      { label: "1-7d", value: 118 },
      { label: "7-30d", value: 76 },
      { label: "30-90d", value: 31 },
      { label: ">90d", value: 9 },
    ],
    series: "open findings",
    label: "Open findings by age",
    height: 200,
    color: "var(--chart-1)",
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarBuckets>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The y axis brackets the data, so small counts still fill the plot. */
export const SmallCounts: Story = {
  args: {
    buckets: [
      { label: "Mon", value: 2 },
      { label: "Tue", value: 0 },
      { label: "Wed", value: 5 },
      { label: "Thu", value: 3 },
      { label: "Fri", value: 1 },
    ],
    series: "deploys",
    label: "Deploys by weekday",
  },
};
