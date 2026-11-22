import { DetailsGrid } from "@donaldgifford/design-system/blocks/details-grid";
import { Disclosure } from "@donaldgifford/design-system/blocks/disclosure";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

const frontMatter = [
  { label: "id", value: "DESIGN-0026" },
  { label: "status", value: "Accepted" },
  { label: "author", value: "Donald Gifford" },
  { label: "created", value: "2026-10-02" },
];

const meta = {
  title: "Blocks/Disclosure",
  component: Disclosure,
  args: {
    label: "Front matter",
    value: "4 fields",
    defaultOpen: false,
    disabled: false,
    onOpenChange: fn(),
    children: <DetailsGrid items={frontMatter} layout="list" />,
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closed, the row shows the value and the content is not in the DOM. */
export const Default: Story = {};

/** Open, the value gives way to the content. */
export const Open: Story = { args: { defaultOpen: true } };

export const NoValue: Story = { args: { value: undefined } };

export const Disabled: Story = { args: { disabled: true } };

/** The page holds the state, here to say what the filters are while closed. */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <Disclosure
        {...args}
        label="Filters"
        value="type = design"
        open={open}
        onOpenChange={setOpen}
      >
        <p className="text-muted-foreground text-sm">The filter controls go here.</p>
      </Disclosure>
    );
  },
};
