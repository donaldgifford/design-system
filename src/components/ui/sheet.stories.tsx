import { Button } from "@donaldgifford/design-system/components/button";
import { Input } from "@donaldgifford/design-system/components/input";
import { Label } from "@donaldgifford/design-system/components/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@donaldgifford/design-system/components/sheet";
import type { Meta, StoryObj } from "@storybook/react-vite";

const sides = ["top", "right", "bottom", "left"] as const;

const meta = {
  title: "Primitives/Sheet",
  component: SheetContent,
  subcomponents: { Sheet, SheetTrigger, SheetHeader, SheetTitle, SheetDescription, SheetFooter },
  args: { side: "right", showCloseButton: true },
  argTypes: {
    side: { control: "inline-radio", options: sides },
  },
  render: (args) => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>op_01</SheetTitle>
          <SheetDescription>CreateSandbox · started 2m ago</SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 px-(--sheet-padding)">
          <Label htmlFor="sheet-name">Name</Label>
          <Input id="sheet-name" defaultValue="payments-dev" />
        </div>
        <SheetFooter>
          <Button>Save</Button>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Without the corner close button; the footer's `SheetClose` dismisses it. */
export const NoCloseButton: Story = { args: { showCloseButton: false } };

/** One trigger per side. */
export const AllSides: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>{side}</SheetTrigger>
          <SheetContent {...args} side={side}>
            <SheetHeader>
              <SheetTitle>From the {side}</SheetTitle>
              <SheetDescription>A sheet anchored to the {side} edge.</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

/** The sheet, open on load. */
export const Open: Story = {
  tags: ["!autodocs"],
  render: (args) => (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
      <SheetContent {...args}>
        <SheetHeader>
          <SheetTitle>op_01</SheetTitle>
          <SheetDescription>CreateSandbox · started 2m ago</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
