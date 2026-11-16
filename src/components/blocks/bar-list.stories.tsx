import { BarList } from "@donaldgifford/design-system/blocks/bar-list";
import type { Meta, StoryObj } from "@storybook/react-vite";

const reasons = [
  { label: "missing-codeowners", value: 214 },
  { label: "no-branch-protection", value: 131 },
  { label: "stale-dependabot", value: 88 },
  { label: "no-license", value: 41 },
  { label: "public-fork", value: 17 },
];

const meta = {
  title: "Blocks/BarList",
  component: BarList,
  args: { items: reasons, label: "Findings by rule", color: "var(--chart-1)", share: true },
  argTypes: { items: { control: "object" } },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sorted descending whatever order the items arrive in. */
export const Default: Story = {};

export const WithoutShare: Story = { args: { share: false } };

/** Past `max` rows the rest fold into one "other" row. */
export const Folded: Story = {
  args: {
    max: 4,
    items: [
      ...reasons,
      { label: "no-readme", value: 9 },
      { label: "archived-with-secrets", value: 3 },
    ],
  },
};

/** `sub` adds a muted note; `render` swaps the label for a link. */
export const WithSubAndLinks: Story = {
  args: {
    items: reasons.slice(0, 3).map((item, i) => ({
      ...item,
      sub: ["ownership", "protection", "dependencies"][i],
      render: (label: string) => (
        <a className="underline-offset-4 hover:underline" href={`#${label}`}>
          {label}
        </a>
      ),
    })),
  },
};
