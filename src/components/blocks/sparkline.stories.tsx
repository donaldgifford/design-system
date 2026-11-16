import { Sparkline } from "@donaldgifford/design-system/blocks/sparkline";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/Sparkline",
  component: Sparkline,
  args: {
    values: [91, 92, 92, 94, 93, 95, 96, 96, 97, 98],
    width: 84,
    height: 22,
    color: "var(--chart-1)",
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A null is an unmeasured point: the line breaks there, it does not dip to zero. */
export const WithGap: Story = { args: { values: [80, 82, null, null, 88, 90, 91, 95] } };

/** Fewer than two measured points draw a dash. */
export const TooFewPoints: Story = { args: { values: [null, 92] } };

/** Beside the number it trends: the sparkline is decoration, the figure carries the meaning. */
export const InARow: Story = {
  render: (args) => (
    <ul className="max-w-xs space-y-2 text-sm">
      {[
        { name: "payments", now: "98.1%", values: [91, 92, 94, 93, 96, 97, 98], tone: 2 },
        { name: "web", now: "87.4%", values: [93, 92, 90, 91, 89, 88, 87], tone: 5 },
        { name: "data", now: "92.0%", values: [92, 92, 92, 92, 92, 92, 92], tone: 1 },
      ].map((row) => (
        <li key={row.name} className="flex items-center justify-between gap-3">
          <span className="font-mono">{row.name}</span>
          <span className="flex items-center gap-2">
            <Sparkline {...args} values={row.values} color={`var(--chart-${row.tone})`} />
            <span className="font-medium tabular-nums">{row.now}</span>
          </span>
        </li>
      ))}
    </ul>
  ),
};
