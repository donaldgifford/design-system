import { ExportButton } from "@donaldgifford/design-system/blocks/export-button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

interface Finding {
  repo: string;
  rule: string;
  status: string;
}

const rows: Finding[] = [
  { repo: "payments/api", rule: "codeowners", status: "failing" },
  { repo: "payments/web", rule: "branch-protection", status: "failing" },
  { repo: "data/etl", rule: "license", status: "waived" },
];

const columns = {
  head: ["Repository", "Rule", "Status"],
  row: (f: Finding) => [f.repo, f.rule, f.status],
};

const meta = {
  title: "Blocks/ExportButton",
  component: ExportButton<Finding>,
  args: {
    name: "findings",
    filter: { status: "failing" },
    columns,
    rows,
    // Logged as an action in place of saving a file; drop it to download for real.
    download: fn(),
  },
  argTypes: { columns: { control: false }, all: { control: false } },
} satisfies Meta<typeof ExportButton<Finding>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Saves the loaded rows as `findings-status-failing-<date>.csv`. */
export const Default: Story = {};

/** Disabled while the rows load (undefined) and when there are none. */
export const NotReady: Story = { args: { rows: undefined } };

/** With `all`, a click fetches the whole set; a capped fetch says it was cut short. */
export const Truncated: Story = {
  args: { all: { cap: 10000, fetch: async () => ({ rows, truncated: true }) } },
};
