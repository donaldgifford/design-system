import { Label } from "@donaldgifford/design-system/components/label";
import { Textarea } from "@donaldgifford/design-system/components/textarea";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  args: { placeholder: "Why the change", disabled: false },
  render: function Render(args) {
    const id = useId();
    return (
      <div className="grid w-80 gap-2">
        <Label htmlFor={id}>Reason</Label>
        <Textarea {...args} id={id} />
      </div>
    );
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The field grows with its content (`field-sizing: content`). */
export const WithValue: Story = {
  args: {
    defaultValue:
      "Bump the node group to 1.33 ahead of the control plane.\nRollback: pin the launch template to the previous AMI.",
  },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: "Locked while syncing." } };

/** `aria-invalid` draws the destructive ring; the message is tied in with aria-describedby. */
export const Invalid: Story = {
  args: { "aria-invalid": true },
  render: function Render(args) {
    const id = useId();
    return (
      <div className="grid w-80 gap-2">
        <Label htmlFor={id}>Reason</Label>
        <Textarea {...args} id={id} aria-describedby={`${id}-error`} />
        <p id={`${id}-error`} className="text-sm text-destructive">
          A reason is required.
        </p>
      </div>
    );
  },
};
