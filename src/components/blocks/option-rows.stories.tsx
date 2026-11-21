import {
  OptionHeading,
  OptionItem,
  OptionSeparator,
} from "@donaldgifford/design-system/blocks/option-rows";
import { Button } from "@donaldgifford/design-system/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@donaldgifford/design-system/components/popover";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Blocks/OptionRows",
  component: OptionItem,
  args: { children: "payments", current: false, detail: "112", disabled: false, onClick: fn() },
  decorators: [
    (Story) => (
      <div className="w-56 rounded-md border bg-popover p-1.5 text-popover-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OptionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The row in force carries a check and `aria-current`. */
export const Current: Story = { args: { current: true } };

/** A row that cannot be chosen yet can say why in its detail. */
export const Disabled: Story = { args: { disabled: true, detail: "choose an owner first" } };

/** A picker: a heading, the rows, a separator, and a row that clears. */
export const Picker: Story = {
  render: (args) => (
    <>
      <OptionHeading>Owner</OptionHeading>
      <OptionItem onClick={args.onClick} detail="318" current>
        All owners
      </OptionItem>
      <OptionItem onClick={args.onClick} detail="112">
        payments
      </OptionItem>
      <OptionItem onClick={args.onClick} detail="74">
        platform
      </OptionItem>
      <OptionSeparator />
      <OptionItem onClick={args.onClick}>Clear</OptionItem>
    </>
  ),
};

/** Inside the `Popover` it is made for. */
export const InPopover: Story = {
  decorators: [(Story) => <Story />],
  render: (args) => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Owner: all</PopoverTrigger>
      <PopoverContent aria-label="Owner" align="start" className="w-56 gap-0 p-1.5">
        <OptionHeading>Owner</OptionHeading>
        <OptionItem onClick={args.onClick} detail="318" current>
          All owners
        </OptionItem>
        <OptionItem onClick={args.onClick} detail="112">
          payments
        </OptionItem>
        <OptionItem onClick={args.onClick} detail="74">
          platform
        </OptionItem>
      </PopoverContent>
    </Popover>
  ),
};
