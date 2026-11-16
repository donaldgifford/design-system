import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Blocks/FilterChip",
  component: FilterChip,
  args: { name: "org", value: "payments", onClick: fn(), disabled: false },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clicking a chip opens that filter's editor, which the page owns. */
export const Default: Story = {};

/** With no name the chip is the dashed one that adds a filter. */
export const Add: Story = { args: { name: undefined, value: undefined } };

export const Disabled: Story = { args: { disabled: true } };

/** A filter bar: the filters in force, then the chip that adds one. */
export const Bar: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-1.5">
      <FilterChip {...args} name="org" value="payments" />
      <FilterChip {...args} name="status" value="failing" />
      <FilterChip {...args} name="rule" value="codeowners" />
      <FilterChip {...args} name={undefined} />
    </div>
  ),
};
