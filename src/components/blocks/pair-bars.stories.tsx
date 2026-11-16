import { PairBars } from "@donaldgifford/design-system/blocks/pair-bars";
import type { Meta, StoryObj } from "@storybook/react-vite";

/** Fourteen days of opened and closed counts, deterministic. */
const days = Array.from({ length: 14 }, (_, i) => ({
  day: new Date(Date.UTC(2026, 2, 1 + i)).toISOString().slice(0, 10),
  a: 6 + ((i * 7) % 11),
  b: 4 + ((i * 5) % 9),
}));

const meta = {
  title: "Blocks/PairBars",
  component: PairBars,
  args: {
    days,
    series: ["opened", "closed"],
    colors: ["var(--chart-1)", "var(--chart-2)"],
    label: "Findings opened and closed per day",
    height: 200,
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PairBars>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A week labels every day. */
export const OneWeek: Story = { args: { days: days.slice(0, 7) } };
