import { Input } from "@donaldgifford/design-system/components/input";
import { Label } from "@donaldgifford/design-system/components/label";
import type { Meta, StoryObj } from "@storybook/react-vite";

const types = ["text", "email", "password", "number", "search", "url", "file"] as const;

const meta = {
  title: "Primitives/Input",
  component: Input,
  args: { type: "text", placeholder: "sbx-dev", disabled: false },
  argTypes: {
    type: { control: "select", options: types },
    disabled: { control: "boolean" },
  },
  // The story id keeps the label's target unique on the docs page.
  render: (args, { id }) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor={`${id}-name`}>Sandbox name</Label>
      <Input {...args} id={`${id}-name`} />
    </div>
  ),
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = { args: { disabled: true, defaultValue: "sbx-locked" } };

/** aria-invalid draws the destructive border; aria-describedby ties in the message. */
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "Sbx_1" },
  render: (args, { id }) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor={`${id}-name`}>Sandbox name</Label>
      <Input {...args} id={`${id}-name`} aria-describedby={`${id}-error`} />
      <p id={`${id}-error`} className="text-destructive text-sm">
        Lowercase letters, digits, and hyphens only.
      </p>
    </div>
  ),
};

export const File: Story = { args: { type: "file", placeholder: undefined } };

export const AllTypes: Story = {
  render: (args, { id }) => (
    <div className="grid w-72 gap-4">
      {types.map((type) => (
        <div key={type} className="grid gap-2">
          <Label htmlFor={`${id}-${type}`}>{type}</Label>
          <Input {...args} id={`${id}-${type}`} type={type} placeholder={type} />
        </div>
      ))}
    </div>
  ),
};
