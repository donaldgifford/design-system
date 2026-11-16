import { Checkbox } from "@donaldgifford/design-system/components/checkbox";
import { Label } from "@donaldgifford/design-system/components/label";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  args: { defaultChecked: false, disabled: false, indeterminate: false },
  argTypes: {
    defaultChecked: { control: "boolean" },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
  // The story id keeps the label's target unique on the docs page.
  render: (args, { id }) => (
    <div className="flex items-center gap-2">
      <Checkbox {...args} id={`${id}-notify`} />
      <Label htmlFor={`${id}-notify`}>Notify me</Label>
    </div>
  ),
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Indeterminate: Story = { args: { indeterminate: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };

export const Invalid: Story = { args: { "aria-invalid": true } };

/** Nesting the control in the Label names it without an id. */
export const InLabel: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Label>
        <Checkbox {...args} defaultChecked />
        Watch this cluster
      </Label>
      <Label>
        <Checkbox {...args} />
        Email me on failure
      </Label>
    </div>
  ),
};
