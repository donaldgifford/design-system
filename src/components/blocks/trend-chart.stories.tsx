import { TrendChart } from "@donaldgifford/design-system/blocks/trend-chart";
import type { Meta, StoryObj } from "@storybook/react-vite";

/** Thirty daily samples climbing from 91% to about 98%, deterministic. */
const month = Array.from({ length: 30 }, (_, i) => ({
  at: new Date(Date.UTC(2026, 2, 1 + i)).toISOString(),
  value: Math.round((91 + i * 0.22 + ((i * 3) % 4) * 0.3) * 10) / 10,
}));

const meta = {
  title: "Blocks/TrendChart",
  component: TrendChart,
  args: {
    points: month,
    unit: "%",
    rangeDays: 30,
    series: "passing",
    label: "Passing checks over 30 days",
    height: 230,
    color: "var(--chart-1)",
  },
  argTypes: { unit: { control: "inline-radio", options: ["%", "count"] } },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TrendChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The axis brackets the data: a series between 91% and 98% is not a flat line under 100. */
export const Default: Story = {};

/** Unmeasured points are gaps in the line, never zeros. */
export const WithGaps: Story = {
  args: {
    points: month.map((p, i) => (i >= 11 && i <= 14 ? { ...p, value: null } : p)),
  },
};

/** A count axis starts from the data's floor and never goes below zero. */
export const Counts: Story = {
  args: {
    unit: "count",
    series: "repositories",
    label: "Repositories tracked over 30 days",
    points: month.map((p, i) => ({ ...p, value: 1180 + i * 9 })),
  },
};

/** A one-day range labels the x axis with clock times. */
export const OneDay: Story = {
  args: {
    rangeDays: 1,
    label: "Passing checks today",
    points: Array.from({ length: 12 }, (_, i) => ({
      at: new Date(Date.UTC(2026, 2, 30, i * 2)).toISOString(),
      value: 96 + (i % 3) * 0.4,
    })),
  },
};

export const Empty: Story = { args: { points: [] } };
