import { ToggleGroup, ToggleGroupItem } from "@donaldgifford/design-system/components/toggle-group";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from "@tabler/icons-react";

const variants = ["default", "outline"] as const;
const sizes = ["sm", "default", "lg"] as const;
const ranges = ["day", "week", "month"];

const meta = {
  title: "Primitives/ToggleGroup",
  component: ToggleGroup,
  subcomponents: { ToggleGroupItem },
  args: {
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    multiple: false,
    disabled: false,
    defaultValue: ["day"],
    "aria-label": "Range",
  },
  argTypes: {
    variant: { control: "inline-radio", options: variants },
    size: { control: "inline-radio", options: sizes },
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
    spacing: { control: { type: "number", min: 0, max: 4, step: 1 } },
  },
  render: (args) => (
    <ToggleGroup {...args}>
      {ranges.map((range) => (
        <ToggleGroupItem key={range} value={range}>
          {range}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `spacing={0}` joins the items into one segmented control. */
export const Segmented: Story = { args: { variant: "outline", spacing: 0 } };

/** `multiple` lets several items stay pressed. */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["left", "center"], "aria-label": "Alignment" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <IconAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <IconAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <IconAlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Vertical: Story = { args: { orientation: "vertical", variant: "outline" } };

export const Disabled: Story = { args: { disabled: true } };

/** Every variant at every size, spaced and segmented. */
export const AllVariants: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {variants.map((variant) =>
        [2, 0].map((spacing) => (
          <div key={`${variant}-${spacing}`} className="flex flex-wrap items-center gap-4">
            {sizes.map((size) => (
              <ToggleGroup
                key={size}
                {...args}
                variant={variant}
                size={size}
                spacing={spacing}
                aria-label={`Range, ${variant}, ${size}, spacing ${spacing}`}
              >
                {ranges.map((range) => (
                  <ToggleGroupItem key={range} value={range}>
                    {range}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ))}
          </div>
        )),
      )}
    </div>
  ),
};
