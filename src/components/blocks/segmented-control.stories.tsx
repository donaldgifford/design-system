import { SegmentedControl } from "@donaldgifford/design-system/blocks/segmented-control";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const ranges = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
] as const;

const meta = {
  title: "Blocks/SegmentedControl",
  component: SegmentedControl,
  args: { label: "Range", options: ranges, value: "7d", onValueChange: fn() },
  // The control is controlled: the story holds the value the app would.
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <SegmentedControl
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
    );
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Arrow keys, Home and End move the selection; one segment is in the Tab order. */
export const Default: Story = {};

/** Two segments: a toggle between two views. */
export const TwoViews: Story = {
  args: {
    label: "Group by",
    value: "repository",
    options: [
      { value: "repository", label: "Repository" },
      { value: "package", label: "Package" },
    ],
  },
};
