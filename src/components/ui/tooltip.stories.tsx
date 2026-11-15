import { Button } from "@donaldgifford/design-system/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@donaldgifford/design-system/components/tooltip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconInfoCircle } from "@tabler/icons-react";

const sides = ["top", "right", "bottom", "left"] as const;

const meta = {
  title: "Primitives/Tooltip",
  component: TooltipContent,
  subcomponents: { Tooltip, TooltipTrigger, TooltipProvider },
  args: { side: "top", align: "center", sideOffset: 4, children: "Approval expires in 24h" },
  argTypes: {
    side: { control: "inline-radio", options: sides },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-32 items-center justify-center">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
  render: (args) => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Info" />}>
        <IconInfoCircle />
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A text trigger: the tooltip adds to its name rather than giving it one. */
export const TextTrigger: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>Approve</TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
};

/** One trigger per side. */
export const AllSides: Story = {
  render: (args) => (
    <div className="flex gap-2">
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>{side}</TooltipTrigger>
          <TooltipContent {...args} side={side}>
            On the {side}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/** The tooltip, open on load. */
export const Open: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <Tooltip defaultOpen>
      <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Info" />}>
        <IconInfoCircle />
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
};
