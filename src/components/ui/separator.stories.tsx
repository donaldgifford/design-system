import { Separator } from "@donaldgifford/design-system/components/separator";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Primitives/Separator",
  component: Separator,
  args: { orientation: "horizontal", decorative: true },
  argTypes: {
    orientation: { control: "inline-radio", options: ["horizontal", "vertical"] },
  },
  render: (args) =>
    args.orientation === "vertical" ? (
      <div className="flex h-5 items-center gap-3 text-sm">
        <span>Overview</span>
        <Separator {...args} />
        <span>Events</span>
        <Separator {...args} />
        <span>Logs</span>
      </div>
    ) : (
      <div className="grid w-64 gap-3 text-sm">
        <span>Overview</span>
        <Separator {...args} />
        <span>Events</span>
      </div>
    ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

/** A vertical rule takes its parent's height. */
export const Vertical: Story = { args: { orientation: "vertical" } };

/** `decorative={false}` keeps the separator role for assistive tech. */
export const Semantic: Story = { args: { decorative: false } };
