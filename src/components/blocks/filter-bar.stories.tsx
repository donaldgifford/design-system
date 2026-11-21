import { FilterBar } from "@donaldgifford/design-system/blocks/filter-bar";
import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Blocks/FilterBar",
  component: FilterBar,
  args: { label: "Filters", count: "23 of 318" },
  render: (args) => (
    <FilterBar {...args}>
      <FilterChip name="org" value="payments" />
      <FilterChip name="status" value="failing" />
      <FilterChip />
    </FilterBar>
  ),
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The filters in force, the chip that adds one, "Clear", and the count. */
export const Default: Story = { args: { onClear: fn() } };

/** With no filter set the page leaves `onClear` out. */
export const NoFilters: Story = {
  args: { count: "318" },
  render: (args) => (
    <FilterBar {...args}>
      <FilterChip />
    </FilterBar>
  ),
};

/** The chips wrap; the count stays at the end of the last line. */
export const Narrow: Story = {
  args: { onClear: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};
