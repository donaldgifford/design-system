import { StackedBars, type StackRow } from "@donaldgifford/design-system/blocks/stacked-bars";
import type { Meta, StoryObj } from "@storybook/react-vite";

const segments = [
  { key: "passing", label: "passing", color: "var(--success)" },
  { key: "failing", label: "failing", color: "var(--destructive)" },
  { key: "waived", label: "waived", color: "var(--warning)" },
];

const rows: StackRow[] = [
  { label: "branch-protection", counts: { passing: 412, failing: 38, waived: 6 } },
  { label: "codeowners", counts: { passing: 301, failing: 140, waived: 15 } },
  { label: "dependabot", counts: { passing: 220, failing: 12 } },
  { label: "license", counts: { passing: 96, failing: 4, waived: 1 } },
];

const meta = {
  title: "Blocks/StackedBars",
  component: StackedBars,
  args: { rows, segments, legend: true, label: "Results by rule" },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StackedBars>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Each row is scaled to the largest total; hover a segment for its count and share. */
export const Default: Story = {};

/** One row drops its label and spans the width. */
export const SingleRow: Story = { args: { rows: rows.slice(0, 1) } };

export const WithoutLegend: Story = { args: { legend: false } };
