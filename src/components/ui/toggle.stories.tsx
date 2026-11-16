import { Toggle } from "@donaldgifford/design-system/components/toggle";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconBell, IconBold, IconPin } from "@tabler/icons-react";

const variants = ["default", "outline"] as const;
const sizes = ["sm", "default", "lg"] as const;

const meta = {
  title: "Primitives/Toggle",
  component: Toggle,
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    defaultPressed: false,
    "aria-label": "Bold",
    children: <IconBold />,
  },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    children: { control: false },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = { args: { variant: "outline" } };

export const Pressed: Story = { args: { defaultPressed: true } };

export const Disabled: Story = { args: { disabled: true } };

/** Icon and label; the visible text names it, so no aria-label. */
export const WithText: Story = {
  args: {
    "aria-label": undefined,
    children: (
      <>
        <IconPin aria-hidden="true" />
        Pin
      </>
    ),
  },
};

/** Every variant at every size, off and on. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {variants.map((variant) =>
        [false, true].map((pressed) => (
          <div key={`${variant}-${pressed}`} className="flex items-center gap-2">
            {sizes.map((size) => (
              <Toggle
                key={size}
                {...args}
                variant={variant}
                size={size}
                defaultPressed={pressed}
                aria-label={`Notifications, ${variant}, ${size}`}
              >
                <IconBell />
              </Toggle>
            ))}
            {sizes.map((size) => (
              <Toggle
                key={`text-${size}`}
                {...args}
                aria-label={undefined}
                variant={variant}
                size={size}
                defaultPressed={pressed}
              >
                {size}
              </Toggle>
            ))}
          </div>
        )),
      )}
    </div>
  ),
};
