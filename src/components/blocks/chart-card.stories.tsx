import { BarList, barListTable } from "@donaldgifford/design-system/blocks/bar-list";
import { ChartCard, ChartTip, DenseTable } from "@donaldgifford/design-system/blocks/chart-card";
import { StackedBars, stackTable } from "@donaldgifford/design-system/blocks/stacked-bars";
import { StatStrip } from "@donaldgifford/design-system/blocks/stat-strip";
import { TrendChart, trendTable } from "@donaldgifford/design-system/blocks/trend-chart";
import { Badge } from "@donaldgifford/design-system/components/badge";
import type { Meta, StoryObj } from "@storybook/react-vite";

const points = Array.from({ length: 30 }, (_, i) => ({
  at: new Date(Date.UTC(2026, 2, 1 + i)).toISOString(),
  value: Math.round((91 + i * 0.22 + ((i * 3) % 4) * 0.3) * 10) / 10,
}));

const reasons = [
  { label: "missing-codeowners", value: 214 },
  { label: "no-branch-protection", value: 131 },
  { label: "stale-dependabot", value: 88 },
  { label: "no-license", value: 41 },
];

const segments = [
  { key: "passing", label: "passing", color: "var(--success)" },
  { key: "failing", label: "failing", color: "var(--destructive)" },
];
const stackRows = [
  { label: "branch-protection", counts: { passing: 412, failing: 38 } },
  { label: "codeowners", counts: { passing: 301, failing: 140 } },
];

const meta = {
  title: "Blocks/ChartCard",
  component: ChartCard,
  args: {
    title: "Passing checks",
    description: "Daily, last 30 days",
    table: trendTable(points, "Passing"),
    children: <TrendChart points={points} series="passing" label="Passing checks over 30 days" />,
  },
  argTypes: {
    table: { control: false },
    children: { control: false },
    action: { control: false },
    legend: { control: false },
    strip: { control: false },
    headingLevel: { control: "inline-radio", options: [2, 3, 4] },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Table" in the header swaps the plot for the same numbers as a table. */
export const Default: Story = {};

/** `action` sits before the toggle. */
export const WithAction: Story = { args: { action: <Badge variant="success">+2.1 pts</Badge> } };

/** `strip` is a band under the header; it stays when the plot is swapped for the table. */
export const WithStrip: Story = {
  args: {
    strip: (
      <StatStrip
        items={[
          { label: "Now", value: "97.4%" },
          { label: "30 days ago", value: "91.0%" },
          { label: "Change", value: "+6.4", hint: "pts" },
        ]}
      />
    ),
  },
};

/** Each chart block exports the helper that builds its table. */
export const WithBarList: Story = {
  args: {
    title: "Findings by rule",
    description: undefined,
    table: barListTable(reasons, "Rule"),
    children: <BarList items={reasons} label="Findings by rule" />,
  },
};

export const WithStackedBars: Story = {
  args: {
    title: "Results by rule",
    description: undefined,
    table: stackTable(stackRows, segments, "Rule"),
    children: <StackedBars rows={stackRows} segments={segments} label="Results by rule" />,
  },
};

/** The table twin on its own. */
export const Table: Story = {
  render: () => <DenseTable table={barListTable(reasons, "Rule")} />,
};

/** The hover card the chart blocks share. */
export const Tip: Story = {
  render: () => (
    <ChartTip
      heading="Mar 14"
      rows={[
        { label: "opened", value: "12", color: "var(--chart-1)" },
        { label: "closed", value: "9", color: "var(--chart-2)" },
      ]}
    />
  ),
};
