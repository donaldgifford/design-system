import { ChartCard } from "@donaldgifford/design-system/blocks/chart-card";
import {
  StackedBarsOverTime,
  stackTimeTable,
} from "@donaldgifford/design-system/blocks/stacked-bars-over-time";
import type { Meta, StoryObj } from "@storybook/react-vite";

const segments = [
  { key: "succeeded", label: "succeeded", color: "var(--success)" },
  { key: "failed", label: "failed", color: "var(--destructive)" },
  { key: "skipped", label: "skipped", color: "var(--chart-4)" },
];

/** Thirty days of runs, deterministic, with two quiet days. */
const month = Array.from({ length: 30 }, (_, i) => ({
  at: new Date(Date.UTC(2026, 2, 1 + i)).toISOString(),
  counts:
    i === 11 || i === 12
      ? {}
      : { succeeded: 40 + ((i * 7) % 23), failed: (i * 5) % 9, skipped: (i * 3) % 6 },
}));

const meta = {
  title: "Blocks/StackedBarsOverTime",
  component: StackedBarsOverTime,
  args: {
    points: month,
    segments,
    rangeDays: 30,
    height: 230,
    legend: true,
    label: "Runs by outcome over 30 days",
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StackedBarsOverTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One bar per bucket; a bucket with nothing in it is an empty slot. */
export const Default: Story = {};

export const Week: Story = {
  args: { points: month.slice(-7), rangeDays: 7, label: "Runs by outcome over 7 days" },
};

/** A day in hourly buckets gets clock times on the x axis. */
export const Day: Story = {
  args: {
    rangeDays: 1,
    label: "Runs by outcome over 24 hours",
    points: Array.from({ length: 24 }, (_, i) => ({
      at: new Date(Date.UTC(2026, 2, 14, i)).toISOString(),
      counts: { succeeded: 2 + ((i * 5) % 7), failed: i % 6 === 0 ? 1 : 0 },
    })),
  },
};

export const Empty: Story = { args: { points: [], empty: "No runs in this range." } };

/** In a `ChartCard`, with the same data as a table behind the toggle. */
export const InCard: Story = {
  render: (args) => (
    <ChartCard
      title="Runs by outcome"
      description="Last 30 days"
      table={stackTimeTable(args.points, args.segments)}
    >
      <StackedBarsOverTime {...args} />
    </ChartCard>
  ),
};
