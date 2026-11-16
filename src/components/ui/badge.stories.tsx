import { Badge } from "@donaldgifford/design-system/components/badge";
import type { Meta, StoryObj } from "@storybook/react-vite";

const variants = [
  "default",
  "secondary",
  "muted",
  "destructive",
  "success",
  "warning",
  "info",
  "pending",
  "approved",
  "ignored",
  "running",
  "outline",
  "ghost",
  "link",
] as const;

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  args: { children: "Badge", variant: "default", fill: "tinted" },
  argTypes: {
    variant: { control: "select", options: variants },
    fill: { control: "inline-radio", options: ["tinted", "filled"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = { args: { fill: "filled" } };

/** Every variant in both forms; `outline` has one. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {(["tinted", "filled"] as const).map((fill) => (
        <div key={fill} className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <Badge key={variant} {...args} variant={variant} fill={fill}>
              {variant}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};
