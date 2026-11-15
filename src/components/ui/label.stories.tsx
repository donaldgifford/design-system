import { Checkbox } from "@donaldgifford/design-system/components/checkbox";
import { Input } from "@donaldgifford/design-system/components/input";
import { Label } from "@donaldgifford/design-system/components/label";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/Label",
  component: Label,
  args: { children: "Reason" },
  // The story id keeps the label's target unique on the docs page.
  render: (args, { id }) => (
    <div className="grid w-72 gap-2">
      <Label {...args} htmlFor={`${id}-reason`} />
      <Input id={`${id}-reason`} placeholder="Why the change" />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Nesting the control names it with no htmlFor; the label lays it out in a row. */
export const WithNestedControl: Story = {
  args: { children: "Notify me" },
  render: ({ children, ...args }) => (
    <Label {...args}>
      <Checkbox />
      {children}
    </Label>
  ),
};

/** Inside a `group` with data-disabled="true", the label dims with its field. */
export const DisabledField: Story = {
  render: (args, { id }) => (
    <div data-disabled="true" className="group grid w-72 gap-2">
      <Label {...args} htmlFor={`${id}-reason`} />
      <Input id={`${id}-reason`} placeholder="Why the change" disabled />
    </div>
  ),
};
