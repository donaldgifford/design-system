import { DetailsGrid } from "@donaldgifford/design-system/blocks/details-grid";
import { Badge } from "@donaldgifford/design-system/components/badge";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Blocks/DetailsGrid",
  component: DetailsGrid,
  args: {
    columns: 2,
    items: [
      { label: "Account", value: "payments-prod" },
      { label: "Region", value: "us-west-2" },
      { label: "Nodes", value: 24 },
      { label: "Class", value: "apps" },
      { label: "Stage", value: "prod" },
      {
        label: "State",
        value: (
          <Badge variant="success" fill="tinted">
            ready
          </Badge>
        ),
      },
    ],
  },
  argTypes: {
    columns: { control: "inline-radio", options: [1, 2, 3] },
  },
} satisfies Meta<typeof DetailsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OneColumn: Story = { args: { columns: 1 } };

export const ThreeColumns: Story = { args: { columns: 3 } };

/** A long value truncates instead of pushing its label out. */
export const LongValue: Story = {
  args: {
    columns: 2,
    items: [
      { label: "Role ARN", value: "arn:aws:iam::123456789012:role/cluster-controller" },
      { label: "Version", value: "1.31" },
    ],
  },
};

/**
 * `layout="list"`: one pair per row, the labels in a column of their own,
 * and values that wrap. For a detail panel, where a value is a sentence,
 * a link, or a row of badges.
 */
export const List: Story = {
  args: {
    layout: "list",
    items: [
      { label: "Rule", value: "codeowners" },
      {
        label: "Detail",
        value: "No CODEOWNERS file was found at the repository root, in docs/, or in .github/.",
      },
      { label: "Role ARN", value: "arn:aws:iam::123456789012:role/cluster-controller" },
      {
        label: "State",
        value: (
          <Badge variant="destructive" fill="tinted">
            failing
          </Badge>
        ),
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};
