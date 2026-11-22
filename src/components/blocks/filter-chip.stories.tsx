import { FilterBar } from "@donaldgifford/design-system/blocks/filter-bar";
import { FilterChip } from "@donaldgifford/design-system/blocks/filter-chip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
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

const types = ["adr", "design", "impl", "rfc"] as const;

/**
 * The toggle form: with `pressed`, one click turns a filter on or off
 * and nothing opens. A document directory's type filter, in a `FilterBar`.
 */
export const Toggles: Story = {
  render: function Render() {
    const [on, setOn] = useState<ReadonlySet<string>>(new Set(["design"]));
    return (
      <FilterBar
        label="Document type"
        count={`${on.size === 0 ? 94 : on.size * 23} of 94`}
        {...(on.size > 0 ? { onClear: () => setOn(new Set()) } : {})}
      >
        {types.map((type) => (
          <FilterChip
            key={type}
            pressed={on.has(type)}
            onPressedChange={(pressed) => {
              const next = new Set(on);
              if (pressed) next.add(type);
              else next.delete(type);
              setOn(next);
            }}
          >
            {type}
          </FilterChip>
        ))}
      </FilterBar>
    );
  },
};
