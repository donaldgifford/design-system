import { DiffView } from "@donaldgifford/design-system/blocks/diff-view";
import type { Meta, StoryObj } from "@storybook/react-vite";

const policyBefore = `{
  "Effect": "Deny",
  "Resource": "*"
}`;
const policyAfter = `{
  "Effect": "Deny",
  "Resource": "*",
  "Condition": { "regions": ["us-west-2"] }
}`;

const valuesBefore = `# values.yaml
replicas: 2
image:
  tag: v1.4.1
`;
const valuesAfter = `# values.yaml
replicas: 3
image:
  tag: v1.4.2
`;

const meta = {
  title: "Blocks/DiffView",
  component: DiffView,
  args: {
    file: "pin-regions.json",
    language: "json",
    before: policyBefore,
    after: policyAfter,
  },
  argTypes: {
    language: { control: "select", options: ["json", "yaml", "shell", "hcl", "text"] },
  },
} satisfies Meta<typeof DiffView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Changed lines show as a removal and an addition. */
export const Yaml: Story = {
  args: {
    file: "payments-api/values.yaml",
    language: "yaml",
    before: valuesBefore,
    after: valuesAfter,
  },
};

export const NoChanges: Story = { args: { after: policyBefore, before: policyBefore } };

/** Without a file name the header reads "diff". */
export const Untitled: Story = { args: { file: undefined } };
