import { Label } from "@donaldgifford/design-system/components/label";
import { Switch } from "@donaldgifford/design-system/components/switch";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  args: { size: "default", disabled: false, defaultChecked: false },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "default"] },
  },
  render: function Render(args) {
    const id = useId();
    return (
      <div className="flex items-center gap-2">
        <Switch {...args} id={id} />
        <Label htmlFor={id}>Auto-stop</Label>
      </div>
    );
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

/** Each size, off and on. */
export const AllSizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {(["sm", "default"] as const).map((size) => (
        <div key={size} className="flex items-center gap-6">
          {[false, true].map((checked) => {
            const id = `switch-${size}-${checked ? "on" : "off"}`;
            return (
              <div key={id} className="flex items-center gap-2">
                <Switch {...args} id={id} size={size} defaultChecked={checked} />
                <Label htmlFor={id}>
                  {size}, {checked ? "on" : "off"}
                </Label>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  ),
};
