import { Button } from "@donaldgifford/design-system/components/button";
import { Input } from "@donaldgifford/design-system/components/input";
import { Label } from "@donaldgifford/design-system/components/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@donaldgifford/design-system/components/popover";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/Popover",
  component: PopoverContent,
  args: { side: "bottom", align: "center", sideOffset: 4, alignOffset: 0 },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right", "inline-start", "inline-end"],
    },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    alignOffset: { control: "number" },
  },
  render: (args) => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
      <PopoverContent {...args}>
        <PopoverHeader>
          <PopoverTitle>Filters</PopoverTitle>
          <PopoverDescription>Narrow the list.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithForm: Story = {
  args: { align: "start" },
  render: (args, { id }) => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Set limits</PopoverTrigger>
      <PopoverContent {...args}>
        <PopoverHeader>
          <PopoverTitle>Limits</PopoverTitle>
          <PopoverDescription>Applied to new sandboxes in this project.</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor={`${id}-cpu`}>vCPU</Label>
            <Input id={`${id}-cpu`} type="number" defaultValue={4} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${id}-memory`}>Memory (GiB)</Label>
            <Input id={`${id}-memory`} type="number" defaultValue={8} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/** Open on load, for the canvas; kept off the docs page so it doesn't cover it. */
export const Open: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
      <PopoverContent {...args}>
        <PopoverHeader>
          <PopoverTitle>Filters</PopoverTitle>
          <PopoverDescription>Narrow the list.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};
