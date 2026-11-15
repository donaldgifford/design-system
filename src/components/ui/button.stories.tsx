import { Button } from "@donaldgifford/design-system/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconExternalLink, IconPlus, IconRotateClockwise } from "@tabler/icons-react";

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
  "success",
  "warning",
  "info",
] as const;

const sizes = ["xs", "sm", "default", "lg"] as const;
const iconSizes = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;

const meta = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Button", variant: "default", size: "default", disabled: false },
  argTypes: {
    variant: { control: "select", options: variants },
    size: { control: "select", options: [...sizes, ...iconSizes] },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = { args: { variant: "destructive", children: "Delete" } };

export const Disabled: Story = { args: { disabled: true } };

export const WithIcon: Story = {
  render: (args) => (
    <Button {...args}>
      <IconRotateClockwise aria-hidden="true" />
      Restart
    </Button>
  ),
};

/** Icon-only buttons carry their name in aria-label. */
export const IconOnly: Story = {
  args: { size: "icon", variant: "outline", "aria-label": "Add" },
  render: (args) => (
    <Button {...args}>
      <IconPlus aria-hidden="true" />
    </Button>
  ),
};

/** Base UI composes through `render`; a non-button element needs `nativeButton={false}`. */
export const AsLink: Story = {
  args: { variant: "link", nativeButton: false },
  render: (args) => (
    <Button {...args} render={<a href="#docs" />}>
      Runbook
      <IconExternalLink aria-hidden="true" />
    </Button>
  ),
};

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** The text sizes, then the square icon sizes. */
export const AllSizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {sizes.map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {iconSizes.map((size) => (
          <Button key={size} {...args} size={size} aria-label={`Add (${size})`}>
            <IconPlus aria-hidden="true" />
          </Button>
        ))}
      </div>
    </div>
  ),
};
